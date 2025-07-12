import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { z } from "zod";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { DayNight, UserDuty } from "@/types/score";
import { teamStore } from "@/store/teamStore";
import { toast } from "react-toastify";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";

interface Participant {
  userId: string;
  name: string;
  userDuty: "sniper" | "spotter";
  weaponId: string;
  equipmentId: string;
  position: "lying" | "standing" | "kneeling" | "sitting";
  shotsFired?: number; // Total shots fired by sniper
}

interface Target {
  id: string;
  distance: number;
  windStrength?: number;
  windDirection?: number;
  totalHits?: number;
  mistakeCode?: string;
  engagements: TargetEngagement[];
}

interface TargetEngagement {
  userId: string;
  shotsFired: number;
  targetHits?: number;
}

const sessionDataSchema = z.object({
  squadId: z.string().nullable(),
  teamId: z.string().nullable(),
  dayPeriod: z.string().nullable(),
  timeToFirstShot: z.number().nullable(),
  note: z.string().nullable(),
  assignmentId: z.string().nullable(),
  trainingId: z.string().nullable(),
});

export type SessionData = z.infer<typeof sessionDataSchema>;

export function useSessionStatsLogic(isOpen: boolean) {
  const { user } = useStore(userStore);
  const { training } = useStore(TrainingStore);
  const { members } = useStore(teamStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const trainingId = training?.id;
  const assignments = training?.assignment_sessions || [];

  const uniqueWeapons = [...new Set(weapons.map((weapon) => weapon.weapon_type))];
  const uniqueEquipments = [...new Set(equipments.map((equipment) => equipment.equipment_type))];

  // Initialize session data with defaults
  const [sessionData, setSessionData] = useState<SessionData>({
    trainingId: trainingId || null,
    teamId: user?.team_id || null,
    squadId: user?.squad_id || null,
    assignmentId: null,
    dayPeriod: "day" as DayNight,
    timeToFirstShot: null,
    note: "",
  });

  const defaultUserParticipant = {
    userId: user?.id || "",
    name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "",
    userDuty: user?.user_default_duty === UserDuty.SPOTTER ? "spotter" : "sniper",
    weaponId: user?.user_default_weapon || "",
    equipmentId: user?.user_default_equipment || "",
    position: "lying",
    shotsFired: 0,
  };

  const [participants, setParticipants] = useState<Participant[]>([defaultUserParticipant as Participant]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Add participant from member
  const addParticipant = (memberId?: string) => {
    // If a specific member is selected
    if (memberId) {
      const member = members?.find((m) => m.id === memberId);
      if (member && !participants.find((p) => p.userId === memberId)) {
        const newParticipant: Participant = {
          userId: memberId,
          name: `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.email || "",
          userDuty: member.user_default_duty === UserDuty.SPOTTER ? "spotter" : "sniper",
          weaponId: member.user_default_weapon || "",
          equipmentId: member.user_default_equipment || "",
          position: "lying",
          shotsFired: 0,
        };
        setParticipants([...participants, newParticipant]);

        // Automatically add this participant to all existing targets
        const newTargets = targets.map((target) => ({
          ...target,
          engagements: [
            ...target.engagements,
            {
              userId: newParticipant.userId,
              shotsFired: 0,
              targetHits: undefined,
            },
          ],
        }));
        setTargets(newTargets);
      }
    } else {
      // Create a blank participant if no member selected
      const newParticipant: Participant = {
        userId: `user-${Date.now()}`,
        name: "",
        userDuty: "sniper",
        weaponId: "",
        equipmentId: "",
        position: "lying",
        shotsFired: 0,
      };
      setParticipants([...participants, newParticipant]);

      // Automatically add this participant to all existing targets
      const newTargets = targets.map((target) => ({
        ...target,
        engagements: [
          ...target.engagements,
          {
            userId: newParticipant.userId,
            shotsFired: 0,
            targetHits: undefined,
          },
        ],
      }));
      setTargets(newTargets);
    }
  };

  // Remove participant
  const removeParticipant = (index: number, userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot remove yourself from the session");
      return;
    }

    const participantToRemove = participants[index];

    // Remove participant from all target engagements
    const newTargets = targets.map((target) => ({
      ...target,
      engagements: target.engagements.filter((eng) => eng.userId !== participantToRemove.userId),
    }));
    setTargets(newTargets);

    // Remove participant from list
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  // Update participant
  const updateParticipant = (index: number, field: keyof Participant | Partial<Participant>, value?: any) => {
    const newParticipants = [...participants];
    if (typeof field === 'string') {
      // Single field update
      newParticipants[index] = { ...newParticipants[index], [field]: value };
    } else {
      // Batch update
      newParticipants[index] = { ...newParticipants[index], ...field };
    }
    setParticipants(newParticipants);
  };

  // Add target
  const addTarget = () => {
    // Create new target with engagements for all existing participants
    const newEngagements = participants.map((p) => ({
      userId: p.userId,
      shotsFired: 0,
      targetHits: undefined,
    }));

    const newTarget: Target = {
      id: `target-${Date.now()}`,
      distance: 100,
      windStrength: undefined,
      windDirection: undefined,
      totalHits: undefined,
      mistakeCode: "",
      engagements: newEngagements,
    };

    setTargets([...targets, newTarget]);
  };

  // Remove target
  const removeTarget = (index: number) => {
    const newTargets = targets.filter((_, i) => i !== index);
    setTargets(newTargets);
  };

  // Update target
  const updateTarget = (index: number, field: keyof Omit<Target, "engagements" | "id">, value: any) => {
    const newTargets = [...targets];
    newTargets[index] = { ...newTargets[index], [field]: value };
    setTargets(newTargets);
  };

  // Update engagement
  const updateEngagement = (targetIndex: number, engagementIndex: number, field: keyof TargetEngagement, value: any) => {
    const newTargets = [...targets];
    const engagement = newTargets[targetIndex].engagements[engagementIndex];
    newTargets[targetIndex].engagements[engagementIndex] = { ...engagement, [field]: value };
    setTargets(newTargets);
  };

  // Calculate estimated hits
  const calculateEstimatedHits = (targetIndex: number) => {
    const target = targets[targetIndex];
    if (!target.totalHits) return;

    const totalShotsFired = target.engagements.reduce((sum, eng) => sum + eng.shotsFired, 0);
    if (totalShotsFired === 0) return;

    const newTargets = [...targets];
    newTargets[targetIndex].engagements = target.engagements.map((eng) => {
      if (eng.targetHits === undefined || eng.targetHits === null) {
        const estimatedHits = Math.round((eng.shotsFired / totalShotsFired) * target.totalHits!);
        return { ...eng, targetHits: estimatedHits };
      }
      return eng;
    });
    setTargets(newTargets);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validate Session Information
    if (!sessionData.squadId) errors.push("Squad is required");
    if (!sessionData.teamId) errors.push("Team is required");
    if (!sessionData.timeToFirstShot) errors.push("Time to First Shot is required");
    if (!sessionData.assignmentId) errors.push("Assignment is required");

    // Validate Participants
    if (participants.length === 0) {
      errors.push("At least one participant is required");
    } else {
      participants.forEach((p, index) => {
        if (!p.name) errors.push(`Participant ${index + 1}: Name is required`);
        if (p.userDuty === "sniper") {
          if (!p.weaponId) errors.push(`Participant ${index + 1}: Weapon is required for snipers`);
          if (p.shotsFired === undefined || p.shotsFired < 0) errors.push(`Participant ${index + 1}: Shots fired is required for snipers`);
        } else {
          if (!p.equipmentId) errors.push(`Participant ${index + 1}: Equipment is required for spotters`);
        }
      });
    }

    // Validate Targets
    if (targets.length === 0) {
      errors.push("At least one target is required");
    } else {
      targets.forEach((t, index) => {
        if (!t.distance || t.distance <= 0) errors.push(`Target ${index + 1}: Distance must be greater than 0`);
        if (t.totalHits === undefined || t.totalHits < 0) errors.push(`Target ${index + 1}: Total hits is required and must be 0 or greater`);

        // Validate engagements
        let totalPersonalHits = 0;
        t.engagements.forEach((eng) => {
          const participant = participants.find((p) => p.userId === eng.userId);
          if (participant?.userDuty === "sniper" && eng.targetHits !== undefined) {
            totalPersonalHits += eng.targetHits;
          }
        });
        
        // Check if total personal hits exceed target total hits
        if (t.totalHits !== undefined && totalPersonalHits > t.totalHits) {
          errors.push(`Target ${index + 1}: Total personal hits (${totalPersonalHits}) exceed target total hits (${t.totalHits})`);
        }
      });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle save
  const handleSave = (onClose: () => void) => {
    if (validateForm()) {
      // TODO: Save the data to database
      console.log("Form is valid, saving...");
      console.log({ sessionData, participants, targets });

      // Clear form and close
      resetForm();
      onClose();
    }
  };

  // Reset form
  const resetForm = () => {
    setSessionData({
      trainingId: trainingId || null,
      teamId: user?.team_id || null,
      squadId: user?.squad_id || null,
      assignmentId: null,
      dayPeriod: "day" as DayNight,
      timeToFirstShot: null,
      note: "",
    });
    setParticipants([defaultUserParticipant as Participant]);
    setTargets([]);
    setValidationErrors([]);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return {
    // Data
    sessionData,
    setSessionData,
    participants,
    targets,
    validationErrors,
    assignments,
    members,
    user,
    uniqueWeapons,
    uniqueEquipments,
    // Participant methods
    addParticipant,
    removeParticipant,
    updateParticipant,

    // Target methods
    addTarget,
    removeTarget,
    updateTarget,
    updateEngagement,
    calculateEstimatedHits,

    // Form methods
    validateForm,
    handleSave,
    resetForm,
  };
}
