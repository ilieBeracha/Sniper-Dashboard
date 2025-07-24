import jsPDF from "jspdf";
import { create } from "zustand";

interface ReportStore {
  report: any;
  isGenerating: boolean;
  setReport: (report: any) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  generateReport: (data: any) => void;
  generateSampleReport: (data: any) => void;
}

export const reportStore = create<ReportStore>((set) => ({
  report: null,
  isGenerating: false,
  setReport: (report) => set({ report }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  generateReport: (data: any) => {
    const doc = new jsPDF();
    const { startDate, endDate, sections, squads, participants, sessions, targets, equipment, weapons, teamSquadComparison } = data;

    // Basic Summary
    doc.text("Basic Summary", 10, 10);
    doc.text(`Start Date: ${startDate}`, 10, 20);
    doc.text(`End Date: ${endDate}`, 10, 30);
    doc.text(`Sections: ${sections.join(", ")}`, 10, 40);
    doc.text(`Squads: ${squads.join(", ")}`, 10, 50);
    doc.text(`Participants: ${participants.join(", ")}`, 10, 60);
    doc.text(`Sessions: ${sessions.join(", ")}`, 10, 70);
    doc.text(`Targets: ${targets.join(", ")}`, 10, 80);
    doc.text(`Equipment: ${equipment.join(", ")}`, 10, 90);
    doc.text(`Weapons: ${weapons.join(", ")}`, 10, 100);
    doc.text(`Team Squad Comparison: ${teamSquadComparison.join(", ")}`, 10, 110);
    set({ report: doc.output("blob") });

    doc.save("report.pdf");
    set({ isGenerating: false });
  },

  generateSampleReport: (data: any) => {
    set({ report: data });
  },
}));
