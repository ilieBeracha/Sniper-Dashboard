import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { squadStore } from "@/store/squadStore";
import { teamStore } from "@/store/teamStore";
import { Assignment } from "@/types/training";
import { userStore } from "@/store/userStore";
import { PositionScore } from "@/types/score";

// Types for form state
export interface ScoreFormValues {
  time_until_first_shot: string;
  distance: string;
  target_hit: string;
  day_night: "day" | "night";
  participants: string[];
  wind_strength: number | null;
  wind_direction: number | null;
  first_shot_hit: string | null;
  shots_fired: string;
  note: string;
  target_eliminated: string | null;
  position: PositionScore | null;
  duties: Record<string, string | null>;
  assignment_session_id: string;
  weapons: Record<string, string | null>;
  equipments: Record<string, string | null>;
}

export interface UseScoreFormProps {
  isOpen: boolean;
  editingScore?: any;
  assignmentSessions?: Assignment[];
}

export function useScoreForm({ editingScore, assignmentSessions = [] }: UseScoreFormProps) {
  const { squadUsers } = useStore(squadStore);
  const { members: teamMembers } = useStore(teamStore);
  const { user } = useStore(userStore);
  // Centralized form state
  const [formValues, setFormValues] = useState<ScoreFormValues>({
    time_until_first_shot: "",
    distance: "",
    target_hit: "",
    day_night: "day",
    participants: [],
    wind_strength: null,
    wind_direction: null,
    first_shot_hit: null,
    shots_fired: "",
    note: "",
    target_eliminated: null,
    position: null,
    duties: {},
    assignment_session_id: "",
    weapons: {},
    equipments: {},
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<string[] | any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (editingScore) {
      setFormValues({
        time_until_first_shot: editingScore.time_until_first_shot || "",
        distance: editingScore.distance || "",
        target_hit: editingScore.target_hit || "",
        day_night: editingScore.day_night || "day",
        participants: [],
        shots_fired: "",
        duties: {},
        assignment_session_id: editingScore.assignment_session_id || "",
        weapons: {},
        equipments: {},
        wind_strength: editingScore.wind_strength || null,
        wind_direction: editingScore.wind_direction || null,
        first_shot_hit: editingScore.first_shot_hit || null,
        note: editingScore.note || "",
        target_eliminated: editingScore.target_eliminated || null,
        position: editingScore.position || null,
      });
    }
  }, [editingScore]);

  // Handlers
  function handleChange<K extends keyof ScoreFormValues>(key: K, value: ScoreFormValues[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleDutyChange(userId: string, duty: string) {
    setFormValues((prev) => ({
      ...prev,
      duties: { ...prev.duties, [userId]: duty },
    }));
  }

  function handleWeaponChange(userId: string, weaponId: string) {
    setFormValues((prev) => ({
      ...prev,
      weapons: { ...prev.weapons, [userId]: weaponId },
    }));
  }

  function handleEquipmentChange(userId: string, equipmentId: string) {
    setFormValues((prev) => ({
      ...prev,
      equipments: { ...prev.equipments, [userId]: equipmentId },
    }));
  }

  function resetForm() {
    setFormValues({
      time_until_first_shot: "",
      distance: "",
      target_hit: "",
      day_night: "day",
      participants: [],
      wind_strength: null,
      wind_direction: null,
      first_shot_hit: null,
      note: "",
      target_eliminated: null,
      position: null,
      duties: {},
      assignment_session_id: "",
      weapons: {},
      equipments: {},
      shots_fired: "",
    });

    setErrors([]);
    setSearchTerm("");
    setStep(1);
  }

  // Validation logic
  function validateScoreForm() {
    const newErrors: string[] = [];

    if (!formValues.assignment_session_id) {
      newErrors.push("Assignment must be selected.");
    }
    if (formValues.day_night === null) {
      newErrors.push("Day/Night selection is required.");
    }
    if (formValues.position === null) {
      newErrors.push("Position is required.");
    }
    if (!formValues.distance) {
      newErrors.push("Distance is required.");
    }
    if (!formValues.target_hit) {
      newErrors.push("Target hit value is required.");
    }
    if (!formValues.shots_fired) {
      newErrors.push("Shots fired is required.");
    }
    if (!formValues.time_until_first_shot) {
      newErrors.push("Time until first shot is required.");
    }
    if (formValues.target_eliminated !== "true" && formValues.target_eliminated !== "false") {
      newErrors.push("Target eliminated must be true or false.");
    }
    if (formValues.first_shot_hit !== "true" && formValues.first_shot_hit !== "false") {
      newErrors.push("First shot hit must be true or false.");
    }
    if (formValues.wind_strength !== null && formValues.wind_strength % 6 !== 0) {
      newErrors.push("Wind strength must be a multiple of 6.");
    }
    if (formValues.wind_direction !== null && (formValues.wind_direction < 1 || formValues.wind_direction > 12)) {
      newErrors.push("Wind direction must be between 1 and 12.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }

  function validateScoreParticipantsForm() {
    const newErrors: string[] = [];

    if (!formValues.participants.includes(user?.id as string)) {
      newErrors.push("You must be in the participants list and have a weapon/equipment assigned.");
    }
    if (formValues.duties[user?.id as string] !== "Sniper" || !formValues.weapons[user?.id as string]) {
      newErrors.push("Must be at least one sniper.");
    }
    if (!Object.values(formValues.weapons).every((weapon) => weapon !== "")) {
      newErrors.push("Each sniper must have a weapon assigned.");
    }
    if (!Object.values(formValues.equipments).every((equipment) => equipment !== "")) {
      newErrors.push("Each spotter must have an equipment assigned.");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  }

  return {
    formValues,
    setFormValues,
    step,
    setStep,
    errors,
    setErrors,
    searchTerm,
    setSearchTerm,
    validateScoreForm,
    validateScoreParticipantsForm,
    handleChange,
    handleDutyChange,
    handleWeaponChange,
    handleEquipmentChange,
    resetForm,
    squadUsers,
    teamMembers,
    assignmentSessions,
  };
}
