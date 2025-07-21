import { TrainingSession, TrainingParticipant } from '@/types/training';
import { 
  TrainingTeamAnalytics, 
  SquadStats, 
  WeaponUsageStats, 
  DayNightPerformance,
  SquadPerformance,
  TrainingEffectiveness 
} from '@/types/performance';
import { User } from '@/types/user';
import { Weapon } from '@/types/weapon';
import { Equipment } from '@/types/equipment';

interface TrainingReportData {
  training: TrainingSession;
  participants: TrainingParticipant[];
  analytics: TrainingTeamAnalytics;
  squadStats: SquadStats[];
  weaponStats: WeaponUsageStats[];
  dayNightPerformance: DayNightPerformance[];
  squadPerformance: SquadPerformance[];
  trainingEffectiveness: TrainingEffectiveness[];
  weapons: Weapon[];
  equipment: Equipment[];
}

interface PDFStyles {
  fontSize: {
    title: number;
    subtitle: number;
    heading: number;
    body: number;
    small: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    border: string;
    background: string;
  };
  spacing: {
    page: number;
    section: number;
    line: number;
  };
}

export class TrainingPDFExporter {
  private styles: PDFStyles = {
    fontSize: {
      title: 24,
      subtitle: 18,
      heading: 14,
      body: 11,
      small: 9
    },
    colors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      text: '#2C3E50',
      border: '#BDC3C7',
      background: '#F8F9FA'
    },
    spacing: {
      page: 40,
      section: 20,
      line: 6
    }
  };

  private doc: any;
  private currentY: number = 0;
  private pageWidth: number = 595.28; // A4 width in points
  private pageHeight: number = 841.89; // A4 height in points
  private margin: number = 40;

  constructor() {
    // Dynamic import for jsPDF to avoid bundling issues
    this.initializePDF();
  }

  private async initializePDF() {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    this.doc = new jsPDF('portrait', 'pt', 'a4');
  }

  public async exportTrainingReport(data: TrainingReportData): Promise<void> {
    await this.initializePDF();
    
    this.currentY = this.margin;
    
    // Title Page
    this.generateTitlePage(data.training);
    
    // Executive Summary
    this.addNewPage();
    this.generateExecutiveSummary(data);
    
    // Training Details
    this.addSection();
    this.generateTrainingDetails(data.training, data.participants);
    
    // Participants Overview
    this.addSection();
    this.generateParticipantsOverview(data.participants);
    
    // Performance Analytics
    this.addNewPage();
    this.generatePerformanceAnalytics(data.analytics);
    
    // Squad Performance
    this.addSection();
    this.generateSquadPerformance(data.squadStats, data.squadPerformance);
    
    // Weapon & Equipment Analysis
    this.addSection();
    this.generateWeaponEquipmentAnalysis(data.weaponStats, data.weapons, data.equipment);
    
    // Day/Night Performance
    this.addSection();
    this.generateDayNightAnalysis(data.dayNightPerformance);
    
    // Training Effectiveness
    this.addSection();
    this.generateTrainingEffectiveness(data.trainingEffectiveness);
    
    // Recommendations
    this.addSection();
    this.generateRecommendations(data);
    
    // Download the PDF
    this.doc.save(`Training_Report_${data.training.session_name}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private generateTitlePage(training: TrainingSession): void {
    const centerX = this.pageWidth / 2;
    
    // Main Title
    this.doc.setFontSize(this.styles.fontSize.title);
    this.doc.setTextColor(this.styles.colors.primary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TRAINING SESSION REPORT', centerX, this.currentY + 100, { align: 'center' });
    
    // Session Name
    this.currentY += 160;
    this.doc.setFontSize(this.styles.fontSize.subtitle);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(training.session_name, centerX, this.currentY, { align: 'center' });
    
    // Date and Location
    this.currentY += 80;
    this.doc.setFontSize(this.styles.fontSize.heading);
    this.doc.setTextColor(this.styles.colors.secondary);
    this.doc.text(`Date: ${new Date(training.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, centerX, this.currentY, { align: 'center' });
    
    this.currentY += 30;
    this.doc.text(`Location: ${training.location}`, centerX, this.currentY, { align: 'center' });
    
    this.currentY += 30;
    this.doc.text(`Status: ${training.status.toUpperCase()}`, centerX, this.currentY, { align: 'center' });
    
    // Created by
    this.currentY += 80;
    this.doc.setFontSize(this.styles.fontSize.body);
    this.doc.text(`Conducted by: ${training.creator_id.first_name} ${training.creator_id.last_name}`, 
      centerX, this.currentY, { align: 'center' });
    
    // Report generation info
    this.currentY = this.pageHeight - 100;
    this.doc.setFontSize(this.styles.fontSize.small);
    this.doc.setTextColor(this.styles.colors.secondary);
    this.doc.text(`Report generated on ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}`, 
      centerX, this.currentY, { align: 'center' });
    
    // Add border
    this.doc.setDrawColor(this.styles.colors.border);
    this.doc.setLineWidth(1);
    this.doc.rect(this.margin, this.margin, this.pageWidth - 2 * this.margin, this.pageHeight - 2 * this.margin);
  }

  private generateExecutiveSummary(data: TrainingReportData): void {
    this.addTitle('EXECUTIVE SUMMARY');
    
    const summary = [
      `Training session "${data.training.session_name}" was conducted on ${new Date(data.training.date).toLocaleDateString('en-US')} at ${data.training.location}.`,
      `A total of ${data.analytics.total_participants} participants took part in this training exercise.`,
      `Overall performance metrics indicate a ${data.analytics.overall_hit_percentage.toFixed(1)}% hit percentage across ${data.analytics.total_shots_fired} shots fired.`,
      `Average time to first shot was ${data.analytics.avg_time_to_first_shot.toFixed(2)} seconds.`,
      `${data.analytics.total_targets_eliminated} targets were successfully eliminated during the exercise.`
    ];
    
    summary.forEach(text => {
      this.addParagraph(text);
    });

    // Key Performance Indicators Table
    this.addSubheading('Key Performance Indicators');
    
    const kpiData = [
      ['Metric', 'Value', 'Assessment'],
      ['Overall Hit Percentage', `${data.analytics.overall_hit_percentage.toFixed(1)}%`, this.getPerformanceAssessment(data.analytics.overall_hit_percentage)],
      ['Total Shots Fired', data.analytics.total_shots_fired.toString(), '-'],
      ['Targets Eliminated', data.analytics.total_targets_eliminated.toString(), '-'],
      ['Average First Shot Time', `${data.analytics.avg_time_to_first_shot.toFixed(2)}s`, this.getTimeAssessment(data.analytics.avg_time_to_first_shot)],
      ['Participants', data.analytics.total_participants.toString(), '-'],
      ['Average Dispersion', `${data.analytics.avg_cm_dispersion.toFixed(1)}cm`, this.getDispersionAssessment(data.analytics.avg_cm_dispersion)]
    ];

    this.generateTable(kpiData, [120, 120, 120]);
  }

  private generateTrainingDetails(training: TrainingSession, participants: TrainingParticipant[]): void {
    this.addTitle('TRAINING DETAILS');
    
    // Basic Information
    this.addSubheading('Session Information');
    const basicInfo = [
      ['Session Name', training.session_name],
      ['Date', new Date(training.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Location', training.location],
      ['Status', training.status.charAt(0).toUpperCase() + training.status.slice(1)],
      ['Conducted By', `${training.creator_id.first_name} ${training.creator_id.last_name}`],
      ['Email', training.creator_id.email],
      ['Total Participants', participants.length.toString()]
    ];

    basicInfo.forEach(([label, value]) => {
      this.addInfoLine(label, value);
    });

    // Assignments
    if (training.assignments && training.assignments.length > 0) {
      this.addSubheading('Training Assignments');
      const assignmentData = [
        ['Assignment Name', 'Created Date']
      ];
      
      training.assignments.forEach(assignment => {
        assignmentData.push([
          assignment.assignment_name,
          new Date(assignment.created_at).toLocaleDateString('en-US')
        ]);
      });

      this.generateTable(assignmentData, [200, 150]);
    }
  }

  private generateParticipantsOverview(participants: TrainingParticipant[]): void {
    this.addTitle('PARTICIPANTS OVERVIEW');
    
    const participantData = [
      ['Name', 'Role', 'Email', 'Participation Date']
    ];
    
    participants.forEach(participant => {
      if (participant.user) {
        participantData.push([
          `${participant.user.first_name} ${participant.user.last_name}`,
          participant.user.user_role.charAt(0).toUpperCase() + participant.user.user_role.slice(1),
          participant.user.email,
          new Date(participant.created_at).toLocaleDateString('en-US')
        ]);
      }
    });

    this.generateTable(participantData, [140, 100, 140, 100]);

    // Role Distribution
    this.addSubheading('Role Distribution');
    const roleCount = participants.reduce((acc: Record<string, number>, participant) => {
      if (participant.user) {
        const role = participant.user.user_role;
        acc[role] = (acc[role] || 0) + 1;
      }
      return acc;
    }, {});

    const roleData = [['Role', 'Count', 'Percentage']];
    Object.entries(roleCount).forEach(([role, count]) => {
      const percentage = ((count / participants.length) * 100).toFixed(1);
      roleData.push([
        role.charAt(0).toUpperCase() + role.slice(1),
        count.toString(),
        `${percentage}%`
      ]);
    });

    this.generateTable(roleData, [150, 80, 100]);
  }

  private generatePerformanceAnalytics(analytics: TrainingTeamAnalytics): void {
    this.addTitle('PERFORMANCE ANALYTICS');
    
    // Overall Performance
    this.addSubheading('Overall Training Performance');
    
    const overallData = [
      ['Metric', 'Value', 'Details']
    ];
    
    const performanceMetrics = [
      ['Total Participants', analytics.total_participants.toString(), 'Active participants in training'],
      ['Total Shots Fired', analytics.total_shots_fired.toString(), 'Cumulative shots across all participants'],
      ['Overall Hit Percentage', `${analytics.overall_hit_percentage.toFixed(1)}%`, this.getPerformanceAssessment(analytics.overall_hit_percentage)],
      ['Targets Eliminated', analytics.total_targets_eliminated.toString(), 'Successfully neutralized targets'],
      ['Average First Shot Time', `${analytics.avg_time_to_first_shot.toFixed(2)} seconds`, this.getTimeAssessment(analytics.avg_time_to_first_shot)],
      ['Average Dispersion', `${analytics.avg_cm_dispersion.toFixed(1)} cm`, this.getDispersionAssessment(analytics.avg_cm_dispersion)],
      ['Best Dispersion', `${analytics.best_cm_dispersion.toFixed(1)} cm`, 'Best individual performance'],
      ['Best Performer', `${analytics.best_user_first_name} ${analytics.best_user_last_name}`, 'Top performing participant']
    ];

    performanceMetrics.forEach(metric => overallData.push(metric));
    this.generateTable(overallData, [140, 100, 200]);

    // Distance-based Performance
    this.addSubheading('Performance by Distance');
    
    const distanceData = [
      ['Distance Category', 'Shots Fired', 'Hit Percentage', 'Assessment']
    ];
    
    if (analytics.short_shots > 0) {
      distanceData.push([
        'Short Range',
        analytics.short_shots.toString(),
        `${analytics.short_hit_percentage.toFixed(1)}%`,
        this.getPerformanceAssessment(analytics.short_hit_percentage)
      ]);
    }
    
    if (analytics.medium_shots > 0) {
      distanceData.push([
        'Medium Range',
        analytics.medium_shots.toString(),
        `${analytics.medium_hit_percentage.toFixed(1)}%`,
        this.getPerformanceAssessment(analytics.medium_hit_percentage)
      ]);
    }
    
    if (analytics.long_shots > 0 && analytics.long_hit_percentage !== null) {
      distanceData.push([
        'Long Range',
        analytics.long_shots.toString(),
        `${analytics.long_hit_percentage.toFixed(1)}%`,
        this.getPerformanceAssessment(analytics.long_hit_percentage)
      ]);
    }

    this.generateTable(distanceData, [100, 100, 100, 140]);
  }

  private generateSquadPerformance(squadStats: SquadStats[], squadPerformance: SquadPerformance[]): void {
    this.addTitle('SQUAD PERFORMANCE ANALYSIS');
    
    // Individual Squad Member Performance
    this.addSubheading('Individual Performance by Squad');
    
    if (squadStats.length > 0) {
      const squadData = [
        ['Name', 'Squad', 'Role/Weapon', 'Hit %', 'Sessions']
      ];
      
      squadStats.forEach(stat => {
        squadData.push([
          `${stat.first_name} ${stat.last_name}`,
          stat.squad_name,
          stat.role_or_weapon,
          `${stat.hit_percentage.toFixed(1)}%`,
          stat.session_count.toString()
        ]);
      });

      this.generateTable(squadData, [120, 80, 100, 80, 80]);
    }

    // Squad-level Performance Summary
    if (squadPerformance.length > 0) {
      this.addSubheading('Squad Performance Summary');
      
      const squadSummaryData = [
        ['Squad', 'Missions', 'Avg Accuracy', 'Avg Reaction Time', 'First Shot Success', 'Elimination Rate', 'Best Sniper']
      ];
      
      squadPerformance.forEach(squad => {
        squadSummaryData.push([
          squad.squad_name,
          squad.total_missions.toString(),
          `${squad.avg_accuracy.toFixed(1)}%`,
          `${squad.avg_reaction_time.toFixed(2)}s`,
          `${squad.first_shot_success_rate.toFixed(1)}%`,
          `${squad.elimination_rate.toFixed(1)}%`,
          squad.best_sniper
        ]);
      });

      this.generateTable(squadSummaryData, [80, 60, 80, 80, 80, 80, 100]);
    }
  }

  private generateWeaponEquipmentAnalysis(weaponStats: WeaponUsageStats[], weapons: Weapon[], equipment: Equipment[]): void {
    this.addTitle('WEAPON & EQUIPMENT ANALYSIS');
    
    // Weapon Performance Statistics
    if (weaponStats.length > 0) {
      this.addSubheading('Weapon Performance Statistics');
      
      const weaponData = [
        ['Weapon ID', 'Shots Fired', 'Hits', 'Hit Percentage', 'Avg Dispersion', 'Best Dispersion']
      ];
      
      weaponStats.forEach(weapon => {
        weaponData.push([
          weapon.weapon_id,
          weapon.total_shots_fired.toString(),
          weapon.total_hits.toString(),
          `${weapon.hit_percentage.toFixed(1)}%`,
          weapon.avg_cm_dispersion ? `${weapon.avg_cm_dispersion.toFixed(1)}cm` : 'N/A',
          weapon.best_cm_dispersion ? `${weapon.best_cm_dispersion.toFixed(1)}cm` : 'N/A'
        ]);
      });

      this.generateTable(weaponData, [80, 80, 60, 80, 80, 80]);
    }

    // Weapon Inventory
    if (weapons.length > 0) {
      this.addSubheading('Weapon Inventory Used');
      
      const weaponInventoryData = [
        ['Weapon Type', 'Serial Number', 'Muzzle Velocity']
      ];
      
      weapons.forEach(weapon => {
        weaponInventoryData.push([
          weapon.weapon_type,
          weapon.serial_number,
          weapon.mv || 'N/A'
        ]);
      });

      this.generateTable(weaponInventoryData, [150, 150, 100]);
    }

    // Equipment Used
    if (equipment.length > 0) {
      this.addSubheading('Equipment Used');
      
      const equipmentData = [
        ['Equipment Type', 'Serial Number', 'Day/Night Configuration']
      ];
      
      equipment.forEach(equip => {
        equipmentData.push([
          equip.equipment_type,
          equip.serial_number,
          equip.day_night.charAt(0).toUpperCase() + equip.day_night.slice(1)
        ]);
      });

      this.generateTable(equipmentData, [150, 150, 140]);
    }
  }

  private generateDayNightAnalysis(dayNightPerformance: DayNightPerformance[]): void {
    this.addTitle('DAY/NIGHT PERFORMANCE ANALYSIS');
    
    if (dayNightPerformance.length > 0) {
      const dayNightData = [
        ['Condition', 'Total Missions', 'Accuracy', 'First Shot Success', 'Avg Reaction Time', 'Elimination Rate']
      ];
      
      dayNightPerformance.forEach(performance => {
        dayNightData.push([
          performance.day_night.charAt(0).toUpperCase() + performance.day_night.slice(1),
          performance.total_missions.toString(),
          performance.accuracy,
          performance.first_shot_success_rate,
          performance.avg_reaction_time,
          performance.elimination_rate
        ]);
      });

      this.generateTable(dayNightData, [80, 80, 80, 100, 100, 100]);

      // Analysis
      this.addSubheading('Day vs Night Performance Analysis');
      
      const dayPerf = dayNightPerformance.find(p => p.day_night === 'day');
      const nightPerf = dayNightPerformance.find(p => p.day_night === 'night');
      
      if (dayPerf && nightPerf) {
        const analysis = [
          `Day operations showed ${dayPerf.accuracy} accuracy compared to ${nightPerf.accuracy} for night operations.`,
          `First shot success rates were ${dayPerf.first_shot_success_rate} during day and ${nightPerf.first_shot_success_rate} during night.`,
          `Average reaction times: ${dayPerf.avg_reaction_time} (day) vs ${nightPerf.avg_reaction_time} (night).`,
          `Elimination rates: ${dayPerf.elimination_rate} (day) vs ${nightPerf.elimination_rate} (night).`
        ];
        
        analysis.forEach(text => this.addParagraph(text));
      }
    }
  }

  private generateTrainingEffectiveness(effectiveness: TrainingEffectiveness[]): void {
    this.addTitle('TRAINING EFFECTIVENESS ANALYSIS');
    
    if (effectiveness.length > 0) {
      const effectivenessData = [
        ['Assignment', 'Sessions', 'Accuracy Improvement', 'Reaction Time Improvement', 'Skill Correlation', 'Recommended Frequency']
      ];
      
      effectiveness.forEach(eff => {
        effectivenessData.push([
          eff.assignment_name,
          eff.total_sessions.toString(),
          `${eff.avg_accuracy_improvement.toFixed(1)}%`,
          `${eff.avg_reaction_time_improvement.toFixed(2)}s`,
          eff.skill_correlation,
          eff.recommended_frequency
        ]);
      });

      this.generateTable(effectivenessData, [100, 60, 90, 100, 100, 90]);
    }
  }

  private generateRecommendations(data: TrainingReportData): void {
    this.addTitle('RECOMMENDATIONS & NEXT STEPS');
    
    const recommendations: string[] = [];
    
    // Performance-based recommendations
    if (data.analytics.overall_hit_percentage < 70) {
      recommendations.push('Overall hit percentage is below 70%. Consider additional marksmanship training and fundamentals review.');
    }
    
    if (data.analytics.avg_time_to_first_shot > 5) {
      recommendations.push('Average first shot time exceeds 5 seconds. Focus on target acquisition drills and reaction time exercises.');
    }
    
    if (data.analytics.avg_cm_dispersion > 10) {
      recommendations.push('Shot dispersion indicates need for improved shooting stability and consistency training.');
    }
    
    // Squad-based recommendations
    const worstPerformingSquad = data.squadStats.reduce((worst, current) => 
      current.hit_percentage < worst.hit_percentage ? current : worst
    );
    
    if (worstPerformingSquad && worstPerformingSquad.hit_percentage < 60) {
      recommendations.push(`Squad "${worstPerformingSquad.squad_name}" requires additional focused training to improve performance.`);
    }
    
    // Equipment recommendations
    if (data.weaponStats.some(w => w.hit_percentage < 50)) {
      recommendations.push('Some weapons show poor performance metrics. Consider equipment inspection and zeroing procedures.');
    }
    
    // General recommendations
    recommendations.push('Continue regular training sessions to maintain and improve current performance levels.');
    recommendations.push('Consider implementing individual coaching for participants with below-average performance.');
    recommendations.push('Schedule follow-up training session within 2-4 weeks to maintain skill retention.');
    
    recommendations.forEach(recommendation => {
      this.addBulletPoint(recommendation);
    });
  }

  // Utility Methods
  private addNewPage(): void {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  private addSection(): void {
    this.currentY += this.styles.spacing.section;
    if (this.currentY > this.pageHeight - 100) {
      this.addNewPage();
    }
  }

  private addTitle(title: string): void {
    if (this.currentY > this.pageHeight - 100) {
      this.addNewPage();
    }
    
    this.doc.setFontSize(this.styles.fontSize.subtitle);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.styles.colors.primary);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 30;
    
    // Add underline
    this.doc.setDrawColor(this.styles.colors.primary);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, this.currentY - 25, this.margin + 200, this.currentY - 25);
  }

  private addSubheading(heading: string): void {
    this.currentY += 15;
    this.doc.setFontSize(this.styles.fontSize.heading);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.styles.colors.secondary);
    this.doc.text(heading, this.margin, this.currentY);
    this.currentY += 20;
  }

  private addParagraph(text: string): void {
    this.doc.setFontSize(this.styles.fontSize.body);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(this.styles.colors.text);
    
    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 15 + 10;
  }

  private addBulletPoint(text: string): void {
    this.doc.setFontSize(this.styles.fontSize.body);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(this.styles.colors.text);
    
    this.doc.text('•', this.margin, this.currentY);
    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin - 20);
    this.doc.text(lines, this.margin + 15, this.currentY);
    this.currentY += lines.length * 15 + 8;
  }

  private addInfoLine(label: string, value: string): void {
    this.doc.setFontSize(this.styles.fontSize.body);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.styles.colors.secondary);
    this.doc.text(`${label}:`, this.margin, this.currentY);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(this.styles.colors.text);
    this.doc.text(value, this.margin + 150, this.currentY);
    this.currentY += 18;
  }

  private generateTable(data: string[][], columnWidths: number[]): void {
    (this.doc as any).autoTable({
      head: [data[0]],
      body: data.slice(1),
      startY: this.currentY,
      margin: { left: this.margin, right: this.margin },
      columnStyles: columnWidths.reduce((acc: any, width, index) => {
        acc[index] = { cellWidth: width };
        return acc;
      }, {}),
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: this.styles.fontSize.body
      },
      bodyStyles: {
        fontSize: this.styles.fontSize.body - 1,
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.5,
    });
    
    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
  }

  private getPerformanceAssessment(percentage: number): string {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Satisfactory';
    if (percentage >= 50) return 'Needs Improvement';
    return 'Poor';
  }

  private getTimeAssessment(time: number): string {
    if (time <= 2) return 'Excellent';
    if (time <= 3) return 'Very Good';
    if (time <= 4) return 'Good';
    if (time <= 5) return 'Satisfactory';
    return 'Needs Improvement';
  }

  private getDispersionAssessment(dispersion: number): string {
    if (dispersion <= 3) return 'Excellent';
    if (dispersion <= 5) return 'Very Good';
    if (dispersion <= 8) return 'Good';
    if (dispersion <= 12) return 'Satisfactory';
    return 'Needs Improvement';
  }
}

// Factory function for easy instantiation
export const createTrainingPDFExporter = () => new TrainingPDFExporter();