import { useState, useEffect, useMemo } from "react";
import { X, Search, Check, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { getTrainingsInGroup } from "@/services/sessionGroupService";
import { TrainingSession } from "@/types/training";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

interface BulkEditOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSessions: string[];
  onSelectionChange: (sessionId: string, isSelected: boolean) => void;
  onClearSelection: () => void;
}

export default function BulkEditOverlay({
  isOpen,
  onClose,
  selectedSessions,
  onSelectionChange,
  onClearSelection
}: BulkEditOverlayProps) {
  const { theme } = useTheme();
  const { loadTrainingByTeamId } = useStore(TrainingStore);
  const { groups, addTrainingsToGroup } = useStore(sessionGroupStore);
  const user = useStore(userStore).user;

  const [allTrainings, setAllTrainings] = useState<TrainingSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  // Load all trainings when overlay opens
  useEffect(() => {
    if (isOpen && user?.team_id) {
      loadAllTrainings();
    }
  }, [isOpen, user?.team_id]);

  // Pre-select trainings when group is selected
  useEffect(() => {
    if (selectedGroup && isOpen) {
      preselectGroupTrainings();
    }
  }, [selectedGroup, isOpen]);

  const loadAllTrainings = async () => {
    if (!user?.team_id) return;
    
    setIsLoading(true);
    try {
      // Load all trainings (up to 1000)
      const trainings = await loadTrainingByTeamId(user.team_id, 1000, 0);
      setAllTrainings(trainings || []);
    } catch (error) {
      console.error("Error loading trainings:", error);
      toast.error("Failed to load trainings");
    } finally {
      setIsLoading(false);
    }
  };

  const preselectGroupTrainings = async () => {
    if (!selectedGroup) return;
    
    try {
      // Call the service directly to get trainings in group
      const trainingsInSelectedGroup = await getTrainingsInGroup(selectedGroup);
      
      if (trainingsInSelectedGroup && trainingsInSelectedGroup.length > 0) {
        // Clear previous selections first
        onClearSelection();
        
        // Select all trainings in this group
        trainingsInSelectedGroup.forEach(training => {
          if (training.id) {
            onSelectionChange(training.id, true);
          }
        });
        
        toast.info(`Selected ${trainingsInSelectedGroup.length} trainings from group`);
      }
    } catch (error) {
      console.error("Error loading group trainings:", error);
    }
  };

  // Filter trainings based on search
  const filteredTrainings = useMemo(() => {
    return allTrainings.filter(training => {
      const searchLower = searchQuery.toLowerCase();
      return (
        training.session_name?.toLowerCase().includes(searchLower) ||
        training.location?.toLowerCase().includes(searchLower) ||
        training.date?.includes(searchQuery)
      );
    });
  }, [allTrainings, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTrainings.length / ITEMS_PER_PAGE);
  const paginatedTrainings = filteredTrainings.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleAddToGroup = async () => {
    if (!selectedGroup || selectedSessions.length === 0) {
      toast.warning("Please select a group and at least one training");
      return;
    }

    setIsLoading(true);
    try {
      const success = await addTrainingsToGroup({
        group_id: selectedGroup,
        training_ids: selectedSessions
      });

      if (success) {
        toast.success(`Added ${selectedSessions.length} trainings to group`);
        onClearSelection();
        onClose();
      }
    } catch (error) {
      console.error("Error adding to group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    const allIds = paginatedTrainings
      .filter(t => t.id)
      .map(t => t.id as string);
    
    const allSelected = allIds.every(id => selectedSessions.includes(id));
    
    if (allSelected) {
      // Deselect all on current page
      allIds.forEach(id => onSelectionChange(id, false));
    } else {
      // Select all on current page
      allIds.forEach(id => onSelectionChange(id, true));
    }
  };

  if (!isOpen) return null;

  const allPageIds = paginatedTrainings.filter(t => t.id).map(t => t.id as string);
  const allPageSelected = allPageIds.length > 0 && allPageIds.every(id => selectedSessions.includes(id));

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-4">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Bulk Edit Mode
          </h2>
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {selectedSessions.length} selected
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Controls Bar */}
      <div className={`p-4 border-b ${
        theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trainings..."
              className={`pl-10 ${
                theme === 'dark' 
                  ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-600' 
                  : 'bg-white'
              }`}
            />
          </div>

          {/* Group Selection and Actions */}
          <div className="flex gap-2">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className={`w-[200px] ${
                theme === 'dark' 
                  ? 'bg-gray-950 border-gray-800 text-white' 
                  : 'bg-white'
              }`}>
                <SelectValue placeholder="Select group..." />
              </SelectTrigger>
              <SelectContent className={
                theme === 'dark' ? 'bg-black border-gray-800' : ''
              }>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddToGroup}
              disabled={!selectedGroup || selectedSessions.length === 0 || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Add to Group
            </Button>

            <Button
              onClick={handleSelectAll}
              variant="outline"
              className={theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : ''}
            >
              {allPageSelected ? 'Deselect Page' : 'Select Page'}
            </Button>

            {selectedSessions.length > 0 && (
              <Button
                onClick={onClearSelection}
                variant="ghost"
                className={theme === 'dark' ? 'hover:bg-gray-900' : ''}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Loading trainings...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedTrainings.map(training => {
              if (!training.id) return null;
              const isSelected = selectedSessions.includes(training.id);
              const sessionDate = parseISO(training.date);

              return (
                <div
                  key={training.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectionChange(training.id!, !isSelected);
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-950/20'
                        : 'border-blue-500 bg-blue-50'
                      : theme === 'dark'
                        ? 'border-gray-800 bg-gray-950 hover:border-gray-700'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-medium text-sm line-clamp-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {training.session_name || "Unnamed Session"}
                    </h3>
                    {isSelected && (
                      <div className="bg-blue-600 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs space-y-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    <p>{format(sessionDate, 'MMM d, yyyy')}</p>
                    {training.location && (
                      <p className="line-clamp-1">{training.location}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between p-4 border-t ${
          theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Showing {currentPage * ITEMS_PER_PAGE + 1}-{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredTrainings.length)} of {filteredTrainings.length}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : ''}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : ''}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}