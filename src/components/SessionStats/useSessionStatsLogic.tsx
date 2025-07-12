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
import { sessionStore } from "@/store/sessionStore";
import type { SessionStatsSaveData } from "@/store/sessionStore";

interface Participant {
  userId: string;
  name: string;
  userDuty: "Sniper" | "Spotter";
  weaponId: string;
  equipmentId: string;
  position: "Lying" | "Standing" | "Sitting" | "Operational";
}

interface Target {
  id: string;
  distance: number;
  windStrength?: number;
  windDirection?: number;
  mistakeCode?: string;
  engagements: TargetEngagement[];
}

interface TargetEngagement {
  userId: string;
  shotsFired: number;
  targetHits?: number;
}

const sessionDataSchema = z.object({
  squad_id: z.string().nullable(),
  team_id: z.string().nullable(),
  dayPeriod: z.string().nullable(),
  timeToFirstShot: z.number().nullable(),
  note: z.string().nullable(),
  assignment_id: z.string().nullable(),
  training_session_id: z.string().nullable(),
});

export type SessionData = z.infer<typeof sessionDataSchema>;

export function useSessionStatsLogic(isOpen: boolean) {
  const { user } = useStore(userStore);
  const defaultUserParticipant = {
    userId: user?.id || "",
    name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "",
    userDuty: user?.user_default_duty === UserDuty.SPOTTER ? "Spotter" : "Sniper",
    weaponId: user?.user_default_weapon || "",
    equipmentId: user?.user_default_equipment || "",
    position: "Lying",
  };

  const trainingStore = useStore(TrainingStore);
  const training = trainingStore?.training;
  const { members } = useStore(teamStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const trainingId = training?.id;
  const assignments = training?.assignment_sessions || [];
  const [participants, setParticipants] = useState<Participant[]>([defaultUserParticipant as Participant]);
  const [targets, setTargets] = useState<Target[]>([] as Target[]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const uniqueWeapons = [...new Set(weapons.map((weapon) => ({ name: weapon.weapon_type, id: weapon.id })))] as { name: string; id: string }[];
  const uniqueEquipments = [...new Set(equipments.map((equipment) => ({ name: equipment.equipment_type, id: equipment.id })))] as {
    name: string;
    id: string;
  }[];

  // Initialize session data with defaults
  const [sessionData, setSessionData] = useState<SessionData>({
    training_session_id: trainingId || null,
    team_id: user?.team_id || null,
    squad_id: user?.squad_id || null,
    assignment_id: null,
    dayPeriod: "day" as DayNight,
    timeToFirstShot: null,
    note: "",
  });

  // Add participant from member
  const addParticipant = (memberId?: string) => {
    // If a specific member is selected
    if (memberId) {
      const member = members?.find((m) => m.id === memberId);
      if (member && !participants.find((p) => p.userId === memberId)) {
        const newParticipant: Participant = {
          userId: memberId,
          name: `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.email || "",
          userDuty: member.user_default_duty === UserDuty.SPOTTER ? "Spotter" : "Sniper",
          weaponId: member.user_default_weapon || "",
          equipmentId: member.user_default_equipment || "",
          position: "Lying",
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
        userDuty: "Sniper",
        weaponId: "",
        equipmentId: "",
        position: "Lying",
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

  // Add multiple participants at once
  const addMultipleParticipants = (memberIds: string[]) => {
    const newParticipants: Participant[] = [];
    const newEngagements: { [targetId: string]: TargetEngagement[] } = {};
    
    // Create participant objects for all valid members
    memberIds.forEach((memberId) => {
      const member = members?.find((m) => m.id === memberId);
      if (member && !participants.find((p) => p.userId === memberId)) {
        newParticipants.push({
          userId: memberId,
          name: `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.email || "",
          userDuty: member.user_default_duty === UserDuty.SPOTTER ? "Spotter" : "Sniper",
          weaponId: member.user_default_weapon || "",
          equipmentId: member.user_default_equipment || "",
          position: "Lying",
        });
      }
    });

    if (newParticipants.length === 0) return;

    // Update participants in one batch
    setParticipants([...participants, ...newParticipants]);

    // Update all targets with new participant engagements in one batch
    const updatedTargets = targets.map((target) => {
      const newTargetEngagements = newParticipants.map((participant) => ({
        userId: participant.userId,
        shotsFired: 0,
        targetHits: undefined,
      }));

      return {
        ...target,
        engagements: [...target.engagements, ...newTargetEngagements],
      };
    });

    setTargets(updatedTargets);
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
    if (typeof field === "string") {
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
      mistakeCode: "",
      engagements: newEngagements as TargetEngagement[],
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

  // Form validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validate Session Information
    if (!sessionData.squad_id) errors.push("Squad is required");
    if (!sessionData.team_id) errors.push("Team is required");
    if (!sessionData.timeToFirstShot) errors.push("Time to First Shot is required");
    if (!sessionData.assignment_id) errors.push("Assignment is required");

    // Validate Participants
    if (participants.length === 0) {
      errors.push("At least one participant is required");
    } else {
      participants.forEach((p, index) => {
        if (!p.name) errors.push(`Participant ${index + 1}: Name is required`);
        if (p.userDuty === "Sniper") {
          if (!p.weaponId) errors.push(`Participant ${index + 1}: Weapon is required for snipers`);
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
      });
    }

    // Validate that all engagements have shots fired for snipers
    targets.forEach((target, tIndex) => {
      target.engagements.forEach((eng) => {
        const participant = participants.find((p) => p.userId === eng.userId);
        if (participant?.userDuty === "Sniper") {
          if (eng.shotsFired === undefined || eng.shotsFired < 0) {
            errors.push(`Target ${tIndex + 1}: Shots fired is required for ${participant.name}`);
          }
          // Check that hits don't exceed shots
          if (eng.targetHits !== undefined && eng.shotsFired !== undefined && eng.targetHits > eng.shotsFired) {
            errors.push(`Target ${tIndex + 1}: Hits (${eng.targetHits}) exceed shots (${eng.shotsFired}) for ${participant.name}`);
          }
        }
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle save using sessionStore
  const { saveSessionStats } = useStore(sessionStore);

  const handleSave = async (onClose: (sessionId?: string) => void) => {
    try {
      // Prepare data for sessionStore
      const wizardData: SessionStatsSaveData = {
        sessionData: {
          training_session_id: trainingId || null,
          assignment_id: sessionData.assignment_id,
          squad_id: sessionData.squad_id,
          team_id: sessionData.team_id,
          dayPeriod: sessionData.dayPeriod,
          timeToFirstShot: sessionData.timeToFirstShot,
          note: sessionData.note || null,
        },
        participants: participants.map((p) => ({
          user_id: p.userId,
          user_duty: p.userDuty,
          weapon_id: p.weaponId || null,
          equipment_id: p.equipmentId || null,
          position: p.position,
        })),
        targets: targets.map((t) => ({
          distance: t.distance,
          windStrength: t.windStrength,
          windDirection: t.windDirection,
          mistakeCode: t.mistakeCode,
          engagements: t.engagements.map((eng) => ({
            user_id: eng.userId,
            shots_fired: eng.shotsFired,
            target_hits: eng.targetHits,
          })),
        })),

        currentUser: user ? { id: user.id } : null,
      };

      // Use sessionStore to save
      const savedSession = await saveSessionStats(wizardData);

      toast.success("Session statistics saved successfully!");

      // Clear form and close
      resetForm();
      onClose(savedSession?.id);
    } catch (error) {
      console.error("Unexpected error saving session:", error);
      toast.error("An unexpected error occurred while saving");
    }
  };

  // Reset form
  const resetForm = () => {
    setSessionData({
      training_session_id: trainingId || null,
      team_id: user?.team_id || null,
      squad_id: user?.squad_id || null,
      assignment_id: null,
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
    addMultipleParticipants,
    removeParticipant,
    updateParticipant,

    // Target methods
    addTarget,
    removeTarget,
    updateTarget,
    updateEngagement,

    // Form methods
    validateForm,
    handleSave,
    resetForm,
  };
}
