import { useEffect } from "react";
import { Filter, X, ChevronDown, Plus, Check } from "lucide-react";
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

interface SessionGroupBarProps {
  onGroupChange: (group: TrainingGroup | null) => void;
  onCreateClick?: () => void;
}

export default function SessionGroupBar({ 
  onGroupChange, 
  onCreateClick
}: SessionGroupBarProps) {
  const { theme } = useTheme();
  const { groups, loadGroups, selectGroup, selectedGroup } = useStore(sessionGroupStore);
  const user = useStore(userStore).user;
  const isCommanderUser = isCommander(user?.user_role as UserRole);

  useEffect(() => {
    if (user?.team_id) {
      loadGroups(user.team_id);
    }
  }, [user?.team_id, loadGroups]);

  const handleGroupSelect = (group: TrainingGroup | null) => {
    selectGroup(group);
    onGroupChange(group);
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`h-8 px-3 text-sm ${
              selectedGroup 
                ? theme === 'dark'
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-950/50' 
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                : theme === 'dark'
                  ? 'border-gray-700 bg-gray-950 hover:bg-gray-900 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            {selectedGroup ? (
              <>
                <span className="max-w-[150px] truncate">{selectedGroup.name}</span>
                <span className={`ml-1.5 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  ({(selectedGroup as any).training_count || 0})
                </span>
              </>
            ) : (
              'All Trainings'
            )}
            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className={`w-56 ${
            theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white'
          }`}
        >
          {/* All Sessions Option */}
          <DropdownMenuItem
            onClick={() => handleGroupSelect(null)}
            className={`cursor-pointer text-sm ${
              !selectedGroup 
                ? theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className={!selectedGroup ? 'font-medium' : ''}>
                All Trainings
              </span>
              {!selectedGroup && (
                <Check className={`w-3.5 h-3.5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              )}
            </div>
          </DropdownMenuItem>
          
          {groups.length > 0 && <DropdownMenuSeparator className={
            theme === 'dark' ? 'bg-gray-800' : ''
          } />}
          
          {/* Group Options */}
          {groups.map(group => (
            <DropdownMenuItem
              key={group.id}
              onClick={() => handleGroupSelect(group)}
              className={`cursor-pointer text-sm ${
                selectedGroup?.id === group.id 
                  ? theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 mr-2 min-w-0">
                  <span className={`block truncate ${
                    selectedGroup?.id === group.id ? 'font-medium' : ''
                  }`}>
                    {group.name}
                  </span>
                  {group.description && (
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {group.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {group.training_count || 0}
                  </span>
                  {selectedGroup?.id === group.id && (
                    <Check className={`w-3.5 h-3.5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          
          {/* Create New Group - Commanders Only */}
          {isCommanderUser && (
            <>
              <DropdownMenuSeparator className={
                theme === 'dark' ? 'bg-gray-800' : ''
              } />
              <DropdownMenuItem
                onClick={onCreateClick}
                className={`cursor-pointer text-sm ${
                  theme === 'dark' 
                    ? 'text-blue-400 hover:bg-blue-950/50' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create New Group
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filter */}
      {selectedGroup && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleGroupSelect(null)}
          className={`h-8 w-8 ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}