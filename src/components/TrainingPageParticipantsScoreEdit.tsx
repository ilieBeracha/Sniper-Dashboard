import { useState } from "react";
import { X, Save } from "lucide-react";
import { ScorePosition } from "@/types/training";

interface ScoreData {
  shots_fired: number | null;
  hits: number | null;
  time_until_first_shot: number | null;
  distance: number | null;
  position: string;
  day_night: string;
}

interface TrainingPageParticipantsScoreEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scoreData: ScoreData) => void;
  initialData?: ScoreData;
  isSubmitting?: boolean;
}

export function TrainingPageParticipantsScoreEdit({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSubmitting = false,
}: TrainingPageParticipantsScoreEditProps) {
  const [scoreData, setScoreData] = useState<ScoreData>(
    initialData || {
      shots_fired: null,
      hits: null,
      time_until_first_shot: null,
      distance: null,
      position: "Standing",
      day_night: "day",
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">Edit Score</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors" disabled={isSubmitting}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Shots Fired</label>
              <input
                type="number"
                min="0"
                value={scoreData.shots_fired === null ? "" : scoreData.shots_fired}
                onChange={(e) => setScoreData({ ...scoreData, shots_fired: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                placeholder="Enter shots fired"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Hits</label>
              <input
                type="number"
                min="0"
                value={scoreData.hits === null ? "" : scoreData.hits}
                onChange={(e) => setScoreData({ ...scoreData, hits: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                placeholder="Enter hits"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Time Until First Shot (s)</label>
              <input
                type="number"
                min="0"
                value={scoreData.time_until_first_shot === null ? "" : scoreData.time_until_first_shot}
                onChange={(e) => setScoreData({ ...scoreData, time_until_first_shot: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                placeholder="Enter time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Distance (m)</label>
              <input
                type="number"
                min="0"
                value={scoreData.distance === null ? "" : scoreData.distance}
                onChange={(e) => setScoreData({ ...scoreData, distance: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                placeholder="Enter distance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
              <select
                value={scoreData.position}
                onChange={(e) => setScoreData({ ...scoreData, position: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              >
                {Object.values(ScorePosition).map((position) => (
                  <option key={position} value={position} className="bg-gray-800">
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Lighting</label>
              <select
                value={scoreData.day_night}
                onChange={(e) => setScoreData({ ...scoreData, day_night: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="day" className="bg-gray-800">
                  Day
                </option>
                <option value="night" className="bg-gray-800">
                  Night
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(scoreData)}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Score
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
