import { getTrainingById } from "./trainingService";
import { getSessionStatsByTrainingId } from "./sessionService";
import { getTeamById } from "./teamService";
import { getSquadById } from "./squadService";
import { TrainingSession } from "@/types/training";
import { Team } from "@/types/team";
import { Squad } from "@/types/squad";

export type ReportAudience = "commander" | "superior" | "rag";

export interface TrainingReport {
  training: TrainingSession | null;
  sessionStats: any[];
  team: Team | null;
  squads: Squad[];
}

export interface PreparedReport {
  audience: ReportAudience;
  trainings: TrainingReport[];
  generatedAt: string;
  dateRange?: { from: string; to: string };
}

interface PrepareReportOptions {
  /** Single training id or a list of trainings to batch */
  trainingIds: string | string[];
  /** Audience that will consume the report */
  audience: ReportAudience;
  /** Optional date range to annotate the report */
  dateRange?: { from: string; to: string };
  /** Max session stats to pull per training (defaults to 1000)*/
  sessionLimit?: number;
}

/**
 * Collects all relevant data for a given training (or list of trainings) and prepares it
 * for downstream PDF generation, download, email send or RAG-embedding.
 *
 * The function guarantees that the sessionStatsStore (i.e. session stats table) is the
 * single source of truth for session information.
 */
export async function prepareTrainingReport({
  trainingIds,
  audience,
  dateRange,
  sessionLimit = 1000,
}: PrepareReportOptions): Promise<PreparedReport> {
  const ids = Array.isArray(trainingIds) ? trainingIds : [trainingIds];

  const trainings: TrainingReport[] = [];

  for (const trainingId of ids) {
    // 1. Pull training metadata
    const training = await getTrainingById(trainingId);

    // 2. Pull session statistics – single source of truth
    const sessionStats = await getSessionStatsByTrainingId(trainingId, sessionLimit, 0);

    // 3. Resolve team metadata – fall back to training.team_id, then sessionStats[0].team_id
    let team: Team | null = null;
    const teamId = (training as any)?.team_id || sessionStats?.[0]?.team_id;
    if (teamId) {
      team = await getTeamById(teamId);
    }

    // 4. Resolve squad metadata for every squad that appears in the session stats
    const squadIds = Array.from(new Set(sessionStats.map((s: any) => s.squad_id).filter(Boolean)));
    const squads: Squad[] = [];
    for (const squadId of squadIds) {
      const squad = await getSquadById(squadId);
      if (squad) squads.push(squad);
    }

    trainings.push({ training, sessionStats, team, squads });
  }

  const report: PreparedReport = {
    audience,
    trainings,
    generatedAt: new Date().toISOString(),
    ...(dateRange ? { dateRange } : {}),
  };

  // Trigger follow-up action depending on audience
  switch (audience) {
    case "commander":
      await triggerDownload(report);
      break;
    case "superior":
      await triggerSendToSuperior(report);
      break;
    case "rag":
      await embedForRAG(report);
      break;
  }

  return report;
}

// ---- Helpers ------------------------------------------------------------- //

/**
 * Placeholder for client-side PDF generation & download logic.
 * Keep implementation separate so it can be replaced with jspdf, pdf-make, etc.
 */
async function triggerDownload(report: PreparedReport) {
  // TODO: implement actual PDF generation & download in UI layer
  if (typeof window !== "undefined") {
    console.info("[prepareTrainingReport] Commander report ready for download", report);
  }
}

/**
 * Placeholder for emailing or uploading the report so that a superior officer can access it.
 */
async function triggerSendToSuperior(report: PreparedReport) {
  // TODO: integrate with e-mail / notification service
  console.info("[prepareTrainingReport] Report sent to superior officer", report);
}

/**
 * Placeholder for chunking & embedding the report so that a RAG model can consume it.
 */
async function embedForRAG(report: PreparedReport) {
  // TODO: integrate with embed service (e.g. OpenAI, Supabase Vector, etc.)
  console.info("[prepareTrainingReport] Report embedded for RAG consumption", report);
}