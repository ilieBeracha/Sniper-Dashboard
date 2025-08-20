import { useState } from "react";
import { Check, Users, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { TrainingSession } from "@/types/training";
import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface SessionGroupBulkActionsBarProps {
  selectedSessions: string[];
  onClearSelection: () => void;
  trainings: TrainingSession[];
}

export default function SessionGroupBulkActionsBar({ 
  selectedSessions, 
  onClearSelection,
  trainings 
}: SessionGroupBulkActionsBarProps) {
  const { theme } = useTheme();
  const user = useStore(userStore).user;
  const { groups, addTrainingsToGroup } = useStore(sessionGroupStore);
  const [isAssigning, setIsAssigning] = useState(false);

  const isCommanderUser = isCommander(user?.user_role as UserRole);

  if (selectedSessions.length === 0 || !isCommanderUser) {
    return null;
  }

  const handleAssignToGroup = async (groupId: string) => {
    setIsAssigning(true);
    const success = await addTrainingsToGroup({
      group_id: groupId,
      training_ids: selectedSessions
    });

    if (success) {
      onClearSelection();
    }
    setIsAssigning(false);
  };

  const selectedTrainings = trainings.filter(t => t.id && selectedSessions.includes(t.id));

  return (
    <div className={`sticky top-0 z-20 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    } border-b border-gray-200 dark:border-gray-700 shadow-lg`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Selection info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedSessions.length} Session{selectedSessions.length > 1 ? 's' : ''} Selected
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ready to organize into groups
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Assign to Group Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isAssigning}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Assign to Group
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Select a group
                  </p>
                </div>
                <DropdownMenuSeparator />
                {groups.length === 0 ? (
                  <div className="px-2 py-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No groups available
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Create a group first
                    </p>
                  </div>
                ) : (
                  groups.map(group => (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() => handleAssignToGroup(group.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{group.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {group.training_count || 0} sessions
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Selection */}
            <Button
              variant="outline"
              onClick={onClearSelection}
              className="border-gray-300 dark:border-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Selected Sessions Preview */}
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTrainings.slice(0, 3).map(training => (
            <div
              key={training.id}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300"
            >
              {training.session_name}
            </div>
          ))}
          {selectedTrainings.length > 3 && (
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
              +{selectedTrainings.length - 3} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}