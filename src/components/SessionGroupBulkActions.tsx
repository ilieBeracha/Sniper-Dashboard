import { useState } from "react";
import { Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import BaseSelect from "@/components/base/BaseSelect";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { TrainingSession } from "@/types/training";
import { useTheme } from "@/contexts/ThemeContext";

interface SessionGroupBulkActionsProps {
  selectedSessions: string[];
  onClearSelection: () => void;
  trainings: TrainingSession[];
}

export default function SessionGroupBulkActions({ 
  selectedSessions, 
  onClearSelection,
  trainings 
}: SessionGroupBulkActionsProps) {
  const { theme } = useTheme();
  const { groups, addTrainingsToGroup } = useStore(sessionGroupStore);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  if (selectedSessions.length === 0) {
    return null;
  }

  const handleAssignToGroup = async () => {
    if (!selectedGroupId || selectedSessions.length === 0) return;

    setIsAssigning(true);
    const success = await addTrainingsToGroup({
      group_id: selectedGroupId,
      training_ids: selectedSessions
    });

    if (success) {
      onClearSelection();
      setSelectedGroupId("");
    }
    setIsAssigning(false);
  };

  const groupOptions = groups.map(group => ({
    value: group.id,
    label: group.name
  }));

  const selectedTrainings = trainings.filter(t => selectedSessions.includes(t.id));
  const selectedNames = selectedTrainings.map(t => t.session_name).join(", ");

  return (
    <div className={`sticky top-0 z-10 ${
      theme === 'dark' ? 'bg-zinc-900/95' : 'bg-white/95'
    } backdrop-blur-sm border-b ${
      theme === 'dark' ? 'border-zinc-800' : 'border-gray-200'
    } p-4 mb-4 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <Check className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="font-medium">
              {selectedSessions.length} session{selectedSessions.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-gray-500 truncate max-w-md" title={selectedNames}>
              {selectedNames}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-64">
            <BaseSelect
              options={groupOptions}
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              placeholder="Select a group"
            />
          </div>
          
          <Button
            onClick={handleAssignToGroup}
            disabled={!selectedGroupId || isAssigning}
            size="sm"
          >
            <Users className="h-4 w-4 mr-1" />
            {isAssigning ? "Assigning..." : "Assign to Group"}
          </Button>

          <Button
            variant="outline"
            onClick={onClearSelection}
            size="sm"
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
}