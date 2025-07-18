import { useState, useEffect } from "react";
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

export const useSessionStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  const { training, loadTrainingById } = useStore(TrainingStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { members } = useStore(teamStore);
  const { saveSessionStats } = useStore(sessionStore);

  const [activeSection, setActiveSection] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
        await loadTrainingById(id);
      }
    })();
  }, [id, loadTrainingById]);

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
    setParticipants((prev) => prev.map((p) => (p.userId === userId ? { ...p, [field]: value } : p)));
  };

  const addParticipant = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member && !participants.find((p) => p.userId === member.id)) {
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: "Sniper",
        position: "Lying",
        weaponId: user?.user_default_weapon || "",
        equipmentId: user?.user_default_equipment || "",
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
        userDuty: "Sniper",
        position: "Lying",
        weaponId: user?.user_default_weapon || "",
        equipmentId: user?.user_default_equipment || "",
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

  const handleSubmit = async () => {
    const errors: string[] = [];
    if (!sessionData.assignment_id) errors.push("Training Assignment is required");
    if (!sessionData.squad_id) errors.push("Squad is required");
    if (!sessionData.dayPeriod) errors.push("Time Period is required");
    if (sessionData.timeToFirstShot === null || sessionData.timeToFirstShot === undefined) {
      errors.push("Time to First Shot is required");
    }

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

    if (errors.length === 0) {
      // Format data exactly as SessionStatsSaveData interface
      const saveData: SessionStatsSaveData = {
        // Session data from wizard
        sessionData: {
          training_session_id: training?.id || null,
          assignment_id: sessionData.assignment_id || null,
          squad_id: sessionData.squad_id || null,
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
        toast.success("Session statistics saved successfully!");
        // Navigate back to training page after successful save
        if (id) {
          navigate(`/training/${id}`);
        }
      } catch (error) {
        console.error("Error saving session:", error);
        toast.error("Failed to save session statistics");
      }
    }
  };

  return {
    // State
    activeSection,
    sessionData,
    participants,
    targets,
    validationErrors,
    sections,

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
  };
};
