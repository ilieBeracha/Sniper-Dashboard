import { supabase } from "@/services/supabaseClient";
import { OpenAI } from "openai";
import { Score, ScoreParticipant, ScoreTarget } from "@/types/score";
import { userStore } from "@/store/userStore";

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

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

  const { data: embedData } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: {
      ...rawData,
      score_targets: [...rawData.score_targets],
    },
  });
  const embedding = embedData[0].embedding;

  const { error } = await supabase.from("compressed_chunks").insert({
    user_id: user.id,
    team_id: user.team_id,
    source_type: sourceType,
    source_id: sourceId,
    compressed: rawData,
    embedding,
    tags,
  });

  if (error) {
    console.error("Insert error:", error.message);
    throw new Error(error.message);
  }

  console.log(`✅ Inserted ${sourceType} [${sourceId}]`);
}

export async function embedScore(
  score: Score,
  scoreId: string,
  trainingId: string,
  scoreTargets: ScoreTarget[],
  scoreParticipants: ScoreParticipant[],
) {
  const tags = [
    "f3c",
    "score",
    "user",
    score.position ? `position:${score.position}` : null,
    score.assignment_session?.assignment?.assignment_name ? `assignment:${score.assignment_session.assignment.assignment_name}` : null,
    score.day_night ? `day_night:${score.day_night}` : null,
    trainingId ? `training_id:${trainingId}` : null,
    ...scoreTargets.flatMap((target) => [
      target.distance !== undefined ? `target_distance:${target.distance}` : null,
      target.shots_fired !== undefined ? `shots_fired:${target.shots_fired}` : null,
      target.target_hits !== undefined ? `target_hits:${target.target_hits}` : null,
    ]),
    ...scoreParticipants.map((p) => (p.user_duty ? `participant:${p.user_duty} ${p.weapon_id ?? ""} ${p.equipment_id ?? ""}` : null)),
    score.target_eliminated !== undefined ? `target_eliminated:${score.target_eliminated}` : null,
    score.distance !== undefined ? `distance:${score.distance}` : null,
    score.wind_strength !== undefined ? `wind_strength:${score.wind_strength}` : null,
    score.wind_direction !== undefined ? `wind_direction:${score.wind_direction}` : null,
    score.first_shot_hit !== undefined ? `first_shot_hit:${score.first_shot_hit}` : null,
    score.time_until_first_shot !== undefined ? `time_until_first_shot:${score.time_until_first_shot}` : null,
    score.note ? `note:${score.note.slice(0, 30)}` : null, // truncate note
  ].filter(Boolean) as string[];

  const data = {
    ...score,
    score_targets: scoreTargets,
    score_participants: scoreParticipants,
  };

  console.log("✅ clean score payload:", data);

  await embedAndInsertChunk({
    sourceType: "score",
    sourceId: scoreId,
    rawData: data,
    tags,
  });
}

export async function askAssistant(userPrompt: string) {
  const { user } = userStore.getState();

  const embedding = await getEmbedding(userPrompt);

  const { data: chunks, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding as any,
    match_threshold: 0.28,
    match_count: 10,
    user_id: user?.id || "",
  });

  if (error || !chunks) {
    console.error("Failed to retrieve matches:", error?.message);
    return "Sorry, I couldn’t find anything useful.";
  }

  const memoryBlob = chunks.map((c: any) => c.compressed).join("\n");

  const systemPrompt = `
  You are a squad assistant trained on compressed training records.
  Your memory consists of data like this:
  ${memoryBlob}
  Tags describe extra context such as:
  - participant:John Doe
  - position:lying
  - day_night:night
  
  Never mention compression or format. Just answer naturally as if you already know this user's performance history.
  `;

  const messages = [
    { role: "system", content: systemPrompt + "\n" + memoryBlob },
    { role: "user", content: userPrompt },
  ];

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages as any,
  });

  return chat.choices[0].message.content;
}

export async function getEmbedding(userPrompt: string) {
  const { data: embedData } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: userPrompt,
  });
  const embedding = embedData[0]?.embedding || [];
  return embedding;
  console.log("embedding", embedding);
}
