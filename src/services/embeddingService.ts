import { supabase } from "@/services/supabaseClient";
import { OpenAI } from "openai";
import { Score, ScoreParticipant, ScoreTarget } from "@/types/score";
import { userStore } from "@/store/userStore";
import { TrainingSession } from "@/types/training";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function embedAndInsertChunk({
  sourceType,
  sourceId,
  rawData,
  tags = [],
}: {
  sourceType: string;
  sourceId: string;
  rawData: any;
  tags: string[];
}) {
  const user = userStore.getState().user;
  if (!user?.id || !user?.team_id) return;

  const serialized = JSON.stringify(rawData);

  const { data: embedData } = await openai.embeddings.create({
    model: "text-embedding-ada-002", // optionally switch to text-embedding-3-small
    input: serialized,
  });

  const embedding = embedData[0]?.embedding;
  if (!embedding) {
    console.error("Failed to generate embedding.");
    return;
  }

  const { error } = await supabase.from("compressed_chunks").insert({
    user_id: user.id,
    team_id: user.team_id,
    source_type: sourceType,
    source_id: sourceId,
    compressed: serialized, // still using the same DB column
    embedding,
    tags,
  });

  if (error) {
    console.error("Insert error:", error.message);
    throw new Error(error.message);
  }

  console.log(`✅ Inserted ${sourceType} [${sourceId}]`);
}

export async function embedTraining(training: TrainingSession, trainingId: string) {
  const tags = [
    "f3c",
    "training",
    training.session_name ? `session_name:${training.session_name}` : null,
    training.location ? `location:${training.location}` : null,
    training.status ? `status:${training.status}` : null,
    training.date ? `date:${training.date}` : null,
    training.creator_id ? `creator:${training.creator_id}` : null,
  ].filter(Boolean) as string[];

  await embedAndInsertChunk({
    sourceType: "training",
    sourceId: trainingId,
    rawData: training,
    tags,
  });
}

export async function embedScore(
  score: Score,
  scoreId: string,
  trainingId: string,
  scoreTargets: ScoreTarget[],
  scoreParticipants: ScoreParticipant[],
) {
  const participant = scoreParticipants?.[0];
  const weapon_id = participant?.weapon_id ?? null;
  const position = score.position ?? null;
  const assignment_name = score.assignment_session?.assignment?.assignment_name ?? null;

  const tags = [
    "f3c",
    "score",
    "user",
    score.created_at ? `created_at:${score.created_at}` : null,
    position ? `position:${position}` : null,
    assignment_name ? `assignment:${assignment_name}` : null,
    score.day_night ? `day_night:${score.day_night}` : null,
    trainingId ? `training_id:${trainingId}` : null,
    ...scoreTargets.flatMap((target) => [
      target.distance !== undefined ? `target_distance:${target.distance}` : null,
      target.shots_fired !== undefined ? `shots_fired:${target.shots_fired}` : null,
      target.target_hits !== undefined ? `target_hits:${target.target_hits}` : null,
    ]),
    participant?.user_duty ? `participant:${participant.user_duty} ${weapon_id ?? ""}` : null,
  ].filter(Boolean) as string[];

  const avg_hit_ratio = (() => {
    const totalHits = scoreTargets.reduce((sum, t) => sum + (t.target_hits || 0), 0);
    const totalShots = scoreTargets.reduce((sum, t) => sum + (t.shots_fired || 0), 0);
    return totalShots > 0 ? +(totalHits / totalShots).toFixed(2) : 0;
  })();

  const session_count = 1; // single score entry

  const distances = scoreTargets.map((t) => t.distance).filter((d) => typeof d === "number");

  // 🧠 Generate all benchmark pairs from this score
  const benchmarkCombos = [
    { category: "weapon", p_weapon_id: weapon_id },
    { category: "position", p_position: position },
    { category: "distance", p_distance: distances[0] },
    { category: "weapon_position", p_weapon_id: weapon_id, p_position: position },
    { category: "weapon_distance", p_weapon_id: weapon_id, p_distance: distances[0] },
    { category: "weapon_assignment", p_weapon_id: weapon_id, p_assignment_name: assignment_name },
    { category: "distance_position", p_distance: distances[0], p_position: position },
    { category: "weapon_distance_position", p_weapon_id: weapon_id, p_distance: distances[0], p_position: position },
    {
      category: "weapon_distance_position_assignment",
      p_weapon_id: weapon_id,
      p_distance: distances[0],
      p_position: position,
      p_assignment_name: assignment_name,
    },
  ];

  for (const combo of benchmarkCombos) {
    await supabase.rpc("embed_benchmark", {
      p_category: combo.category,
      p_weapon_id: combo.p_weapon_id ?? null,
      p_distance: combo.p_distance ?? null,
      p_position: combo.p_position ?? null,
      p_assignment_name: combo.p_assignment_name ?? null,
      p_avg_hit_ratio: avg_hit_ratio,
      p_session_count: session_count,
    });
  }

  console.log("benchmarks", benchmarkCombos);

  // Embed original score
  const data = {
    ...score,
    score_targets: scoreTargets,
    score_participants: scoreParticipants,
  };

  await embedAndInsertChunk({
    sourceType: "score",
    sourceId: scoreId,
    rawData: data,
    tags,
  });
}

