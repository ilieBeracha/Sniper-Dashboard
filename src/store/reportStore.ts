import jsPDF from "jspdf";
import { create } from "zustand";
import { getReportGrouping } from "@/services/reportService";
import { userStore } from "./userStore";
import { toastService } from "@/services/toastService";

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

  generateReport: async (data: any) => {
    const doc = new jsPDF();
    const team_id = userStore.getState().user?.team_id;
    if (!team_id) {
      toastService.error("No team found");
      return;
    }
    const { startDate, endDate } = data;
    const reportGrouping = await getReportGrouping(team_id, startDate, endDate);

    // Professional military-grade color scheme
    const primaryColor = [25, 35, 45]; // Deep Navy Blue
    const secondaryColor = [15, 25, 35]; // Darker Navy
    const accentColor = [140, 30, 30]; // Deep Red
    const lightGray = [245, 245, 245]; // Light Background
    const darkGray = [50, 50, 50]; // Dark Text
    const infoColor = [240, 242, 245]; // Light Info Background

    const drawRect = (x: number, y: number, w: number, h: number, color: number[]) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(x, y, w, h, "F");
    };

    const setTextStyle = (size: number, style: string = "normal", color: number[] = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(color[0], color[1], color[2]);
    };

    // Helper function to truncate text to fit within box
    const truncateText = (text: string, maxWidth: number, fontSize: number): string => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      if (textWidth <= maxWidth) return text;

      let truncated = text;
      while (doc.getTextWidth(truncated + "...") > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + "...";
    };

    // Section drawing functions
    const drawHeader = () => {
      drawRect(0, 0, 210, 35, primaryColor);
      drawRect(0, 0, 210, 2, accentColor);
      setTextStyle(20, "bold", [255, 255, 255]);
      doc.text("ISRAELI DEFENSE FORCES", 105, 15, { align: "center" });
      setTextStyle(14, "bold", [255, 255, 255]);
      doc.text("MARKSMANSHIP TRAINING REPORT", 105, 25, { align: "center" });
      setTextStyle(8, "normal", [255, 200, 200]);
      doc.text("CLASSIFIED - COMMAND EYES ONLY", 105, 32, { align: "center" });
    };

    const drawDateSection = (yPos: number) => {
      drawRect(15, yPos - 5, 180, 25, lightGray);
      drawRect(15, yPos - 5, 3, 25, accentColor);
      setTextStyle(11, "bold", darkGray);
      doc.text("OPERATIONAL PERIOD", 25, yPos + 4);
      setTextStyle(9, "normal", darkGray);
      const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
      doc.text(`From: ${formatDate(startDate)}`, 25, yPos + 14);
      doc.text(`To: ${formatDate(endDate)}`, 90, yPos + 14);
      doc.text(
        `Generated: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        25,
        yPos + 21,
      );
      return 30; // Return height used
    };

    const drawSummarySection = (yPos: number, stats: { total: number; withData: number; without: number; completion: number }) => {
      drawRect(15, yPos - 5, 180, 35, infoColor);
      drawRect(15, yPos - 5, 3, 35, primaryColor);
      setTextStyle(12, "bold", primaryColor);
      doc.text("COMMAND SUMMARY", 25, yPos + 4);
      
      setTextStyle(9, "bold", darkGray);
      doc.text("TOTAL PERSONNEL", 25, yPos + 14);
      setTextStyle(14, "bold", primaryColor);
      doc.text(stats.total.toString(), 25, yPos + 23);
      
      setTextStyle(9, "bold", darkGray);
      doc.text("WITH DATA", 75, yPos + 14);
      setTextStyle(14, "bold", primaryColor);
      doc.text(stats.withData.toString(), 75, yPos + 23);
      
      setTextStyle(9, "bold", darkGray);
      doc.text("PENDING", 115, yPos + 14);
      setTextStyle(14, "bold", accentColor);
      doc.text(stats.without.toString(), 115, yPos + 23);
      
      setTextStyle(9, "bold", darkGray);
      doc.text("COMPLETION", 155, yPos + 14);
      setTextStyle(14, "bold", primaryColor);
      doc.text(`${stats.completion}%`, 155, yPos + 23);
      
      return 40; // Return height used
    };

    const drawSimpleBarChart = (yPos: number, data: Array<{label: string, value: number}>, title: string) => {
      const chartHeight = 60;
      const chartWidth = 150;
      const barWidth = chartWidth / data.length - 5;
      const maxValue = Math.max(...data.map(d => d.value));
      
      // Chart background
      drawRect(25, yPos, chartWidth, chartHeight, [250, 250, 250]);
      
      // Title
      setTextStyle(10, "bold", darkGray);
      doc.text(title, 100, yPos - 5, { align: "center" });
      
      // Draw bars
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * (chartHeight - 20);
        const xPos = 30 + (index * (barWidth + 5));
        const yBarPos = yPos + chartHeight - barHeight - 15;
        
        // Bar
        drawRect(xPos, yBarPos, barWidth, barHeight, primaryColor);
        
        // Value on top
        setTextStyle(7, "normal", darkGray);
        doc.text(item.value.toFixed(1), xPos + barWidth/2, yBarPos - 2, { align: "center" });
        
        // Label
        setTextStyle(6, "normal", darkGray);
        doc.text(truncateText(item.label, barWidth, 6), xPos + barWidth/2, yPos + chartHeight - 5, { align: "center" });
      });
      
      return chartHeight + 15;
    };

    const drawFooter = () => {
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawRect(0, 285, 210, 12, secondaryColor);
        drawRect(0, 285, 210, 0.5, accentColor);
        setTextStyle(7, "normal", [255, 255, 255]);
        doc.text("IDF MARKSMANSHIP TRAINING COMMAND", 105, 290, { align: "center" });
        doc.text(`DOC-${Date.now().toString().substring(0, 10)}`, 15, 294);
        doc.text(`${i} / ${totalPages}`, 195, 294, { align: "right" });
        setTextStyle(5, "normal", [200, 200, 200]);
        doc.text("CLASSIFICATION: RESTRICTED", 105, 294, { align: "center" });
      }
    };

    // Start drawing the report
    drawHeader();
    
    let yPos = 45;
    yPos += drawDateSection(yPos);

    const totalUsers = reportGrouping.length;
    const usersWithStats = reportGrouping.filter((u: any) => {
      const userData = u.get_grouping_stats_for_report || u;
      return userData.weapon_stats || userData.position_stats;
    }).length;
    const usersWithoutStats = totalUsers - usersWithStats;
    const completionRate = Math.round((usersWithStats / totalUsers) * 100);

    // Draw summary section
    yPos += drawSummarySection(yPos, {
      total: totalUsers,
      withData: usersWithStats,
      without: usersWithoutStats,
      completion: completionRate
    });

    // Aggregate data for comparisons
    const weaponStats: Record<string, { avgSum: number; avgCount: number; best: number; users: Set<string> }> = {};
    const positionStats: Record<string, { avgSum: number; avgCount: number; best: number; users: Set<string> }> = {};

    reportGrouping.forEach((userWrapper: any) => {
      const user = userWrapper.get_grouping_stats_for_report || userWrapper;
      
      // Process weapon stats
      if (user.weapon_stats?.length) {
        user.weapon_stats.forEach((stat: any) => {
          const wpn = stat.weapon_type;
          const avg = parseFloat(stat.avg_cm);
          const best = parseFloat(stat.best_cm);
          
          if (!weaponStats[wpn]) {
            weaponStats[wpn] = { avgSum: 0, avgCount: 0, best: Infinity, users: new Set() };
          }
          weaponStats[wpn].avgSum += avg;
          weaponStats[wpn].avgCount += 1;
          weaponStats[wpn].best = Math.min(weaponStats[wpn].best, best);
          weaponStats[wpn].users.add(user.user_id);
        });
      }
      
      // Process position stats
      if (user.position_stats?.length) {
        user.position_stats.forEach((stat: any) => {
          const pos = stat.shooting_position;
          const avg = parseFloat(stat.avg_cm);
          const best = parseFloat(stat.best_cm);
          
          if (!positionStats[pos]) {
            positionStats[pos] = { avgSum: 0, avgCount: 0, best: Infinity, users: new Set() };
          }
          positionStats[pos].avgSum += avg;
          positionStats[pos].avgCount += 1;
          positionStats[pos].best = Math.min(positionStats[pos].best, best);
          positionStats[pos].users.add(user.user_id);
        });
      }
    });

    // WEAPON COMPARISON SECTION
    if (Object.keys(weaponStats).length > 0) {
      setTextStyle(14, "bold", primaryColor);
      doc.text("WEAPON SYSTEMS COMPARISON", 20, yPos);
      yPos += 15;

      drawRect(15, yPos - 5, 180, 8 + Object.keys(weaponStats).length * 12, infoColor);
      drawRect(15, yPos - 5, 3, 8 + Object.keys(weaponStats).length * 12, primaryColor);

      // Header row
      setTextStyle(8, "bold", darkGray);
      doc.text("WEAPON", 20, yPos + 3);
      doc.text("AVG (cm)", 70, yPos + 3);
      doc.text("BEST (cm)", 95, yPos + 3);
      doc.text("USERS", 120, yPos + 3);
      yPos += 8;

      // Weapon data rows
      Object.entries(weaponStats).forEach(([weapon, stats]) => {
        const avgCm = (stats.avgSum / stats.avgCount).toFixed(1);
        setTextStyle(8, "normal", darkGray);
        doc.text(truncateText(weapon, 45, 8), 20, yPos + 3);
        doc.text(avgCm, 70, yPos + 3);
        doc.text(stats.best.toFixed(1), 95, yPos + 3);
        doc.text(stats.users.size.toString(), 120, yPos + 3);


        yPos += 10;
      });
      yPos += 10;
      
      // Add bar chart for weapon comparison
      const weaponChartData = Object.entries(weaponStats)
        .map(([weapon, stats]) => ({
          label: weapon,
          value: parseFloat((stats.avgSum / stats.avgCount).toFixed(1))
        }))
        .slice(0, 5); // Limit to 5 weapons for display
      
      if (weaponChartData.length > 0) {
        yPos += drawSimpleBarChart(yPos, weaponChartData, "Average Grouping by Weapon (cm)");
      }
    }

    // POSITION COMPARISON SECTION
    if (Object.keys(positionStats).length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      setTextStyle(14, "bold", primaryColor);
      doc.text("SHOOTING POSITIONS COMPARISON", 20, yPos);
      yPos += 15;

      drawRect(15, yPos - 5, 180, 8 + Object.keys(positionStats).length * 12, infoColor);
      drawRect(15, yPos - 5, 3, 8 + Object.keys(positionStats).length * 12, primaryColor);

      // Header row
      setTextStyle(8, "bold", darkGray);
      doc.text("POSITION", 20, yPos + 3);
      doc.text("AVG (cm)", 70, yPos + 3);
      doc.text("BEST (cm)", 95, yPos + 3);
      doc.text("USERS", 120, yPos + 3);
      yPos += 8;

      // Position data rows
      Object.entries(positionStats).forEach(([position, stats]) => {
        const avgCm = (stats.avgSum / stats.avgCount).toFixed(1);
        setTextStyle(8, "normal", darkGray);
        doc.text(truncateText(position, 45, 8), 20, yPos + 3);
        doc.text(avgCm, 70, yPos + 3);
        doc.text(stats.best.toFixed(1), 95, yPos + 3);
        doc.text(stats.users.size.toString(), 120, yPos + 3);


        yPos += 10;
      });
      yPos += 10;
      
      // Add bar chart for position comparison
      const positionChartData = Object.entries(positionStats)
        .map(([position, stats]) => ({
          label: position,
          value: parseFloat((stats.avgSum / stats.avgCount).toFixed(1))
        }))
        .slice(0, 5); // Limit to 5 positions for display
      
      if (positionChartData.length > 0) {
        yPos += drawSimpleBarChart(yPos, positionChartData, "Average Grouping by Position (cm)");
      }
    }

    // INDIVIDUAL ASSESSMENTS
    setTextStyle(14, "bold", primaryColor);
    doc.text("INDIVIDUAL PERSONNEL DATA", 20, yPos);
    yPos += 15;

    reportGrouping.forEach((userWrapper: any, index: number) => {
      const user = userWrapper.get_grouping_stats_for_report || userWrapper;
      
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      // Compact user header
      drawRect(15, yPos - 3, 180, 15, primaryColor);
      drawRect(15, yPos - 3, 180, 1, accentColor); // Top accent
      setTextStyle(10, "bold", [255, 255, 255]);
      const userName = `${user.first_name.trim()} ${user.last_name.trim()}`.toUpperCase();
      doc.text(`${index + 1}. ${userName}`, 20, yPos + 5);
      setTextStyle(8, "normal", [200, 200, 200]);
      doc.text(`ID: ${user.user_id.substring(0, 8).toUpperCase()}`, 150, yPos + 5);
      yPos += 18;

      // Display weapon stats
      if (user.weapon_stats?.length) {
        drawRect(20, yPos - 2, 170, 8, secondaryColor);
        setTextStyle(8, "bold", [255, 255, 255]);
        doc.text("WEAPON PERFORMANCE", 25, yPos + 3);
        yPos += 10;
        
        drawRect(20, yPos - 2, 170, 6 + user.weapon_stats.length * 9, [250, 250, 250]);
        
        // Table header
        setTextStyle(7, "bold", darkGray);
        doc.text("WEAPON", 25, yPos + 3);
        doc.text("AVG (cm)", 90, yPos + 3);
        doc.text("BEST (cm)", 130, yPos + 3);
        yPos += 7;
        
        // Weapon data rows
        user.weapon_stats.forEach((stat: any) => {
          setTextStyle(7, "normal", darkGray);
          doc.text(truncateText(stat.weapon_type, 60, 7), 25, yPos + 3);
          doc.text(parseFloat(stat.avg_cm).toFixed(1), 90, yPos + 3);
          doc.text(parseFloat(stat.best_cm).toFixed(1), 130, yPos + 3);
          
          
          yPos += 8;
        });
        yPos += 8;
      }

      // Display position stats
      if (user.position_stats?.length) {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        
        drawRect(20, yPos - 2, 170, 8, secondaryColor);
        setTextStyle(8, "bold", [255, 255, 255]);
        doc.text("POSITION PERFORMANCE", 25, yPos + 3);
        yPos += 10;
        
        drawRect(20, yPos - 2, 170, 6 + user.position_stats.length * 9, [250, 250, 250]);
        
        // Table header
        setTextStyle(7, "bold", darkGray);
        doc.text("POSITION", 25, yPos + 3);
        doc.text("AVG (cm)", 90, yPos + 3);
        doc.text("BEST (cm)", 130, yPos + 3);
        yPos += 7;
        
        // Position data rows
        user.position_stats.forEach((stat: any) => {
          setTextStyle(7, "normal", darkGray);
          doc.text(truncateText(stat.shooting_position, 60, 7), 25, yPos + 3);
          doc.text(parseFloat(stat.avg_cm).toFixed(1), 90, yPos + 3);
          doc.text(parseFloat(stat.best_cm).toFixed(1), 130, yPos + 3);
          
          
          yPos += 8;
        });
        yPos += 8;
      }

      // No data case
      if (!user.weapon_stats?.length && !user.position_stats?.length) {
        // No data box
        drawRect(20, yPos - 2, 170, 12, lightGray);
        drawRect(20, yPos - 2, 2, 12, primaryColor);
        setTextStyle(8, "normal", darkGray);
        doc.text("No training data available for this period", 25, yPos + 5);
        yPos += 15;
      }

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 8;
    });

    // Draw footer on all pages
    drawFooter();

    set({ report: doc.output("blob") });
    doc.save(`Training_Report_${startDate}_to_${endDate}.pdf`);
    set({ isGenerating: false });
  },

  generateSampleReport: (data: any) => {
    set({ report: data });
  },
}));
