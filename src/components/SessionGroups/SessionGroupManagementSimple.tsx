import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";

interface SessionGroupManagementSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionGroupManagementSimple({ 
  isOpen, 
  onClose 
}: SessionGroupManagementSimpleProps) {
  const { theme } = useTheme();
  const user = useStore(userStore).user;
  const { createGroup } = useStore(sessionGroupStore);
  
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!user?.team_id || !name.trim()) return;

    setIsCreating(true);
    const newGroup = await createGroup({
      team_id: user.team_id,
      name: name.trim(),
      description: description.trim() || undefined
    });
    
    if (newGroup) {
      setName("");
      setDescription("");
      onClose();
    }
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } rounded-lg shadow-xl max-w-md w-full p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create Training Group</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              className="w-full"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              {isCreating ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}