export async function processTrainingSessionToEmbeddings(sessionObject: any) {
  const { sessionData, participants, targets } = sessionObject;

  // Create a map of participants for quick lookup
  const participantMap = new Map();
  participants.forEach((p: any) => {
    participantMap.set(p.user_id, p);
  });

  const embeddings: any[] = [];

  // Process each target and its engagements
  targets.forEach((target: any) => {
    const { distance, mistakeCode, engagements } = target;

    engagements.forEach((engagement: any) => {
      const { user_id, shots_fired, target_hits } = engagement;
      const participant = participantMap.get(user_id);

      if (!participant) return; // Skip if participant not found

      // Calculate accuracy percentage
      const accuracy = shots_fired > 0 ? ((target_hits / shots_fired) * 100).toFixed(1) : "0.0";

      // Determine distance category
      const distanceCategory = getDistanceCategory(distance);

      // Determine accuracy category
      const accuracyCategory = getAccuracyCategory(parseFloat(accuracy));

      // Create compressed content with comprehensive data
      const compressedContent = [
        `Sniper ${user_id}`,
        `Position: ${participant.position}`,
        `Period: ${sessionData.dayPeriod}`,
        `Distance: ${distance}m (${distanceCategory})`,
        `Accuracy: ${accuracy}% (${accuracyCategory})`,
        `Shots: ${shots_fired}`,
        `Hits: ${target_hits}`,
        `Time to First Shot: ${sessionData.timeToFirstShot}s`,
        `Weapon: ${participant.weapon_id}`,
        `Equipment: ${participant.equipment_id || "None"}`,
        mistakeCode ? `Mistake: ${mistakeCode}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      // Create embedding record
      const embeddingRecord = {
        user_id: user_id,
        team_id: sessionData.team_id,
        squad_id: sessionData.squad_id,
        session_id: sessionData.training_session_id,
        content: compressedContent,
        // Categories for vector grouping (can be used in metadata)
        categories: {
          position: participant.position.toLowerCase(),
          dayPeriod: sessionData.dayPeriod,
          distanceCategory: distanceCategory,
          accuracyCategory: accuracyCategory,
          distance: distance,
          accuracy: parseFloat(accuracy),
          timeToFirstShot: sessionData.timeToFirstShot,
          duty: participant.user_duty,
        },
      };

      embeddings.push(embeddingRecord);
    });
  });

  return {
    embeddings,
    sessionSummary: createSessionSummary(sessionData, participants, targets),
    categorizedData: categorizeEmbeddings(embeddings),
  };
}

/**
 * Categorizes distance into ranges
 */
function getDistanceCategory(distance: number) {
  if (distance < 300) return "Close Range";
  if (distance < 600) return "Medium Range";
  if (distance < 1000) return "Long Range";
  return "Extreme Range";
}

/**
 * Categorizes accuracy into performance levels
 */
function getAccuracyCategory(accuracy: number) {
  if (accuracy >= 80) return "Excellent";
  if (accuracy >= 60) return "Good";
  if (accuracy >= 40) return "Average";
  if (accuracy >= 20) return "Poor";
  return "Very Poor";
}

/**
 * Creates a session-level summary embedding
 */
function createSessionSummary(sessionData: any, participants: any, targets: any) {
  const totalShots = targets.reduce(
    (sum: number, target: any) => sum + target.engagements.reduce((engSum: number, eng: any) => engSum + eng.shots_fired, 0),
    0,
  );

  const totalHits = targets.reduce(
    (sum: number, target: any) => sum + target.engagements.reduce((engSum: number, eng: any) => engSum + eng.target_hits, 0),
    0,
  );

  const overallAccuracy = totalShots > 0 ? ((totalHits / totalShots) * 100).toFixed(1) : "0.0";

  const averageDistance = targets.length > 0 ? (targets.reduce((sum: number, t: any) => sum + t.distance, 0) / targets.length).toFixed(0) : "0";

  return {
    user_id: null, // Session-level summary
    team_id: sessionData.team_id,
    squad_id: sessionData.squad_id,
    session_id: sessionData.training_session_id,
    content: [
      `Training Session Summary`,
      `Team: ${sessionData.team_id}`,
      `Squad: ${sessionData.squad_id}`,
      `Period: ${sessionData.dayPeriod}`,
      `Participants: ${participants.length}`,
      `Targets: ${targets.length}`,
      `Average Distance: ${averageDistance}m`,
      `Overall Accuracy: ${overallAccuracy}%`,
      `Total Shots: ${totalShots}`,
      `Total Hits: ${totalHits}`,
      `Time to First Shot: ${sessionData.timeToFirstShot}s`,
    ].join(" | "),
    categories: {
      type: "session_summary",
      dayPeriod: sessionData.dayPeriod,
      participantCount: participants.length,
      targetCount: targets.length,
      overallAccuracy: parseFloat(overallAccuracy),
      timeToFirstShot: sessionData.timeToFirstShot,
    },
  };
}

/**
 * Groups embeddings by various categories for analysis
 */
function categorizeEmbeddings(embeddings: any) {
  const categorized = {
    byPosition: {} as Record<string, any[]>,
    byDayPeriod: {} as Record<string, any[]>,
    byDistanceCategory: {} as Record<string, any[]>,
    byAccuracyCategory: {} as Record<string, any[]>,
    byUser: {} as Record<string, any[]>,
  };

  embeddings.forEach((embedding: any) => {
    const { categories, user_id } = embedding;

    // Group by position
    if (!categorized.byPosition[categories.position]) {
      categorized.byPosition[categories.position] = [];
    }
    categorized.byPosition[categories.position].push(embedding);

    // Group by day period
    if (!categorized.byDayPeriod[categories.dayPeriod]) {
      categorized.byDayPeriod[categories.dayPeriod] = [];
    }
    categorized.byDayPeriod[categories.dayPeriod].push(embedding);

    // Group by distance category
    if (!categorized.byDistanceCategory[categories.distanceCategory]) {
      categorized.byDistanceCategory[categories.distanceCategory] = [];
    }
    categorized.byDistanceCategory[categories.distanceCategory].push(embedding);

    // Group by accuracy category
    if (!categorized.byAccuracyCategory[categories.accuracyCategory]) {
      categorized.byAccuracyCategory[categories.accuracyCategory] = [];
    }
    categorized.byAccuracyCategory[categories.accuracyCategory].push(embedding);

    // Group by user
    if (!categorized.byUser[user_id]) {
      categorized.byUser[user_id] = [];
    }
    categorized.byUser[user_id].push(embedding);
  });

  return categorized;
}

/**
 * Formats embeddings for Supabase insertion
 * Note: The 'embedding' field will be populated by your embedding service
 */
export function formatForSupabaseInsert(processedData: any) {
  const { embeddings, sessionSummary } = processedData;

  // Combine individual embeddings with session summary
  const allEmbeddings = [...embeddings, sessionSummary];

  return allEmbeddings.map((record) => ({
    user_id: record.user_id,
    team_id: record.team_id,
    squad_id: record.squad_id,
    session_id: record.session_id,
    content: record.content,
    embedding: null, // This will be populated by your embedding service (OpenAI, etc.)
    created_at: new Date().toISOString(), // created_at is auto-generated by Supabase
  }));
}
