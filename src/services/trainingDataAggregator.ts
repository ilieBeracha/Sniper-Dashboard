import { TrainingSession, TrainingParticipant } from '@/types/training';
import { 
  TrainingTeamAnalytics, 
  SquadStats, 
  WeaponUsageStats, 
  DayNightPerformance,
  SquadPerformance,
  TrainingEffectiveness 
} from '@/types/performance';
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

export class TrainingDataAggregator {
  constructor() {}

  /**
   * Aggregates all training data for PDF export
   * This is the main entry point for collecting data
   */
  async aggregateTrainingData(trainingId: string): Promise<TrainingReportData> {
    try {
      // Fetch all data concurrently for better performance
      const [
        training,
        participants,
        analytics,
        squadStats,
        weaponStats,
        dayNightPerformance,
        squadPerformance,
        trainingEffectiveness,
        weapons,
        equipment
      ] = await Promise.all([
        this.fetchTrainingSession(trainingId),
        this.fetchParticipants(trainingId),
        this.fetchTrainingAnalytics(trainingId),
        this.fetchSquadStats(trainingId),
        this.fetchWeaponStats(trainingId),
        this.fetchDayNightPerformance(trainingId),
        this.fetchSquadPerformance(trainingId),
        this.fetchTrainingEffectiveness(trainingId),
        this.fetchWeapons(trainingId),
        this.fetchEquipment(trainingId)
      ]);

      return {
        training,
        participants,
        analytics,
        squadStats,
        weaponStats,
        dayNightPerformance,
        squadPerformance,
        trainingEffectiveness,
        weapons,
        equipment
      };
    } catch (error) {
      console.error('Error aggregating training data:', error);
      throw new Error(`Failed to aggregate training data: ${error}`);
    }
  }

  /**
   * Alternative method to aggregate data from existing objects
   * Use this when you already have the data in your components
   */
  aggregateFromExistingData(data: Partial<TrainingReportData>): TrainingReportData {
    // Provide default empty arrays/objects for missing data
    return {
      training: data.training || this.getDefaultTraining(),
      participants: data.participants || [],
      analytics: data.analytics || this.getDefaultAnalytics(),
      squadStats: data.squadStats || [],
      weaponStats: data.weaponStats || [],
      dayNightPerformance: data.dayNightPerformance || [],
      squadPerformance: data.squadPerformance || [],
      trainingEffectiveness: data.trainingEffectiveness || [],
      weapons: data.weapons || [],
      equipment: data.equipment || []
    };
  }

  // Data fetching methods - implement these based on your API structure
  private async fetchTrainingSession(trainingId: string): Promise<TrainingSession> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}`);
    // return response.data;
    
    // Mock implementation for now
    return this.getDefaultTraining();
  }

  private async fetchParticipants(trainingId: string): Promise<TrainingParticipant[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/participants`);
    // return response.data;
    
    return [];
  }

  private async fetchTrainingAnalytics(trainingId: string): Promise<TrainingTeamAnalytics> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/analytics`);
    // return response.data;
    
    return this.getDefaultAnalytics();
  }

  private async fetchSquadStats(trainingId: string): Promise<SquadStats[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/squad-stats`);
    // return response.data;
    
    return [];
  }

  private async fetchWeaponStats(trainingId: string): Promise<WeaponUsageStats[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/weapon-stats`);
    // return response.data;
    
    return [];
  }

  private async fetchDayNightPerformance(trainingId: string): Promise<DayNightPerformance[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/day-night-performance`);
    // return response.data;
    
    return [];
  }

  private async fetchSquadPerformance(trainingId: string): Promise<SquadPerformance[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/squad-performance`);
    // return response.data;
    
    return [];
  }

  private async fetchTrainingEffectiveness(trainingId: string): Promise<TrainingEffectiveness[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/effectiveness`);
    // return response.data;
    
    return [];
  }

  private async fetchWeapons(trainingId: string): Promise<Weapon[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/weapons`);
    // return response.data;
    
    return [];
  }

  private async fetchEquipment(trainingId: string): Promise<Equipment[]> {
    // TODO: Replace with actual API call
    // Example: const response = await api.get(`/training/${trainingId}/equipment`);
    // return response.data;
    
    return [];
  }

  // Default data generators for fallbacks
  private getDefaultTraining(): TrainingSession {
    return {
      id: 'default',
      date: new Date().toISOString(),
      session_name: 'Training Session',
      location: 'Training Ground',
      status: 'completed' as any,
      creator_id: {
        id: 'default',
        first_name: 'Training',
        last_name: 'Officer',
        email: 'training@example.com'
      }
    };
  }

  private getDefaultAnalytics(): TrainingTeamAnalytics {
    return {
      total_participants: 0,
      total_shots_fired: 0,
      overall_hit_percentage: 0,
      total_targets_eliminated: 0,
      avg_time_to_first_shot: 0,
      short_shots: 0,
      short_hit_percentage: 0,
      medium_shots: 0,
      medium_hit_percentage: 0,
      long_shots: 0,
      long_hit_percentage: 0,
      avg_cm_dispersion: 0,
      best_cm_dispersion: 0,
      best_user_first_name: 'N/A',
      best_user_last_name: 'N/A',
      times_grouped: 0
    };
  }

  /**
   * Helper method to validate data completeness
   */
  validateData(data: TrainingReportData): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    if (!data.training.session_name) missingFields.push('Training session name');
    if (!data.training.date) missingFields.push('Training date');
    if (!data.training.location) missingFields.push('Training location');
    if (data.participants.length === 0) missingFields.push('Participants data');

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Helper method to enrich data with calculated fields
   */
  enrichData(data: TrainingReportData): TrainingReportData {
    // Calculate additional metrics that might be useful for the report
    
    // Enrich analytics with calculated percentages
    if (data.analytics.total_shots_fired > 0) {
      const hitRate = (data.analytics.total_shots_fired - data.analytics.total_targets_eliminated) / data.analytics.total_shots_fired;
      // Add any additional calculations here
    }

    // Enrich participant data with performance rankings
    if (data.squadStats.length > 0) {
      // Sort by performance for ranking
      data.squadStats.sort((a, b) => b.hit_percentage - a.hit_percentage);
    }

    return data;
  }
}

// Factory function for easy instantiation
export const createTrainingDataAggregator = () => new TrainingDataAggregator();