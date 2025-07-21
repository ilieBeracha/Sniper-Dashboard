import React from 'react';
import { TrainingPDFExportButton } from '@/components/TrainingPDFExportButton';
import { TrainingSession, TrainingStatus } from '@/types/training';
import { TrainingTeamAnalytics } from '@/types/performance';

// Sample data for demonstration
const sampleTraining: TrainingSession = {
  id: 'demo-training-1',
  date: new Date().toISOString(),
  session_name: 'Advanced Marksmanship Training - Demo',
  location: 'Training Range Alpha',
  status: TrainingStatus.Completed,
  creator_id: {
    id: 'instructor-1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'j.smith@military.unit'
  },
  participants: [
    {
      id: 'p1',
      training_id: 'demo-training-1',
      participant_id: 'user1',
      created_at: new Date().toISOString(),
      user: {
        id: 'user1',
        first_name: 'Alex',
        last_name: 'Johnson',
        email: 'alex.johnson@unit.mil',
        user_role: 'soldier'
      }
    },
    {
      id: 'p2',
      training_id: 'demo-training-1',
      participant_id: 'user2',
      created_at: new Date().toISOString(),
      user: {
        id: 'user2',
        first_name: 'Sarah',
        last_name: 'Wilson',
        email: 'sarah.wilson@unit.mil',
        user_role: 'squad_commander'
      }
    },
    {
      id: 'p3',
      training_id: 'demo-training-1',
      participant_id: 'user3',
      created_at: new Date().toISOString(),
      user: {
        id: 'user3',
        first_name: 'Mike',
        last_name: 'Davis',
        email: 'mike.davis@unit.mil',
        user_role: 'soldier'
      }
    }
  ],
  assignments: [
    {
      id: 'assign1',
      assignment_name: 'Long Range Precision',
      created_at: new Date().toISOString(),
      team_id: 'team1'
    },
    {
      id: 'assign2',
      assignment_name: 'Moving Target Engagement',
      created_at: new Date().toISOString(),
      team_id: 'team1'
    }
  ]
};

const sampleAnalytics: TrainingTeamAnalytics = {
  total_participants: 3,
  total_shots_fired: 120,
  overall_hit_percentage: 78.5,
  total_targets_eliminated: 94,
  avg_time_to_first_shot: 3.2,
  short_shots: 40,
  short_hit_percentage: 85.0,
  medium_shots: 50,
  medium_hit_percentage: 76.0,
  long_shots: 30,
  long_hit_percentage: 70.0,
  avg_cm_dispersion: 8.4,
  best_cm_dispersion: 4.2,
  best_user_first_name: 'Alex',
  best_user_last_name: 'Johnson',
  times_grouped: 15
};

const sampleSquadStats = [
  {
    first_name: 'Alex',
    last_name: 'Johnson',
    role_or_weapon: 'Sniper',
    hit_percentage: 82.5,
    session_count: 8,
    squad_name: 'Alpha Squad'
  },
  {
    first_name: 'Sarah',
    last_name: 'Wilson',
    role_or_weapon: 'Spotter',
    hit_percentage: 75.0,
    session_count: 6,
    squad_name: 'Alpha Squad'
  },
  {
    first_name: 'Mike',
    last_name: 'Davis',
    role_or_weapon: 'Semi-Auto',
    hit_percentage: 78.0,
    session_count: 7,
    squad_name: 'Bravo Squad'
  }
];

const sampleWeapons = [
  {
    id: 'w1',
    weapon_type: 'M24 SWS',
    serial_number: 'M24-001-2024',
    mv: '792 m/s'
  },
  {
    id: 'w2',
    weapon_type: 'M110 SASS',
    serial_number: 'M110-045-2024',
    mv: '783 m/s'
  }
];

const sampleEquipment = [
  {
    id: 'e1',
    equipment_type: 'Leopold Mark 4',
    serial_number: 'LP-MK4-123',
    day_night: 'day',
    team_id: 'team1',
    created_at: new Date().toISOString()
  },
  {
    id: 'e2',
    equipment_type: 'Night Vision Scope',
    serial_number: 'NV-SC-456',
    day_night: 'night',
    team_id: 'team1',
    created_at: new Date().toISOString()
  }
];

export const PDFExportDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF Export Demo</h2>
        <p className="text-gray-600 mb-6">
          This demonstrates the PDF export functionality with sample training data. 
          Click the button below to generate a professional training report PDF.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Sample Training Session</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Session:</strong> {sampleTraining.session_name}
            </div>
            <div>
              <strong>Location:</strong> {sampleTraining.location}
            </div>
            <div>
              <strong>Participants:</strong> {sampleAnalytics.total_participants}
            </div>
            <div>
              <strong>Hit Rate:</strong> {sampleAnalytics.overall_hit_percentage}%
            </div>
            <div>
              <strong>Total Shots:</strong> {sampleAnalytics.total_shots_fired}
            </div>
            <div>
              <strong>Avg First Shot:</strong> {sampleAnalytics.avg_time_to_first_shot}s
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <TrainingPDFExportButton
            trainingData={{
              training: sampleTraining,
              participants: sampleTraining.participants || [],
              analytics: sampleAnalytics,
              squadStats: sampleSquadStats,
              weaponStats: [],
              dayNightPerformance: [],
              squadPerformance: [],
              trainingEffectiveness: [],
              weapons: sampleWeapons,
              equipment: sampleEquipment
            }}
            variant="primary"
            size="lg"
            buttonText="Generate Demo PDF Report"
            onExportComplete={() => {
              alert('Demo PDF report generated successfully!');
            }}
            onExportError={(error) => {
              alert(`Export failed: ${error}`);
            }}
          />

          <TrainingPDFExportButton
            trainingData={{
              training: sampleTraining,
              participants: sampleTraining.participants || [],
              analytics: sampleAnalytics,
              squadStats: sampleSquadStats,
              weaponStats: [],
              dayNightPerformance: [],
              squadPerformance: [],
              trainingEffectiveness: [],
              weapons: sampleWeapons,
              equipment: sampleEquipment
            }}
            variant="outline"
            size="md"
            buttonText="Quick Export"
          />

          <TrainingPDFExportButton
            trainingData={{
              training: sampleTraining,
              participants: sampleTraining.participants || [],
              analytics: sampleAnalytics,
              squadStats: sampleSquadStats,
              weaponStats: [],
              dayNightPerformance: [],
              squadPerformance: [],
              trainingEffectiveness: [],
              weapons: sampleWeapons,
              equipment: sampleEquipment
            }}
            variant="secondary"
            size="sm"
            buttonText="Compact Export"
          />
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p><strong>Note:</strong> This demo uses sample data. In the actual training pages, real data from your stores will be used.</p>
        </div>
      </div>
    </div>
  );
};

export default PDFExportDemo;