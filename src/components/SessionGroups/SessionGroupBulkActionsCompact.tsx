import { useState } from "react";
import { Check, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { TrainingSession } from "@/types/training";
import { userStore } from "@/store/userStore";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionGroupBulkActionsCompactProps {
  selectedSessions: string[];
  onClearSelection: () => void;
  trainings: TrainingSession[];
}

export default function SessionGroupBulkActionsCompact({ 
  selectedSessions, 
  onClearSelection
}: SessionGroupBulkActionsCompactProps) {
  const user = useStore(userStore).user;
  const { groups, addTrainingsToGroup } = useStore(sessionGroupStore);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const isCommanderUser = isCommander(user?.user_role as UserRole);

  if (selectedSessions.length === 0 || !isCommanderUser) {
    return null;
  }

  const handleAssignToGroup = async () => {
    if (!selectedGroupId) return;
    
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

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-800/30 rounded">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedSessions.length} session{selectedSessions.length > 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="Select group..." />
            </SelectTrigger>
            <SelectContent>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name} ({group.training_count || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={handleAssignToGroup}
            disabled={!selectedGroupId || isAssigning}
            className="h-8"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Assign
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}