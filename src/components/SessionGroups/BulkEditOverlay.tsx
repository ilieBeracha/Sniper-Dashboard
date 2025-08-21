import { useState, useEffect } from "react";
import { X, Search, Check, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { TrainingSession } from "@/types/training";
import { useTheme } from "@/contexts/ThemeContext";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const user = useStore(userStore).user;
  const { groups, addTrainingsToGroup } = useStore(sessionGroupStore);
  const { loadTrainingByTeamId, getTrainingCountByTeamId } = useStore(TrainingStore);
  
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;

  useEffect(() => {
    if (isOpen && user?.team_id) {
      loadAllTrainings();
    }
  }, [isOpen, user?.team_id, currentPage]);

  useEffect(() => {
    // Filter trainings based on search term
    if (searchTerm) {
      const filtered = trainings.filter(t => 
        t.session_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTrainings(filtered);
    } else {
      setFilteredTrainings(trainings);
    }
  }, [searchTerm, trainings]);

  const loadAllTrainings = async () => {
    if (!user?.team_id) return;
    
    setIsLoading(true);
    const [result, count] = await Promise.all([
      loadTrainingByTeamId(user.team_id, LIMIT, currentPage * LIMIT),
      getTrainingCountByTeamId(user.team_id),
    ]);
    
    setTrainings(result || []);
    setTotalCount(count);
    setIsLoading(false);
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

  const handleSelectAllVisible = () => {
    const allIds = filteredTrainings.filter(t => t.id).map(t => t.id as string);
    allIds.forEach(id => {
      if (!selectedSessions.includes(id)) {
        onSelectionChange(id, true);
      }
    });
  };

  const totalPages = Math.ceil(totalCount / LIMIT);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b ${
        theme === 'dark' 
          ? 'bg-gray-950 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Bulk Edit Sessions
              </h2>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <Check className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {selectedSessions.length} selected
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-800 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              {/* Select All Visible */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllVisible}
                className={
                  theme === 'dark'
                    ? 'border-gray-700 hover:bg-gray-800'
                    : 'border-gray-300 hover:bg-gray-100'
                }
              >
                Select All Visible
              </Button>

              {/* Clear Selection */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className={
                  theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-100'
                }
              >
                Clear All
              </Button>
            </div>

            {/* Group Assignment */}
            <div className="flex items-center gap-2">
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className={`w-[200px] ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700' 
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
                onClick={handleAssignToGroup}
                disabled={!selectedGroupId || selectedSessions.length === 0 || isAssigning}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <Users className="w-4 h-4 mr-1.5" />
                Assign to Group
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Loading sessions...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Sessions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTrainings.map(training => {
                if (!training.id) return null;
                const isSelected = selectedSessions.includes(training.id);
                const sessionDate = parseISO(training.date);

                return (
                  <div
                    key={training.id}
                    onClick={() => onSelectionChange(training.id!, !isSelected)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? theme === 'dark'
                          ? 'border-blue-500 bg-blue-950/30'
                          : 'border-blue-500 bg-blue-50'
                        : theme === 'dark'
                          ? 'border-gray-800 bg-gray-900 hover:border-gray-700'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold line-clamp-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {training.session_name}
                      </h4>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => {}}
                        className="mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className={`space-y-1 text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p>{format(sessionDate, "MMM d, yyyy 'at' h:mm a")}</p>
                      {training.location && (
                        <p className="line-clamp-1">{training.location}</p>
                      )}
                      {training.assignments && training.assignments.length > 0 && (
                        <p>{training.assignments.length} assignment{training.assignments.length > 1 ? 's' : ''}</p>
                      )}
                    </div>

                    <div className={`mt-3 inline-flex px-2 py-1 rounded text-xs font-medium ${
                      training.status === 'completed'
                        ? theme === 'dark'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-green-100 text-green-700'
                        : training.status === 'scheduled'
                        ? theme === 'dark'
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                        : theme === 'dark'
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {training.status}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className={
                    theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-100'
                  }
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Page {currentPage + 1} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className={
                    theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-100'
                  }
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}