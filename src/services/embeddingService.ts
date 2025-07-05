import { supabase } from "@/services/supabaseClient";
import { OpenAI } from "openai";
import { compressToF3C } from "@/utils/compressToF3C";
import { Score, ScoreParticipant, ScoreTarget } from "@/types/score";
import { userStore } from "@/store/userStore";
import { TrainingSession } from "@/types/training";

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export async function embedChunk({
  userId,
  teamId,
  sourceType,
  sourceId,
  tags = [],
  compressed,
}: {
  userId: string;
  sourceType: string;
  teamId: string;
  sourceId: string;
  tags?: string[];
  compressed: string;
}) {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: compressed,
  });

  const { error } = await supabase.from("compressed_chunks").insert({
    user_id: userId,
    team_id: teamId,
    source_type: sourceType,
    source_id: sourceId,
    compressed,
    embedding: embeddingRes.data[0].embedding,
    tags,
  });

  if (error) {
    console.error("Failed to insert embedded chunk:", error.message);
    throw error;
  }
}

export async function embedTraining(training: TrainingSession, trainingId: string) {
  const user = userStore.getState().user;
  const compressed = await compressToF3C(training);
  const tags = [
    "f3c",
    "training",
    training.session_name ? `session_name:${training.session_name}` : null,
    training.location ? `location:${training.location}` : null,
    training.status ? `status:${training.status}` : null,
    training.date ? `date:${training.date}` : null,
    training.creator_id ? `creator:${training.creator_id}` : null,
  ].filter(Boolean) as string[];
  const res = embedChunk({
    userId: user?.id || "",
    sourceType: "training",
    sourceId: trainingId,
    compressed,
    tags: tags as string[],
    teamId: user?.team_id || "",
  });
  console.log(res);
}

export async function embedScore(
  score: Score,
  scoreId: string,
  trainingId: string,
  scoreTargets: ScoreTarget[],
  scoreParticipants: ScoreParticipant[],
) {
  const user = userStore.getState().user;
  const compressed = await compressToF3C(score);

  if (!compressed || compressed.endsWith("::")) {
    console.warn("Skipping embedding due to invalid compressed output.", compressed);
    return;
  }

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
    ...scoreParticipants.map((p) => (p.user_duty ? `participant:${p.user_duty} ${p.weapon_id} ${p.equipment_id}, ` : null)),
    score.target_eliminated !== undefined ? `target_eliminated:${score.target_eliminated}` : null,
    score.day_night,
    score.distance !== undefined ? `distance:${score.distance}` : null,
    score.wind_strength !== undefined ? `wind_strength:${score.wind_strength}` : null,
    score.wind_strength?.toString(),
    score.wind_direction !== undefined ? `wind_direction:${score.wind_direction}` : null,
    score.first_shot_hit !== undefined ? `first_shot_hit:${score.first_shot_hit}` : null,
    score.time_until_first_shot !== undefined ? `time_until_first_shot:${score.time_until_first_shot}` : null,
    score.note ? `note:${score.note}` : null,
  ].filter(Boolean) as string[];

  const res = embedChunk({
    userId: user?.id || "",
    sourceType: "score",
    sourceId: scoreId,
    teamId: user?.team_id || "",
    compressed,
    tags,
  });
  console.log(res);
}

export async function askAssistant(userPrompt: string) {
  const { user } = userStore.getState();

  const embed = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: userPrompt,
  });
  console.log("embedembed", embed);
  const queryEmbedding = embed.data[0].embedding;

  const { data: chunks, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: 0.78,
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
