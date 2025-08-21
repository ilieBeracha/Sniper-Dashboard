import { useEffect } from "react";
import { Filter, X, ChevronDown, Plus } from "lucide-react";
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
    <div className="flex items-center gap-2 mb-4">
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`${
              selectedGroup 
                ? theme === 'dark'
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-950' 
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                : theme === 'dark'
                  ? 'border-gray-700 bg-gray-950 hover:bg-gray-900'
                  : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {selectedGroup ? (
              <>
                {selectedGroup.name}
                <span className={`ml-2 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
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
            theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white'
          }`}
        >
          {/* All Sessions Option */}
          <DropdownMenuItem
            onClick={() => handleGroupSelect(null)}
            className={`cursor-pointer ${
              !selectedGroup 
                ? theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100' 
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
                  ? theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
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
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {group.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
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
                    ? 'text-blue-400 hover:bg-blue-950' 
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
          className="h-8 px-2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}