export async function askAssistant(userPrompt: string) {
  const { user } = userStore.getState();
  if (!user?.id) return "User not authenticated.";

  const embedding = await getEmbedding(userPrompt);

  const { data: chunks, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding as any,
    match_threshold: 0.28,
    match_count: 10,
    user_id: user.id,
  });

  if (error || !chunks || !chunks.length) {
    console.error("Failed to retrieve matches:", error?.message);
    return "Sorry, I couldn’t find anything useful.";
  }

  const memoryBlob = chunks
    .map((c: any) => {
      const prefix = c.source_type?.toUpperCase?.() ?? "UNKNOWN";
      try {
        return `[${prefix}] ${JSON.stringify(JSON.parse(c.compressed), null, 0)}`;
      } catch {
        return `[${prefix}] ${c.compressed}`;
      }
    })
    .join("\n");

  const chat = await openai.chat.completions.create({
    model: "gpt-4-0613", // or "gpt-4-1106", etc.
    messages: [
      {
        role: "system",
        content: `
        You are a military training assistant.
        
        Instructions:
        - Return no more than 3 precise suggestions per user.
        - Each suggestion must include a measurable objective (e.g., increase hit ratio with weapon X at 600m).
        - Use benchmarks to compare. Only create a suggestion if the user's data clearly underperforms.
        - Do not generate generic feedback.
        - Skip topics with no data or where the user is performing well.
        
        Respond in this JSON format:
        { topic, issue, recommendation, objective }
        memory: ${memoryBlob}
        
        `,
      },
      {
        role: "user",
        content: "Give me a summary of what I should improve based on my performance.",
      },
    ],
    tools: tools as any,
    tool_choice: {
      type: "function",
      function: { name: "getPerformanceSummary" },
    },
  });

  const toolCall = chat.choices[0].message.tool_calls?.[0];

  if (toolCall?.function?.arguments) {
    const structuredOutput = JSON.parse(toolCall.function.arguments);
    const suggestions = structuredOutput.suggestions;

    // fetch existing tasks
    const { data: existingTasks } = await supabase.from("user_ai_tasks").select("*").eq("user_id", user.id);

    const remainingSlots = 3 - (existingTasks?.length || 0);
    const tasksToSave = suggestions.slice(0, remainingSlots);

    for (const task of tasksToSave) {
      await supabase.from("user_ai_tasks").insert({
        user_id: user.id,
        topic: task.topic,
        issue: task.issue,
        recommendation: task.recommendation,
        objective: task.objective,
      });
    }

    return structuredOutput;
  }
}
const tools = [
  {
    type: "function",
    function: {
      name: "getPerformanceSummary",
      description: "Return performance-based insights and training suggestions for the soldier",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string", description: "ID of the soldier" },
          role: { type: "string", description: "Soldier's role (e.g. Sniper)" },
          suggestions: {
            type: "array",
            description: "List of issues and recommendations",
            items: {
              type: "object",
              properties: {
                topic: { type: "string" },
                issue: { type: "string" },
                recommendation: { type: "string" },
                objective: { type: "string", description: "What the user should work on with a measurable outcome" },
              },
              required: ["topic", "issue", "recommendation", "objective"],
            },
          },
          last_training_id: { type: "string" },
          last_training_date: { type: "string" },
        },
        required: ["user_id", "role", "suggestions", "last_training_id", "last_training_date"],
      },
    },
  },
];

export async function getEmbedding(userPrompt: string) {
  const { data: embedData } = await openai.embeddings.create({
    model: "text-embedding-ada-002", // or "text-embedding-3-small"
    input: userPrompt,
  });

  return embedData[0]?.embedding || [];
}

export async function getTasks(user_id: string) {
  const { data: tasks } = await supabase.from("user_ai_tasks").select("*").eq("user_id", user_id);
  return tasks || [];
}
