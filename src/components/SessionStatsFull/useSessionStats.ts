import { useState, useEffect, useRef, useCallback } from "react";
import { useStore } from "zustand";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TrainingStore } from "@/store/trainingStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { teamStore } from "@/store/teamStore";
import { sessionStore } from "@/store/sessionStore";
import { userStore } from "@/store/userStore";
import type { SessionData, Participant, Target, Section } from "./types";
import type { SessionStatsSaveData } from "@/store/sessionStore";
import { Target as TargetIcon, Users, Crosshair, Settings, CheckCircle2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";

export const useSessionStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  const { training, loadTrainingById } = useStore(TrainingStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { members, fetchMembers } = useStore(teamStore);
  const { saveSessionStats } = useStore(sessionStore);

  const { isOpen: isAssignmentModalOpen, setIsOpen: setIsAssignmentModalOpen } = useModal();
  const [activeSection, setActiveSection] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debouncing ref to prevent multiple submissions
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionData, setSessionData] = useState<SessionData>({
    assignment_id: "",
    dayPeriod: "",
    timeToFirstShot: null,
    note: "",
    squad_id: user?.squad_id || "",
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      userId: user?.id || "",
      name: user?.first_name || user?.last_name || user?.email || "",
      userDuty: user?.user_default_duty || "Sniper",
      position: "Lying",
      weaponId: user?.user_default_weapon || "",
      equipmentId: user?.user_default_equipment || "",
    },
  ]);

  const [targets, setTargets] = useState<Target[]>([
    {
      id: `target-${Date.now()}`,
      distance: 500,
      windStrength: null,
      windDirection: null,
      mistakeCode: "",
      engagements: [
        {
          userId: user?.id || "",
          shotsFired: 0,
          targetHits: 0,
        },
      ],
    },
  ]);

  const trainingAssignments = training?.assignment_sessions || [];
  const teamMembers = members || [];

  const sections: Section[] = [
    { id: "session-config", title: "Session Configuration", icon: Settings, description: "Basic information" },
    { id: "participants", title: "Team Participants", icon: Users, description: "Team members" },
    { id: "targets", title: "Training Targets", icon: TargetIcon, description: "Target setup" },
    { id: "engagements", title: "Target Engagements", icon: Crosshair, description: "Performance data" },
    { id: "summary", title: "Summary", icon: CheckCircle2, description: "Review & submit" },
  ];

  useEffect(() => {
    (async () => {
      if (id) {
        await fetchMembers(user?.team_id as string);
        await loadTrainingById(id);
      }
    })();
  }, [id, loadTrainingById, user?.team_id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const sections = container.querySelectorAll('[id^="session-"], [id^="participants"], [id^="targets"], [id^="engagements"], [id^="summary"]');

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (isAtBottom) {
      setActiveSection(sections.length - 1);
    } else {
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (rect.top >= containerRect.top && rect.top <= containerRect.top + 200) {
          setActiveSection(index);
        }
      });
    }
  };

  const validateSessionConfig = () => {
    return sessionData.assignment_id && sessionData.dayPeriod && sessionData.timeToFirstShot !== null;
  };

  const validateParticipants = () => {
    if (participants.length === 0) return false;
    return participants.every((p) => {
      if (p.userDuty === "Sniper") {
        return p.weaponId !== "";
      }
      return p.equipmentId !== "";
    });
  };

  const validateTargets = () => {
    return targets.length > 0;
  };

  const validateEngagements = () => {
    if (targets.length === 0) return false;
    const snipers = participants.filter((p) => p.userDuty === "Sniper");
    if (snipers.length === 0) return false;

    return targets.some((target) => target.engagements.some((e) => e.shotsFired > 0));
  };

  const getSectionValidationStatus = (sectionIndex: number) => {
    switch (sectionIndex) {
      case 0:
        return validateSessionConfig();
      case 1:
        return validateParticipants();
      case 2:
        return validateTargets();
      case 3:
        return validateEngagements();
      case 4:
        return validateSessionConfig() && validateParticipants() && validateTargets() && validateEngagements();
      default:
        return null;
    }
  };

  const updateSessionData = (field: keyof SessionData, value: any) => {
    setSessionData((prev) => ({ ...prev, [field]: value }));
  };

  const updateParticipant = (userId: string, field: keyof Participant, value: any) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.userId === userId) {
          const updatedParticipant = { ...p, [field]: value };

          // Clear conflicting fields when duty changes
          if (field === "userDuty") {
            if (value === "Sniper") {
              updatedParticipant.equipmentId = "";
            } else if (value === "Spotter") {
              updatedParticipant.weaponId = "";
            }
          }

          return updatedParticipant;
        }
        return p;
      }),
    );
  };

  const addParticipant = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member && !participants.find((p) => p.userId === member.id)) {
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: member?.user_default_duty || "Sniper",
        position: "Lying",
        weaponId: member?.user_default_weapon || "",
        equipmentId: member?.user_default_equipment || "",
      };
      setParticipants((prev) => [...prev, newParticipant]);
    }
  };

  const addSquad = () => {
    const squadMembers = teamMembers?.filter(
      (member: any) => member.squad_id === user?.squad_id && !participants.find((p: any) => p.userId === member.id),
    );

    squadMembers.forEach((member: any) => {
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: member?.user_default_duty || "Sniper",
        position: "Lying",
        weaponId: member?.user_default_weapon || "",
        equipmentId: member?.user_default_equipment || "",
      };
      setParticipants((prev) => [...prev, newParticipant]);
    });
  };

  const removeParticipant = (userId: string) => {
    if (userId === user?.id) return;
    setParticipants((prev) => prev.filter((p) => p.userId !== userId));
  };

  const addTarget = () => {
    const newTarget: Target = {
      id: `target-${Date.now()}`,
      distance: 100,
      windStrength: null,
      windDirection: null,
      mistakeCode: "",
      engagements: [],
    };
    setTargets((prev) => [...prev, newTarget]);
  };

  const updateTarget = (targetId: string, field: keyof Target, value: any) => {
    setTargets((prev) => prev.map((t) => (t.id === targetId ? { ...t, [field]: value } : t)));
  };

  const removeTarget = (targetId: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
  };

  const updateEngagement = (targetId: string, userId: string, field: "shotsFired" | "targetHits", value: number) => {
    setTargets((prev) =>
      prev.map((target) => {
        if (target.id !== targetId) return target;

        const existingEngagement = target.engagements.find((e) => e.userId === userId);
        if (existingEngagement) {
          return {
            ...target,
            engagements: target.engagements.map((e) => (e.userId === userId ? { ...e, [field]: value } : e)),
          };
        } else {
          return {
            ...target,
            engagements: [
              ...target.engagements,
              {
                userId,
                shotsFired: field === "shotsFired" ? value : 0,
                targetHits: field === "targetHits" ? value : 0,
              },
            ],
          };
        }
      }),
    );
  };

  // Validation function that runs on data changes
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    if (!sessionData.assignment_id) errors.push("Training Assignment is required");
    if (!sessionData.dayPeriod) errors.push("Time Period is required");

    // Validate participants
    if (participants.length === 0) {
      errors.push("At least one participant is required");
    } else {
      participants.forEach((p, index) => {
        if (p.userDuty === "Sniper" && !p.weaponId) {
          errors.push(`Participant ${index + 1} (${p.name}): Weapon is required for snipers`);
        }
        if (p.userDuty === "Spotter" && !p.equipmentId) {
          errors.push(`Participant ${index + 1} (${p.name}): Equipment is required for spotters`);
        }
      });
    }

    // Validate targets
    if (targets.length === 0) {
      errors.push("At least one target is required");
    }

    setValidationErrors(errors);
    return errors;
  }, [sessionData, participants, targets]);

  // Run validation when data changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    // Debounce the submission to prevent accidental double clicks
    submitTimeoutRef.current = setTimeout(async () => {
      setIsSubmitting(true);

      // Re-validate before submission
      const errors = validateForm();

      setValidationErrors(errors);

      if (errors.length === 0) {
        // Format data exactly as SessionStatsSaveData interface
        const saveData: SessionStatsSaveData = {
          // Session data from wizard
          sessionData: {
            training_session_id: training?.id || null,
            assignment_id: sessionData.assignment_id || null,
            team_id: user?.team_id || null,
            dayPeriod: sessionData.dayPeriod || null,
            timeToFirstShot: sessionData.timeToFirstShot,
            note: sessionData.note || null,
          },
          // Participants data from wizard
          participants: participants.map((p) => ({
            user_id: p.userId,
            user_duty: p.userDuty as "Sniper" | "Spotter",
            weapon_id: p.weaponId || null,
            equipment_id: p.equipmentId || null,
            position: p.position,
          })),
          // Targets data from wizard
          targets: targets.map((t) => ({
            distance: t.distance,
            windStrength: t.windStrength || undefined,
            windDirection: t.windDirection || undefined,
            totalHits: t.engagements.reduce((sum, eng) => sum + (eng.targetHits || 0), 0),
            mistakeCode: t.mistakeCode || undefined,
            engagements: t.engagements.map((eng) => ({
              user_id: eng.userId,
              shots_fired: eng.shotsFired,
              target_hits: eng.targetHits || undefined,
            })),
          })),
          // Current user for creator_id
          currentUser: user ? { id: user.id } : null,
        };

        console.log("Submitting session data:", saveData);

        try {
          await saveSessionStats(saveData);
          toast.success("Training session submitted successfully!");
          // Navigate back to training page after successful save
          if (id) {
            navigate(`/training/${id}`);
          }
        } catch (error) {
          console.error("Error saving session:", error);
          toast.error("Failed to submit training session. Please try again.");
        }
      }

      setIsSubmitting(false);
    }, 300); // 300ms debounce delay
  }, [isSubmitting, validateForm, training, user, id, navigate, saveSessionStats]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    activeSection,
    sessionData,
    participants,
    targets,
    validationErrors,
    sections,
    isSubmitting,

    // Data
    user,
    training,
    weapons,
    equipments,
    teamMembers,
    trainingAssignments,

    // Methods
    handleScroll,
    getSectionValidationStatus,
    updateSessionData,
    updateParticipant,
    addParticipant,
    addSquad,
    removeParticipant,
    addTarget,
    updateTarget,
    removeTarget,
    updateEngagement,
    handleSubmit,
    isAssignmentModalOpen,
    setIsAssignmentModalOpen,
  };
};
