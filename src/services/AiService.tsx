import { OpenAI } from "openai";
import { supabase } from "./supabaseClient.ts";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function updateAIKnowledge(user_id: string, new_score: any, score_participants: any, score_targets: any) {
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: formatScoreData(new_score, score_participants, score_targets) as string,
    });

    await supabase.from("compressed_chunks").upsert(
      [
        {
          user_id,
          source_type: "score",
          source_id: new_score.id,
          raw_data: formatScoreData(new_score, score_participants, score_targets),
          embedding: embeddingRes.data[0].embedding,
          squad_id: new_score.squad_id || null,
          team_id: new_score.team_id || null,
          tags: generateTags(new_score, score_targets),
        },
      ],
      { onConflict: "source_id" },
    );

    // Recompute user's average embedding vector
    const { data: chunks } = await supabase.from("compressed_chunks").select("embedding").eq("user_id", user_id);

    if (!chunks || chunks.length === 0) return;
    // Update in profile
    await supabase.from("user_ai_profiles").upsert({
      user_id,
      summary_embedding: chunks[0].embedding,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("AI knowledge update failed:", err);
  }
}

export function formatScoreData(score: any, participants: any[], targets: any[]) {
  if (!Array.isArray(participants)) participants = [];
  if (!Array.isArray(targets)) targets = [];

  const distances = targets.map((t) => t.distance).filter((d) => d != null);
  const shotsFired = targets.reduce((sum, t) => sum + (t.shots_fired || 0), 0);
  const hits = targets.reduce((sum, t) => sum + (t.target_hits || 0), 0);
  const hitRatio = shotsFired > 0 ? ((hits / shotsFired) * 100).toFixed(2) : "0.00";

  return `
SUMMARY:
- Assignment ID: ${score.assignment_session_id}
- Position: ${score.position}
- Distance(s): ${[...new Set(distances)].join(", ")}
- Wind Strength: ${score.wind_strength}
- Time Until First Shot: ${score.time_until_first_shot}
- Day/Night: ${score.day_night}
- Shots Fired: ${shotsFired}
- Hits: ${hits}
- Hit Ratio: ${hitRatio}%
- Participants: ${participants.map((p) => `${p.role} (${p.user_id})`).join(", ")}
  `;
}

