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
  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  const { training, loadTrainingById } = useStore(TrainingStore);
  const [isLoading, setIsLoading] = useState(false);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { members, fetchMembers } = useStore(teamStore);
  const { saveSessionStats, updateSessionStats, getFullSessionById, selectedSession } = useStore(sessionStore);

  const { isOpen: isAssignmentModalOpen, setIsOpen: setIsAssignmentModalOpen } = useModal();
  const [activeSection, setActiveSection] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSyncPosition, setAutoSyncPosition] = useState(false);

  useEffect(() => {
    (async () => {
      if (sessionId) {
        console.log("sessionId", sessionId);
        setIsLoading(true);
        await getFullSessionById(sessionId);
        setIsLoading(false);
      }
    })();
  }, [sessionId]);

  // Debouncing ref to prevent multiple submissions
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    (async () => {
      if (id) {
        await fetchMembers(user?.team_id as string);
        await loadTrainingById(id);
      }
    })();
  }, [id, user?.team_id]);

  const [sessionData, setSessionData] = useState<SessionData>({
    assignment_id: "",
    dayPeriod: "day",
    timeToFirstShot: null,
    note: "",
    squad_id: user?.squad_id || "",
    effort: false,
  });

  const [participants, setParticipants] = useState<Participant[]>([]);

  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    if (selectedSession && sessionId) {
      // Load session data for editing
      setSessionData({
        assignment_id: selectedSession?.sessionStats?.assignment_id || "",
        dayPeriod: selectedSession?.sessionStats?.day_period || "day",
        timeToFirstShot: selectedSession?.sessionStats?.time_to_first_shot_sec || null,
        note: selectedSession?.sessionStats?.note || "",
        squad_id: selectedSession?.sessionStats?.squad_id || user?.squad_id || "",
        effort: selectedSession?.sessionStats?.effort || false,
      });

      // Load participants
      if (selectedSession?.participants && selectedSession.participants.length > 0) {
        setParticipants(
          selectedSession.participants.map((participant: any) => ({
            userId: participant.user_id,
            name:
              participant.name ||
              `${participant.users?.first_name || ""} ${participant.users?.last_name || ""}`.trim() ||
              participant.users?.email ||
              "",
            userDuty: participant.user_duty,
            position: participant.position,
            weaponId: participant.weapon_id || "",
            equipmentId: participant.equipment_id || "",
          })),
        );
      }

      // Load targets with engagements
      if (selectedSession?.targets && selectedSession.targets.length > 0) {
        setTargets(
          selectedSession.targets.map((target: any, index: number) => ({
            id: target.targetStats?.id || target.id || `target-${Date.now()}-${index}`,
            distance: target.targetStats?.distance_m || target.distance_m || target.distance || 0,
            windStrength: target.targetStats?.wind_strength || target.wind_strength || null,
            windDirection: target.targetStats?.wind_direction_deg || target.wind_direction_deg || target.wind_direction || null,
            mistakeCode: target.targetStats?.mistake_code || target.mistake_code || "",
            firstShotHit: target.targetStats?.first_shot_hit || target.first_shot_hit || false,
            engagements: (target.engagements || target.target_engagements || target.targetStats?.target_engagements || []).map((engagement: any) => ({
              userId: engagement.user_id,
              shotsFired: engagement.shots_fired || 0,
              targetHits: engagement.target_hits || 0,
            })),
          })),
        );
      }
    } else if (!sessionId) {
      // Initialize with default values for new session
      setSessionData({
        assignment_id: "",
        dayPeriod: "day",
        timeToFirstShot: null,
        note: "",
        effort: false,
        squad_id: user?.squad_id || "",
      });

      setParticipants([
        {
          userId: user?.id || "",
          name: user?.first_name || user?.last_name || user?.email || "",
          userDuty: user?.user_default_duty || "Sniper",
          position: "Lying",
          weaponId: user?.user_default_weapon || "",
          equipmentId: user?.user_default_equipment || "",
        },
      ]);

      setTargets([
        {
          id: `target-${Date.now()}`,
          distance: 500,
          windStrength: null,
          windDirection: null,
          mistakeCode: "",
          firstShotHit: false,
          engagements: [
            {
              userId: user?.id || "",
              shotsFired: 0,
              targetHits: 0,
            },
          ],
        },
      ]);
    }
  }, [selectedSession, sessionId, user]);

  // Effect: when autoSyncPosition is enabled, make sure all participants have the same position as current user
  useEffect(() => {
    if (autoSyncPosition) {
      const userPos = participants.find((p) => p.userId === user?.id)?.position;
      if (userPos) {
        setParticipants((prev) => prev.map((p) => ({ ...p, position: userPos })));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSyncPosition]);

  const trainingAssignments = training?.assignment_sessions || [];
  const teamMembers = members || [];

  const sections: Section[] = [
    { id: "session-config", title: "Session Configuration", icon: Settings, description: "Basic information" },
    { id: "participants", title: "Team Participants", icon: Users, description: "Team members" },
    { id: "targets", title: "Training Targets", icon: TargetIcon, description: "Target setup" },
    { id: "engagements", title: "Target Engagements", icon: Crosshair, description: "Performance data" },
    { id: "summary", title: "Summary", icon: CheckCircle2, description: "Review & submit" },
  ];

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
    return sessionData.assignment_id && sessionData.dayPeriod && sessionData.timeToFirstShot !== null && sessionData.effort !== undefined;
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

    return targets.some((target) => target.engagements.some((e) => e.shotsFired && e.shotsFired > 0));
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
    if (autoSyncPosition && field === "position" && userId === user?.id) {
      // Update all participants' positions in one go
      setParticipants((prev) => prev.map((p) => ({ ...p, position: value })));
    } else {
      // Regular update for a single participant
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.userId === userId) {
            const updatedParticipant: Participant = { ...p, [field]: value };
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
    }
  };

  // NEW: Sync the position of all participants to the provided position value
  const syncParticipantsPosition = (position: string) => {
    setParticipants((prev) => prev.map((p) => ({ ...p, position })));
  };

  const addParticipant = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member && !participants.find((p) => p.userId === member.id)) {
      const userPosition = participants.find((p) => p.userId === user?.id)?.position || "Lying";
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: member?.user_default_duty || "Sniper",
        position: autoSyncPosition ? userPosition : "Lying",
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
      const userPosition = participants.find((p) => p.userId === user?.id)?.position || "Lying";
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: member?.user_default_duty || "Sniper",
        position: autoSyncPosition ? userPosition : "Lying",
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
      firstShotHit: false,
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
    if (sessionData.effort === undefined || sessionData.effort === null) errors.push("Effort is required");
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
            effort: sessionData.effort,
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
            first_shot_hit: t.firstShotHit || false,
            engagements: t.engagements.map((eng) => ({
              user_id: eng.userId,
              shots_fired: eng.shotsFired || 0,
              target_hits: eng.targetHits || 0,
            })),
          })),
          // Current user for creator_id
          currentUser: user ? { id: user.id } : null,
        };

        console.log("Submitting session data:", saveData);

        try {
          if (sessionId) {
            // Update existing session
            await updateSessionStats(sessionId, saveData);
            toast.success("Training session updated successfully!");
          } else {
            // Create new session
            await saveSessionStats(saveData);
            toast.success("Training session submitted successfully!");
          }

          // Navigate back to training page after successful save/update
          if (id) {
            navigate(`/training/${id}`);
          }
        } catch (error) {
          console.error("Error saving session:", error);
          toast.error(`Failed to ${sessionId ? "update" : "submit"} training session. Please try again.`);
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
    isLoading,
    autoSyncPosition,
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
    syncParticipantsPosition,
    setAutoSyncPosition,
  };
};
