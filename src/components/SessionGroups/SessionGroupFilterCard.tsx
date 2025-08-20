import { useState, useEffect } from "react";
import { Users, Plus, Filter, X } from "lucide-react";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { TrainingGroup } from "@/types/sessionGroup";
import { Button } from "@/components/ui/button";


import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

interface SessionGroupFilterCardProps {
  onGroupChange: (group: TrainingGroup | null) => void;
  onCreateClick?: () => void;
}

export default function SessionGroupFilterCard({ onGroupChange, onCreateClick }: SessionGroupFilterCardProps) {
  const { groups, loadGroups, selectGroup, selectedGroup } = useStore(sessionGroupStore);
  const user = useStore(userStore).user;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (user?.team_id) {
      loadGroups(user.team_id);
    }
  }, [user?.team_id, loadGroups]);

  const handleGroupSelect = (group: TrainingGroup | null) => {
    selectGroup(group);
    onGroupChange(group);
    setIsExpanded(false);
  };

  const isCommanderUser = isCommander(user?.user_role as UserRole);

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Training Group
          </h3>
        </div>
        {selectedGroup && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleGroupSelect(null)}
            className="text-xs"
          >
            Clear Filter
            <X className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>

      {/* Selected Group Display */}
      {selectedGroup && !isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {selectedGroup.name}
                </h4>
                {selectedGroup.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedGroup.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(selectedGroup as any).training_count || 0}
              </p>
              <p className="text-xs text-gray-500">Sessions</p>
            </div>
          </div>
        </div>
      )}

      {/* Group Grid */}
      {(!selectedGroup || isExpanded) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* All Sessions Card */}
          <div
            onClick={() => handleGroupSelect(null)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
              !selectedGroup
                ? 'border-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              {!selectedGroup && (
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              All Sessions
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View all training sessions
            </p>
          </div>

          {/* Group Cards */}
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => handleGroupSelect(group)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedGroup?.id === group.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  selectedGroup?.id === group.id
                    ? 'bg-blue-100 dark:bg-blue-800/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Users className={`w-5 h-5 ${
                    selectedGroup?.id === group.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                {selectedGroup?.id === group.id && (
                  <span className="text-xs bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {group.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {group.description || "No description"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Sessions</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {group.training_count || 0}
                </span>
              </div>
            </div>
          ))}

          {/* Add New Group Card - Commanders Only */}
          {isCommanderUser && (
            <div
              onClick={onCreateClick}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg group"
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                  <Plus className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Create New Group
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Organize your sessions
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}