import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import BaseSelect from "@/components/base/BaseSelect";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { TrainingGroup } from "@/types/sessionGroup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";

interface SessionGroupFilterProps {
  onGroupChange: (group: TrainingGroup | null) => void;
  selectedGroupId?: string | null;
}

export default function SessionGroupFilter({ onGroupChange, selectedGroupId }: SessionGroupFilterProps) {
  const { theme } = useTheme();
  const { groups, loadGroups, createGroup, selectGroup } = useStore(sessionGroupStore);
  const user = useStore(userStore).user;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user?.team_id) {
      loadGroups(user.team_id);
    }
  }, [user?.team_id, loadGroups]);

  const handleGroupChange = (value: string) => {
    if (value === "") {
      selectGroup(null);
      onGroupChange(null);
    } else {
      const group = groups.find(g => g.id === value);
      if (group) {
        selectGroup(group);
        onGroupChange(group);
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!user?.team_id || !newGroupName.trim()) return;

    setIsCreating(true);
    const newGroup = await createGroup({
      team_id: user.team_id,
      name: newGroupName.trim(),
      description: newGroupDescription.trim() || undefined
    });

    if (newGroup) {
      setShowCreateForm(false);
      setNewGroupName("");
      setNewGroupDescription("");
      selectGroup(newGroup);
      onGroupChange(newGroup);
    }
    setIsCreating(false);
  };

  const groupOptions = groups.map(group => ({
    value: group.id,
    label: `${group.name} (${group.training_count || 0} sessions)`
  }));

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <BaseSelect
          label="Filter by Group"
          options={groupOptions}
          value={selectedGroupId || ""}
          onChange={(e) => handleGroupChange(e.target.value)}
          placeholder="All sessions"
        />
      </div>
      
      {!showCreateForm && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm(true)}
          className="mt-6"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Group
        </Button>
      )}

      {showCreateForm && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4`}>
          <div className={`${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Group</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewGroupName("");
                  setNewGroupDescription("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Description (optional)"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full min-h-[80px]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewGroupName("");
                    setNewGroupDescription("");
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || isCreating}
                >
                  {isCreating ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}