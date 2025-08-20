import { useState } from "react";
import { X, Plus, Trash2, Edit2, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { TrainingGroup } from "@/types/sessionGroup";
import { useTheme } from "@/contexts/ThemeContext";


interface SessionGroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionGroupManagementModal({ 
  isOpen, 
  onClose 
}: SessionGroupManagementModalProps) {
  const { theme } = useTheme();
  const user = useStore(userStore).user;
  const { groups, createGroup, deleteGroup } = useStore(sessionGroupStore);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!isOpen) return null;

  const handleCreateGroup = async () => {
    if (!user?.team_id || !newGroupName.trim()) return;

    setIsCreating(true);
    await createGroup({
      team_id: user.team_id,
      name: newGroupName.trim(),
      description: newGroupDescription.trim() || undefined
    });
    
    setNewGroupName("");
    setNewGroupDescription("");
    setIsCreating(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      await deleteGroup(groupId);
    }
  };

  const startEditing = (group: TrainingGroup) => {
    setEditingGroup(group.id);
    setEditName(group.name);
    setEditDescription(group.description || "");
  };

  const cancelEditing = () => {
    setEditingGroup(null);
    setEditName("");
    setEditDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Training Groups
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create and organize your training session groups
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create New Group Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Create New Group
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="md:col-span-1"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="md:col-span-1 min-h-[40px] max-h-[80px]"
            />
            <Button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim() || isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white md:col-span-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </div>

        {/* Existing Groups List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Existing Groups ({groups.length})
          </h3>
          
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No groups created yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Create your first group to start organizing sessions
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <div
                  key={group.id}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  } hover:shadow-md transition-shadow`}
                >
                  {editingGroup === group.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Group name"
                        />
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description"
                          className="min-h-[40px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            // Save logic would go here
                            cancelEditing();
                          }}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {group.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {group.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {group.training_count || 0} sessions
                          </span>
                          <span className="text-xs text-gray-400">
                            Created {new Date(group.created_at || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(group)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}