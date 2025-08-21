import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "zustand";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { userStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionGroupManagementSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionGroupManagementSimple({ isOpen, onClose }: SessionGroupManagementSimpleProps) {
  const { theme } = useTheme();
  const { createGroup } = useStore(sessionGroupStore);
  const user = useStore(userStore).user;
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !user?.team_id) return;

    setIsCreating(true);
    try {
      const success = await createGroup({
        team_id: user.team_id,
        name: name.trim(),
        description: description.trim() || undefined
      });

      if (success) {
        setName("");
        setDescription("");
        onClose();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${
        theme === 'dark' ? 'bg-black border-gray-800' : ''
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : ''
          }`}>
            Create Training Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : ''
            }`}>
              Group Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Phase I Training"
              className={`${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' 
                  : ''
              }`}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : ''
            }`}>
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this training group..."
              rows={3}
              className={`resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' 
                  : ''
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className={`${
              theme === 'dark' 
                ? 'border-gray-700 hover:bg-gray-900' 
                : ''
            }`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}