export async function generateTrainingTasks(user_id: string) {
  await syncAllBenchmarks();

  try {
    console.log("🟡 Starting training task generation for:", user_id);

    // 1. Load user vector
    const { data: userProfile, error: profileError } = await supabase
      .from("user_ai_profiles")
      .select("summary_embedding")
      .eq("user_id", user_id)
      .single();

    if (profileError) {
      console.error("❌ Error fetching user profile:", profileError.message);
      return;
    }

    if (!userProfile?.summary_embedding) {
      console.warn("⚠️ No summary_embedding found for user:", user_id);
      return;
    }

    const userVector = Array.isArray(userProfile.summary_embedding) ? userProfile.summary_embedding : JSON.parse(userProfile.summary_embedding);

    console.log("✅ User vector loaded. Length:", userVector.length);

    // 2. Benchmark lookup
    const { data: benchmarks, error: benchmarkError } = await supabase.rpc("match_closest_benchmarks", {
      query_embedding: userVector,
      match_count: 3,
    });
    console.log(
      "🔍 Benchmark candidates:",
      benchmarks.map((c: any) => c.label),
    );

    if (benchmarkError) {
      console.error("❌ Error from match_closest_benchmarks:", benchmarkError.message);
      return;
    }

    if (!benchmarks || benchmarks.length === 0) {
      console.warn("⚠️ No benchmarks returned at all.");
      return;
    }

    const validBenchmarks = benchmarks.filter((b: any) => {
      if (Array.isArray(b.embedding)) return true;
      try {
        b.embedding = JSON.parse(b.embedding);
        return Array.isArray(b.embedding);
      } catch {
        return false;
      }
    });
    if (validBenchmarks.length === 0) {
      console.warn("⚠️ All returned benchmarks had null/invalid embeddings.");
      console.log("🔍 Raw benchmarks:", benchmarks);
      return;
    }

    console.log(`✅ Valid benchmarks found: ${validBenchmarks.length}`);

    const formattedBenchmarks =
      validBenchmarks.map((b: any, i: number) => `Benchmark ${i + 1} (${b.name}): ${b.embedding.slice(0, 10).join(", ")}...`).join("\n") ||
      "No valid benchmarks found";

    console.log("📦 Formatted Benchmarks:\n", formattedBenchmarks);

    const prompt = `
    You are acting as an elite sniper training intelligence agent. You receive high-dimensional embedding vectors representing the compressed, structured history of a sniper's real-world training data.
    
    Each embedding vector is derived from data collected across multiple sniper operations and scores. This includes:
    - Shooting position (lying, sitting, standing, operational)
    - Time until first shot
    - Assignment context and distance to target
    - Day/Night conditions
    - Wind strength and direction
    - Total shots fired and hit ratio
    - Multiple participants with varying roles (e.g., spotter, shooter)
    - Benchmarked vectors from high-performing soldiers with identical tag combinations (position + distance + wind + light condition)
    
    Your mission:
    Given the following user vector and 3 benchmark vectors, conduct a precise vector analysis and output training feedback in strict military context. You will compare the user vector to the closest matched benchmark embeddings. Do not explain your method. Do not generalize.
    
    ### Constraints:
    - All output must be formatted as **valid JSON**
    - The tone must be militarily formal and technically precise
    - You are forbidden from using vague language or soft suggestions
    
    ### Task 1: Identify Weaknesses
    Compare the user's vector embedding to the benchmark vectors. Identify clear deficits in skill using vector deviation logic:
    - Use directional clues (e.g. user = -0.042 vs benchmark = 0.003) to infer overcompensation or underperformance
    - Correlate dimensional deviation with known variables such as wind correction errors, recoil mismanagement, or slow response timing
    
    **Weakness Categories to Consider**:
    - Wind misjudgment under elevated wind_strength
    - Accuracy degradation at longer distances
    - Time-to-first-shot delay beyond acceptable threshold
    - Drift pattern under stress (e.g. standing + day + wind)
    - Inconsistent hit ratio between roles (if spotter missing)
    - Poor performance in mixed or operational positioning
    
    ### Task 2: Output Suggested Drills
    Design 3 tactical training drills based on the weaknesses found. Each drill must be:
    - Realistic
    - Loggable
    - Tied to one or more weakness categories
    - Focused and strict
    
    Each suggested task must contain:
    - "description": A one-liner drill instruction (e.g. "Simulate field op: prone firing at 800m reactive targets, focus: sub-6s first shot, 70% hit ratio minimum")
    - "position": lying | standing | sitting | operational
    - "distance": in meters
    - "weapon": one of the standard unit rifles
    - "target_type": silhouette | ring | reactive | moving
    - "scoring": how performance should be scored (e.g. hit ratio > 75% in 5 seconds per shot)
    - "constraints": any environmental or time-related limits
    - "justification": why this task was selected, with reference to vector deviation or sniper metric
    
    ### NEVER SAY:
    - “Improve awareness”
    - “Refine breath control”
    - “Get better under pressure”
    
    ### ALWAYS PREFER:
    - “Execute 3x10 shots at 700m in standing position with 3s timer, scoring based on hit zone accuracy under wind_strength 2”
    - “Simulate field op: prone firing at 800m reactive targets, focus: sub-6s first shot, 70% hit ratio minimum”
    
    ---
    
    Now generate a valid JSON in the following format:
    {
      "weakness_summary": [
        "Statement 1",
        "Statement 2",
        "Statement 3",
        "Statement 4"
      ],
      "suggested_tasks": [
        {
          "description": "Task 1 full description",
          "position": "lying",
          "distance": 800,
          "weapon": "SR-25",
          "target_type": "silhouette",
          "scoring": "hit ratio > 75% in 5 seconds per shot",
          "constraints": "wind_strength 2, day conditions",
          "justification": "Based on vector drift in dimension 34 and low hit ratio deviation from benchmark under wind conditions"
        },
        {
          "description": "Task 2 full description",
          ...
        },
        {
          "description": "Task 3 full description",
          ...
        }
      ]
    }
    
    Input:
    {
      "user_vector": [${userVector.slice(0, 64).join(", ")}...],
      "benchmarks": [
        ${validBenchmarks
          .map(
            (b: any, i: number) =>
              `{
                "name": "${b.name}",
                "tags": ["${b.tags?.join('", "') || ""}"],
                "embedding": [${b.embedding?.slice(0, 64).join(", ")}...]
              }`,
          )
          .join(",\n")}
      ]
    }
    `;

    console.log("🔍 Prompt:\n", prompt);

    // 4. Generate from OpenAI
    console.log("🧠 Sending prompt to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const output = response.choices[0]?.message?.content || "";
    console.log("✅ Suggested Tasks from GPT:\n", output);

    // 5. Save to Supabase
    const { error } = await supabase.from("user_ai_tasks").insert({
      user_id,
      generated_tasks: output,
      generated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Failed to save generated tasks:", error.message);
    } else {
      console.log("✅ Saved tasks to user_ai_tasks.");
    }

    return output;
  } catch (err) {
    console.error("💥 Task generation crashed:", err);
    return null;
  }
}

export async function generateTagCombosFromUserData(): Promise<{ label: string; tags: string[] }[]> {
  const { data, error } = await supabase.from("compressed_chunks").select("tags").not("tags", "is", null);

  if (error || !data) {
    console.error("Failed to load user tags:", error);
    return [];
  }

  const seen = new Set<string>();
  const combinations: { label: string; tags: string[] }[] = [];

  for (const row of data) {
    const tags: string[] = row.tags || [];
    const normalized = [...new Set(tags)].sort(); // deterministic order
    const key = normalized.join("+");
    if (!seen.has(key)) {
      seen.add(key);
      combinations.push({ label: key, tags: normalized });
    }
  }

  return combinations;
}

export async function syncAllBenchmarks() {
  const combos = await generateTagCombosFromUserData();

  for (const { label, tags } of combos) {
    const { error } = await supabase.rpc("generate_benchmarks_by_tag", {
      input_tags: tags,
      label,
    });

    if (error) {
      console.error(`❌ Benchmark ${label}:`, error.message);
    } else {
      console.log(`✅ Synced benchmark: ${label}`);
    }
  }
}

function generateTags(score: any, score_targets: any[]): string[] {
  const tags: string[] = [];

  if (score.position) tags.push(score.position);
  if (score.day_night) tags.push(score.day_night);
  if (score.wind_strength !== undefined && score.wind_strength !== null) tags.push(`wind${score.wind_strength}`);

  const distances = new Set(score_targets.map((t: any) => t.distance).filter(Boolean));
  distances.forEach((d) => tags.push(`${d}m`));

  return tags;
}
