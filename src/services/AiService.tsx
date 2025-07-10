import { OpenAI } from "openai";
import { supabase } from "./supabaseClient.ts";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function updateAIKnowledge(user_id: string, new_score: any, score_participants: any, score_targets: any) {
  try {
    setTimeout(async () => {
      const { data: profile } = await supabase.from("user_ai_profiles").select("*").eq("user_id", user_id).single();

      const formattedData = formatScoreData(new_score, score_participants, score_targets);

      const { data: teamAverages } = await supabase.rpc("get_user_relative_performance", { input_user_id: user_id });

      const prompt = `You are an elite AI sniper coach.

CURRENT UNDERSTANDING:
${profile?.ai_summary || "None"}

NEW SCORE DATA:
${formattedData}

RELATIVE TEAM AVERAGES FOR COMPARISON:
${JSON.stringify(teamAverages, null, 2)}

Your job is to:
1. Deeply analyze this user's performance trends.
2. Determine the most statistically significant weak dimensions (e.g. standing+wind=3, or kneeling+600m).
3. Compare them to what top-performing users in similar contexts are achieving.
4. Identify specific patterns of improvement or decline.
5. Recommend 1–3 extremely targeted training tasks to fix the most urgent and impactful weaknesses.
6. Structure your answer clearly: 
   - Updated Strengths
   - Updated Weaknesses
   - Suggested Tasks (with reason and expected outcome)

Keep it short, clear, and tailored only to the weak links. Avoid general advice.
Respond with your updated knowledge and task plan.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const newSummary = response.choices[0].message.content || "";

      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: newSummary,
      });

      await supabase.from("user_ai_profiles").upsert({
        user_id,
        ai_summary: newSummary,
        summary_embedding: embeddingRes.data[0].embedding,
        updated_at: new Date().toISOString(),
      });
    }, 0);
  } catch (err) {
    console.error("Background AI knowledge update failed:", err);
  }
}

function formatScoreData(score: any, participants: any[], targets: any[]) {
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
