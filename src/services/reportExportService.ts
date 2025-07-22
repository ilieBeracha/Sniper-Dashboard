import { getTrainingById } from "./trainingService";
import { getSessionStatsByTrainingId } from "./sessionService";
import { getTeamById } from "./teamService";
import { getSquadById } from "./squadService";
import { uploadFile } from "./fileService";
import { formatForSupabaseInsert } from "./embedSniperSession";

import { jsPDF } from "jspdf";
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
  trainingIds: string | string[];
  audience: ReportAudience;
  dateRange?: { from: string; to: string };
  sessionLimit?: number;
}

export async function prepareTrainingReport({
  trainingIds,
  audience,
  dateRange,
  sessionLimit = 1000,
}: PrepareReportOptions): Promise<PreparedReport> {
  const ids = Array.isArray(trainingIds) ? trainingIds : [trainingIds];

  const trainings: TrainingReport[] = [];

  for (const trainingId of ids) {
    const training = await getTrainingById(trainingId);
    const sessionStats = await getSessionStatsByTrainingId(trainingId, sessionLimit, 0);

    let team: Team | null = null;
    const teamId = (training as any)?.team_id || sessionStats?.[0]?.team_id;
    if (teamId) {
      team = await getTeamById(teamId);
    }

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

async function triggerDownload(report: PreparedReport) {
  if (typeof window === "undefined") return; // only run in browser

  const pdfBytes = generatePdf(report);

  // Create a blob & trigger download
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getFileName(report);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 0);
}

async function triggerSendToSuperior(report: PreparedReport) {
  try {
    const pdfBytes = generatePdf(report);

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const fileName = getFileName(report);

    // Convert blob to File (browser) or fallback to a File-like object (Node)
    const file = typeof File !== "undefined" ? new File([blob], fileName, { type: "application/pdf" }) : (blob as any);

    const teamId = report.trainings[0]?.team?.id;
    if (!teamId) throw new Error("Missing teamId for storage upload");

    const trainingId = report.trainings[0]?.training?.id;

    await uploadFile(file, teamId, trainingId);

    console.info("[prepareTrainingReport] PDF uploaded to Supabase storage for superior officer", {
      teamId,
      trainingId,
      fileName,
    });
  } catch (err) {
    console.error("[prepareTrainingReport] Failed to upload report for superior officer", err);
  }
}

async function embedForRAG(report: PreparedReport) {
  try {
    const embeddingsPayload: any[] = [];

    for (const tr of report.trainings) {
      const content = JSON.stringify({
        training: tr.training,
        sessionStats: tr.sessionStats,
        team: tr.team,
        squads: tr.squads,
      });

      embeddingsPayload.push({
        session_id: tr.training?.id,
        team_id: tr.team?.id,
        squad_id: tr.squads?.[0]?.id,
        content,
        embedding: null,
        created_at: new Date().toISOString(),
      });
    }

    // Format for Supabase insert – reuse helper for consistency
    const records = formatForSupabaseInsert({ embeddings: embeddingsPayload, sessionSummary: {} });
    console.info("[prepareTrainingReport] Generated embeddings payload (stub)", records);
    // TODO: call vector DB insert / OpenAI embedding API
  } catch (err) {
    console.error("[prepareTrainingReport] Failed embedding for RAG", err);
  }
}

// ---------------- PDF helpers ------------------ //

function generatePdf(report: PreparedReport): ArrayBuffer {
  // Safety: jsPDF exists only in browser – callers ensure this.
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Training Report", 10, 20);

  doc.setFontSize(10);

  report.trainings.forEach((tr, idx) => {
    const startY = 30 + idx * 80;
    doc.setFont("helvetica", "bold");
    doc.text(`Training #${idx + 1}: ${tr.training?.session_name ?? "-"}`, 10, startY);
    doc.setFont("helvetica", "normal");

    const details = [
      `Date: ${tr.training?.date ?? "-"}`,
      `Location: ${tr.training?.location ?? "-"}`,
      `Team: ${tr.team?.team_name ?? "-"}`,
      `Squads: ${(tr.squads || []).map((s) => s.squad_name).join(", ") || "-"}`,
      `Session stats records: ${tr.sessionStats.length}`,
    ].join(" | ");

    const lines = doc.splitTextToSize(details, 190);
    doc.text(lines, 10, startY + 6);
  });

  doc.setFontSize(8);
  doc.text(`Generated at ${report.generatedAt}`, 10, 290);

  return doc.output("arraybuffer");
}

function getFileName(report: PreparedReport) {
  const date = new Date(report.generatedAt).toISOString().split("T")[0];
  return `training-report-${date}.pdf`;
}
