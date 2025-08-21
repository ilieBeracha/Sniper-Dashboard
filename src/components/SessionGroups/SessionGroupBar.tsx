import { useEffect, useState } from "react";
import { Filter, X, ChevronDown, Plus, Users, Check } from "lucide-react";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { TrainingGroup } from "@/types/sessionGroup";
import { Button } from "@/components/ui/button";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionGroupBarProps {
  onGroupChange: (group: TrainingGroup | null) => void;
  onCreateClick?: () => void;
  selectedSessions: string[];
  onClearSelection: () => void;
  isSelectionMode: boolean;
}

export default function SessionGroupBar({ 
  onGroupChange, 
  onCreateClick,
  selectedSessions,
  onClearSelection,
  isSelectionMode
}: SessionGroupBarProps) {
  const { theme } = useTheme();
  const { groups, loadGroups, selectGroup, selectedGroup, addTrainingsToGroup } = useStore(sessionGroupStore);
  const user = useStore(userStore).user;
  const isCommanderUser = isCommander(user?.user_role as UserRole);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (user?.team_id) {
      loadGroups(user.team_id);
    }
  }, [user?.team_id, loadGroups]);

  const handleGroupSelect = (group: TrainingGroup | null) => {
    selectGroup(group);
    onGroupChange(group);
  };

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

  // Show bulk actions if in selection mode with selections
  const showBulkActions = isCommanderUser && isSelectionMode && selectedSessions.length > 0;

  return (
    <div className={`mb-4 p-3 rounded-lg border ${
      theme === 'dark' 
        ? 'bg-gray-900/50 border-gray-800' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left side - Filter */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={`h-9 ${
                  selectedGroup 
                    ? theme === 'dark'
                      ? 'border-blue-500/50 text-blue-400 hover:bg-blue-950/50' 
                      : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                    : theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedGroup ? (
                  <>
                    {selectedGroup.name}
                    <span className={`ml-2 text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      ({(selectedGroup as any).training_count || 0})
                    </span>
                  </>
                ) : (
                  'Filter by Group'
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="start" 
              className={`w-64 ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'
              }`}
            >
              {/* All Sessions Option */}
              <DropdownMenuItem
                onClick={() => handleGroupSelect(null)}
                className={`cursor-pointer ${
                  !selectedGroup 
                    ? theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={!selectedGroup ? 'font-semibold' : ''}>
                    All Sessions
                  </span>
                  {!selectedGroup && (
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      Active
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
              
              {groups.length > 0 && <DropdownMenuSeparator />}
              
              {/* Group Options */}
              {groups.map(group => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => handleGroupSelect(group)}
                  className={`cursor-pointer ${
                    selectedGroup?.id === group.id 
                      ? theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 mr-2">
                      <span className={selectedGroup?.id === group.id ? 'font-semibold' : ''}>
                        {group.name}
                      </span>
                      {group.description && (
                        <p className={`text-xs line-clamp-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {group.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {group.training_count || 0}
                      </span>
                      {selectedGroup?.id === group.id && (
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              
              {/* Create New Group - Commanders Only */}
              {isCommanderUser && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onCreateClick}
                    className={`cursor-pointer ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:bg-blue-950/50' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Group
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filter Button */}
          {selectedGroup && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleGroupSelect(null)}
              className="h-9 px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Right side - Bulk Actions */}
        {showBulkActions && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
              theme === 'dark' ? 'bg-blue-950/50' : 'bg-blue-100'
            }`}>
              <Check className={`w-4 h-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}>
                {selectedSessions.length} selected
              </span>
            </div>

            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className={`w-[180px] h-9 text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}>
                <SelectValue placeholder="Select group..." />
              </SelectTrigger>
              <SelectContent className={
                theme === 'dark' ? 'bg-gray-900 border-gray-800' : ''
              }>
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
              className="h-9 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Assign
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-9"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}