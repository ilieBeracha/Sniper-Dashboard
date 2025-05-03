import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { squadStore } from "@/store/squadStore";
import { teamStore } from "@/store/teamStore";
import { Assignment } from "@/types/training";
import { UserDuty } from "@/types/score";

// Types for form state
export interface ScoreFormValues {
  time_until_first_shot: string;
  distance: string;
  target_hit: string;
  day_night: 'day' | 'night';
  participants: string[];
  wind_strength: number | null;
  wind_direction: number | null;
  first_shot_hit: boolean | null;
  note: string;
  target_eliminated: boolean | null;
  position: string | null;
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

export function useScoreForm({ isOpen, editingScore, assignmentSessions = [] }: UseScoreFormProps) {
  const { squadUsers } = useStore(squadStore);
  const { members: teamMembers } = useStore(teamStore);

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
    note: "",
    target_eliminated: null,
    position: null,
    duties: {},
    assignment_session_id: "",
    weapons: {},
    equipments: {},
  });

  // Modal step
  const [step, setStep] = useState<1 | 2>(1);
  // Error state
  const [errors, setErrors] = useState<string[]>([]);
  // Search term for participants
  const [searchTerm, setSearchTerm] = useState("");

  // Populate form on edit or squad user change
  useEffect(() => {
    if (editingScore) {
      setFormValues({
        time_until_first_shot: editingScore.time_until_first_shot || "",
        distance: editingScore.distance || "",
        target_hit: editingScore.target_hit || "",
        day_night: editingScore.day_night || "day",
        participants: editingScore?.participants?.map((p: any) => p) || [],
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
    } else if (squadUsers?.length) {
      setFormValues((prev) => ({
        ...prev,
        participants: squadUsers.map((u: any) => u.id),
      }));
    }
  }, [editingScore, squadUsers]);

  // Validation logic
  function validateForm() {
    const isValid =
      Object.values(formValues.duties).every((duty) => duty !== "") &&
      formValues.assignment_session_id !== "" &&
      formValues.time_until_first_shot !== "" &&
      formValues.distance !== "" &&
      formValues.target_hit !== "" &&
      formValues.day_night !== null &&
      formValues.wind_strength !== null &&
      formValues.wind_direction !== null &&
      formValues.first_shot_hit !== null &&
      formValues.note !== "" &&
      formValues.target_eliminated !== null &&
      Object.values(formValues.weapons).every((weapon) => weapon !== "");
    return isValid;
  }

  function handleAssignmentErrors(formValues: any) {
    const newErrors: string[] = [];

    if (!formValues.assignment_session_id) {
      newErrors.push("Assignment must be selected.");
    }
    if (!formValues.time_until_first_shot) {
      newErrors.push("Time until first shot is required.");
    }
    if (!formValues.distance) {
      newErrors.push("Distance is required.");
    }
    if (!formValues.target_hit) {
      newErrors.push("Target hit value is required.");
    }

    setErrors(newErrors);
  } 

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
    });
    setStep(1);
    setErrors([]);
    setSearchTerm("");
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
    validateForm,
    handleChange,
    handleDutyChange,
    handleWeaponChange,
    handleEquipmentChange,
    resetForm,
    squadUsers,
    teamMembers,
    assignmentSessions,
    handleAssignmentErrors,
  };
}
