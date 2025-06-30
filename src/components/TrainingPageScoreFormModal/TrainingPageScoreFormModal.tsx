import { useState, useEffect } from "react";
import BaseDesktopDrawer from "../BaseDrawer/BaseDesktopDrawer";
import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { teamStore } from "@/store/teamStore";
import { Target, Users, Crosshair, Info, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { userStore } from "@/store/userStore";
import { TrainingStore } from "@/store/trainingStore";
import { scoreStore } from "@/store/scoreSrore";
import BaseMobileDrawer from "../BaseDrawer/BaseMobileDrawer";
import { isMobile } from "react-device-detect";
import AddAssignmentModal from "../AddAssignmentModal";
import { useModal } from "@/hooks/useModal";
import { Assignment } from "@/types/training";

interface ScoreFormValues {
  assignment_session_id: string;
  day_night: "day" | "night";
  position: string;
  time_until_first_shot: string;
  first_shot_hit?: string;
  wind_strength?: number;
  wind_direction?: number;
  note?: string;
  participants: any;
  duties: Record<string, string>;
  weapons: Record<string, string>;
  equipment: Record<string, string>;
  training_id: string;
  creator_id: string;
  scoreTargets: scoreTargets[];
}

interface scoreTargets {
  distance?: number;
  shots_fired?: number;
  target_hits?: number;
}

export default function ScoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingScore,
  trainingId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingScore?: any;
  assignmentSessions?: Assignment[];
  trainingId: string;
}) {
  const { training, createAssignment, loadTrainingById } = useStore(TrainingStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const { members: teamMembers } = useStore(teamStore);
  const { scoreTargetsByScoreId } = useStore(scoreStore);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showParticipantSelect, setShowParticipantSelect] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [teamMemberWithUserRole, setTeamMemberWithUserRole] = useState<any[]>([]);
  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const [formValues, setFormValues] = useState<ScoreFormValues>({
    assignment_session_id: "",
    creator_id: "",
    day_night: "day",
    position: "",
    time_until_first_shot: "",
    participants: [],
    duties: {},
    weapons: {},
    equipment: {},
    training_id: "",
    scoreTargets: [
      {
        distance: 100,
        shots_fired: 0,
        target_hits: 0,
      },
    ],
  });

  useEffect(() => {
    if (user) {
      setFormValues((prev) => ({
        ...prev,
        assignment_session_id: training?.assignment_sessions?.[0]?.id || "",
        creator_id: user?.id,
        participants: [...prev.participants, user?.id],
        duties: { ...prev.duties, [user?.id]: "Sniper" },
        weapons: { ...prev.weapons, [user?.id]: "1" },
        equipment: { ...prev.equipment, [user?.id]: "1" },
      }));
    }
  }, [user]);

  const filteredAssignments = training?.assignment_sessions;

  const handleOnAddAssignment = async (assignmentName: string) => {
    const { id } = await createAssignment(assignmentName, true, trainingId);
    setFormValues({
      ...formValues,
      assignment_session_id: id,
    });
    await loadTrainingById(trainingId);
    setIsAddAssignmentOpen(false);
  };

  useEffect(() => {
    if (editingScore) {
      // Extract participants from score_participants
      const participants = editingScore.score_participants?.map((sp: any) => sp.user?.id || sp.user_id) || [];
      const duties: Record<string, string> = {};
      const weapons: Record<string, string> = {};
      const equipment: Record<string, string> = {};

      editingScore.score_participants?.forEach((sp: any) => {
        const userId = sp.user?.id || sp.user_id;
        if (userId) {
          duties[userId] = sp.user_duty || sp.duty || "";
          weapons[userId] = sp.weapon_id ? String(sp.weapon_id) : "";
          equipment[userId] = sp.equipment_id ? String(sp.equipment_id) : "";
        }
      });

      const formData = {
        assignment_session_id: editingScore.assignment_session_id || "",
        day_night: editingScore.day_night || "day",
        position: editingScore.position || "",
        creator_id: editingScore.creator_id || "",
        time_until_first_shot: editingScore.time_until_first_shot || "",
        first_shot_hit: editingScore.first_shot_hit || "",
        wind_strength: editingScore.wind_strength || undefined,
        wind_direction: editingScore.wind_direction || undefined,
        note: editingScore.note || "",
        participants: participants,
        duties: duties,
        weapons: weapons,
        equipment: equipment,
        training_id: trainingId,
        scoreTargets:
          scoreTargetsByScoreId?.length > 0
            ? scoreTargetsByScoreId.map((st: any) => ({
                distance: st.distance,
                shots_fired: st.shots_fired,
                target_hits: st.target_hits,
              }))
            : [
                {
                  distance: 100,
                  shots_fired: 0,
                  target_hits: 0,
                },
              ],
      };

      setFormValues(formData);
    } else {
      // Reset form for new score
      setFormValues({
        assignment_session_id: "",
        creator_id: "",
        day_night: "day",
        position: "",
        time_until_first_shot: "",
        participants: [],
        duties: {},
        weapons: {},
        equipment: {},
        training_id: "",
        scoreTargets: [
          {
            distance: 100,
            shots_fired: 0,
            target_hits: 0,
          },
        ],
      });
    }
  }, [editingScore, trainingId, scoreTargetsByScoreId]);

  // Update team member list when teamMembers or user changes
  useEffect(() => {
    const updatedTeamMembers = [
      ...teamMembers,
      { id: user?.id, first_name: user?.first_name, last_name: user?.last_name, user_role: user?.user_role },
    ].filter(member => member.id); // Filter out undefined users
    setTeamMemberWithUserRole(updatedTeamMembers);
  }, [teamMembers, user]);

  // Add current user as default participant for new scores only
  useEffect(() => {
    const userId = user?.id;
    console.log('Default participant useEffect:', { userId, editingScore, participants: formValues.participants });
    
    if (userId && !editingScore && !formValues.participants.includes(userId)) {
      console.log('Adding default user participant:', userId);
      setFormValues(prev => ({
        ...prev,
        assignment_session_id: training?.assignment_sessions?.[0]?.id || prev.assignment_session_id,
        creator_id: userId,
        participants: [...prev.participants, userId],
        duties: { ...prev.duties, [userId]: "Sniper" },
        weapons: { ...prev.weapons, [userId]: "1" },
        equipment: { ...prev.equipment, [userId]: "1" },
      }));
    }
  }, [user, editingScore, training]);

  const validateForm = () => {
    const newErrors: string[] = [];

    // Assignment session validation
    if (!formValues.assignment_session_id) {
      newErrors.push("Assignment is required");
    } else if (!filteredAssignments?.some((session) => session.id === formValues.assignment_session_id)) {
      newErrors.push("Invalid assignment selected");
    }

    // Required fields validation
    if (!formValues.position) {
      newErrors.push("Position is required");
    }
    if (!formValues.time_until_first_shot) {
      newErrors.push("Time until first shot is required");
    }

    // Participants validation
    if (formValues.participants.length === 0) {
      newErrors.push("At least one participant is required");
    }

    // Validate each participant has a role and appropriate equipment
    formValues.participants.forEach((participantId: any) => {
      const duty = formValues.duties[participantId];
      if (!duty) {
        newErrors.push(`Role is required for participant ${participantId}`);
      } else if (duty === "Sniper" && !formValues.weapons[participantId]) {
        newErrors.push(`Weapon is required for Sniper ${participantId}`);
      } else if (duty === "Spotter" && !formValues.equipment[participantId]) {
        newErrors.push(`Equipment is required for Spotter ${participantId}`);
      }
    });

    // Numeric field validation
    if (formValues.wind_strength !== undefined && (isNaN(formValues.wind_strength) || formValues.wind_strength < 0)) {
      newErrors.push("Wind strength must be a positive number");
    }
    if (
      formValues.wind_direction !== undefined &&
      (isNaN(formValues.wind_direction) || formValues.wind_direction < 0 || formValues.wind_direction > 360)
    ) {
      newErrors.push("Wind direction must be between 0 and 360 degrees");
    }

    // Score distances validation
    if (formValues.scoreTargets.length === 0) {
      newErrors.push("At least one distance entry is required");
    }

    formValues.scoreTargets.forEach((entry, index) => {
      if (!entry.distance || entry.distance < 100 || entry.distance > 900) {
        newErrors.push(`Distance entry #${index + 1}: Distance must be between 100 and 900 meters`);
      }
      if (entry.shots_fired === undefined || entry.shots_fired < 0) {
        newErrors.push(`Distance entry #${index + 1}: Shots fired must be a positive number`);
      }
      if (entry.target_hits === undefined || entry.target_hits < 0) {
        newErrors.push(`Distance entry #${index + 1}: Hits must be a positive number`);
      }
      if (entry.target_hits !== undefined && entry.shots_fired !== undefined && entry.target_hits > entry.shots_fired) {
        newErrors.push(`Distance entry #${index + 1}: Hits cannot exceed shots fired`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const score_participants = formValues?.participants?.map((userId: any) => ({
        user_id: userId,
        user_duty: formValues.duties[userId],
        weapon_id: formValues.duties[userId] === "Sniper" ? formValues.weapons[userId] : null,
        equipment_id: formValues.duties[userId] === "Spotter" ? formValues.equipment[userId] : null,
      }));

      const scoreData = {
        ...formValues,
        score_participants,
        training_id: trainingId,
        assignment_session_id: formValues.assignment_session_id,
      };

      onSubmit(scoreData);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("score_assignment_session_id_fkey")) {
          setErrors(["Invalid assignment session. Please select a valid assignment."]);
        } else {
          setErrors([error.message]);
        }
      } else {
        setErrors(["An unexpected error occurred"]);
      }
    }
  };

  const addParticipant = (userId: string) => {
    if (!formValues.participants.includes(userId)) {
      setFormValues({
        ...formValues,
        participants: [...formValues.participants, userId],
        duties: { ...formValues.duties, [userId]: "" },
        weapons: { ...formValues.weapons, [userId]: "" },
        equipment: { ...formValues.equipment, [userId]: "" },
      });
    }
    setShowParticipantSelect(false);
  };

  const removeParticipant = (userId: string) => {
    if (formValues.participants.length === 1) {
      return;
    }

    const newParticipants = formValues.participants.filter((id: any) => id !== userId);
    setFormValues({
      ...formValues,
      participants: newParticipants,
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4  min-w-[00px] ">
        {[1, 2, 3].map((step) => (
          <div key={step} className=" items-center mx-auto flex justify-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              {step}
            </div>
            {step < 3 && <div className={`w-8 h-0.5 mx-2 ${currentStep > step ? "bg-indigo-600" : "bg-gray-700"}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Mission Selection */}
      <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50 flex flex-col gap-4">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-400" size={16} />
            <h2 className="text-base font-semibold text-white">Mission Selection</h2>
          </div>

          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="text-indigo-400  flex items-center gap-1.5 sm:text-xs text-xs hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50 px-3 py-1.5 "
          >
            <Plus size={14} />
          </button>
        </div>
        <select
          value={formValues?.assignment_session_id || ""}
          onChange={(e) => setFormValues({ ...formValues, assignment_session_id: e.target.value })}
          className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
        >
          <option value="">Select assignment</option>
          {filteredAssignments?.map((assignment) => {
            return (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_name}
              </option>
            );
          })}
        </select>
        <AddAssignmentModal
          isOpen={isAddAssignmentOpen}
          onClose={() => setIsAddAssignmentOpen(false)}
          onSuccess={(assignmentName: string) => {
            handleOnAddAssignment(assignmentName);
          }}
        />
      </div>

      {/* Combat Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Crosshair className="text-green-400" size={16} />
          <h4 className="text-sm font-semibold text-white">Combat Details</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <select
            value={formValues.day_night}
            onChange={(e) => setFormValues({ ...formValues, day_night: e.target.value as "day" | "night" })}
            className="w-full min-h-10 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
          >
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>

          <select
            value={formValues.position}
            onChange={(e) => setFormValues({ ...formValues, position: e.target.value })}
            className="w-full min-h-10 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
          >
            <option value="">Select position</option>
            <option value="lying">Lying</option>
            <option value="standing">Standing</option>
            <option value="sitting">Sitting</option>
            <option value="operational">Operational</option>
          </select>

          <input
            type="number"
            value={formValues.time_until_first_shot}
            onChange={(e) => setFormValues({ ...formValues, time_until_first_shot: e.target.value })}
            placeholder="Time until first shot (seconds)"
            className="w-full min-h-10 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
          />
        </div>
      </div>
    </div>
  );

  const addDistanceEntry = () => {
    const newEntry: scoreTargets = {
      distance: 100,
      shots_fired: 0,
      target_hits: 0,
    };
    setFormValues({
      ...formValues,
      scoreTargets: [...formValues.scoreTargets, newEntry],
    });
  };

  const removeDistanceEntry = (index: number) => {
    if (formValues.scoreTargets.length <= 1) return;
    const newDistances = formValues.scoreTargets.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      scoreTargets: newDistances,
    });
  };

  const updateDistanceEntry = (index: number, field: keyof scoreTargets, value: number) => {
    const newDistances = [...formValues.scoreTargets];
    newDistances[index] = { ...newDistances[index], [field]: value };
    setFormValues({
      ...formValues,
      scoreTargets: newDistances,
    });
  };

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-orange-400" size={16} />
          <h2 className="text-base font-semibold text-white">Shooting Performance</h2>
        </div>
        <button
          type="button"
          onClick={addDistanceEntry}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50"
        >
          <Plus size={14} />
          Add Distance
        </button>
      </div>

      {formValues.scoreTargets.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Target className="mx-auto mb-2" size={32} opacity={0.5} />
          <p>No distance entries added yet</p>
          <button type="button" onClick={addDistanceEntry} className="mt-2 text-indigo-400 hover:text-indigo-300">
            Add your first distance entry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {formValues.scoreTargets.map((entry, index) => (
          <div key={index} className="p-4 bg-zinc-800/20 rounded-lg border border-zinc-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-300">Target Entry #{index + 1}</h3>
              <button type="button" onClick={() => removeDistanceEntry(index)} className="text-zinc-500 hover:text-red-400">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <label className="block text-sm">
                <span className="text-gray-400">Distance (m)</span>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="25"
                  value={entry.distance}
                  onChange={(e) => updateDistanceEntry(index, "distance", +e.target.value)}
                  className="mt-2 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100m</span>
                  <span className="text-indigo-400 font-medium">{entry.distance || 100}m</span>
                  <span>900m</span>
                </div>
              </label>

              <label className="block text-sm">
                <span className="text-gray-400">Shots fired</span>
                <input
                  type="number"
                  value={entry.shots_fired || ""}
                  onChange={(e) => updateDistanceEntry(index, "shots_fired", +e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
                />
              </label>

              <label className="block text-sm">
                <span className="text-gray-400">Hits</span>
                <input
                  type="number"
                  value={entry.target_hits || ""}
                  onChange={(e) => updateDistanceEntry(index, "target_hits", +e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Optional Fields */}
      <button type="button" onClick={() => setShowOptionalFields(!showOptionalFields)} className="text-blue-400 hover:text-blue-300">
        {showOptionalFields ? "Hide Additional Information" : "Show Additional Information"}
      </button>

      {showOptionalFields && (
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center gap-2">
            <Info className="text-blue-400" size={16} />
            <h4 className="text-base font-semibold text-white">Additional Information</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Target Assessment</h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormValues({ ...formValues, first_shot_hit: "true" })}
                  className={`flex-1 p-2 rounded-lg border ${
                    formValues.first_shot_hit === "true" ? "bg-green-900/30 border-green-600" : "border-zinc-700"
                  }`}
                >
                  First Shot Hit
                </button>
                <button
                  type="button"
                  onClick={() => setFormValues({ ...formValues, first_shot_hit: "false" })}
                  className={`flex-1 p-2 rounded-lg border ${
                    formValues.first_shot_hit === "false" ? "bg-red-900/30 border-red-600" : "border-zinc-700"
                  }`}
                >
                  First Shot Missed
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Environmental Factors</h4>
              <input
                type="number"
                value={formValues.wind_strength || ""}
                onChange={(e) => setFormValues({ ...formValues, wind_strength: Number(e.target.value) })}
                placeholder="Wind strength (m/s)"
                className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
              />
              <input
                type="number"
                value={formValues.wind_direction || ""}
                onChange={(e) => setFormValues({ ...formValues, wind_direction: Number(e.target.value) })}
                placeholder="Wind direction (degrees)"
                className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
              />
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-zinc-400 mb-2">Mission Notes</h4>
              <textarea
                value={formValues.note || ""}
                onChange={(e) => setFormValues({ ...formValues, note: e.target.value })}
                placeholder="Add any observations or comments..."
                rows={3}
                className="w-full rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Participants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-400" size={16} />
            <h4 className="text-base font-semibold text-white">Participants</h4>
          </div>
          <button
            type="button"
            onClick={() => setShowParticipantSelect(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50"
          >
            <Plus size={14} />
            Add Participant
          </button>
        </div>

        {showParticipantSelect && (
          <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-zinc-300">Select Team Member</h5>
              <button type="button" onClick={() => setShowParticipantSelect(false)} className="text-zinc-400 hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamMembers
                .filter((member) => !formValues.participants.includes(member.id))
                .map((member) => (
                  <button
                    key={member.id}
                    onClick={() => addParticipant(member.id)}
                    className="w-full p-2 text-left text-sm text-zinc-300 hover:bg-zinc-700/30 rounded-lg flex items-center justify-between"
                  >
                    <span>
                      {member.first_name} {member.last_name}
                    </span>
                    <span className="text-xs text-zinc-500">{member.user_role}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {formValues.participants.map((participantId: any) => {
            const member = teamMemberWithUserRole.find((m) => m.id === participantId);
            return (
              <div key={participantId} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-800/20 rounded-lg">
                <div className="flex items-center justify-between md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      {member?.first_name} {member?.last_name}
                    </span>
                    <span className="text-xs text-zinc-500">{member?.user_role}</span>
                  </div>
                  <button type="button" onClick={() => removeParticipant(participantId)} className="text-zinc-500 hover:text-red-400">
                    <X size={16} />
                  </button>
                </div>

                <div>
                  <select
                    value={formValues.duties[participantId] || ""}
                    onChange={(e) => {
                      const newDuties = { ...formValues.duties, [participantId]: e.target.value };
                      setFormValues({ ...formValues, duties: newDuties });
                    }}
                    className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
                  >
                    <option value="">Select role</option>
                    <option value="Sniper">Sniper</option>
                    <option value="Spotter">Spotter</option>
                  </select>
                </div>

                {formValues.duties[participantId] === "Sniper" && (
                  <select
                    value={formValues.weapons[participantId] || ""}
                    onChange={(e) => {
                      const newWeapons = { ...formValues.weapons, [participantId]: e.target.value };
                      setFormValues({ ...formValues, weapons: newWeapons });
                    }}
                    className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
                  >
                    <option value="">Select weapon</option>
                    {weapons.map((weapon) => (
                      <option key={weapon.id} value={weapon.id}>
                        {weapon.weapon_type} — {weapon.serial_number}
                      </option>
                    ))}
                  </select>
                )}

                {formValues.duties[participantId] === "Spotter" && (
                  <select
                    value={formValues.equipment[participantId] || ""}
                    onChange={(e) => {
                      const newEquipment = { ...formValues.equipment, [participantId]: e.target.value };
                      setFormValues({ ...formValues, equipment: newEquipment });
                    }}
                    className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
                  >
                    <option value="">Select equipment</option>
                    {equipments.map((equipment) => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.equipment_type} — {equipment.serial_number}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const renderForm = () => (
    <div className="w-full space-y-6 min-w-[30vw]">
      {renderStepIndicator()}
      {renderCurrentStep()}

      {errors.length > 0 && (
        <div className="text-center rounded-lg my-6">
          <ul className="text-red-500">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-zinc-700 via-indigo-800 to-zinc-900 rounded-md"
          >
            Cancel
          </button>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-md"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-md"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={onClose} title={editingScore ? "Edit Score Entry" : "New Score Entry"}>
          {renderForm()}
        </BaseMobileDrawer>
      ) : (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={onClose} title={editingScore ? "Edit Score Entry" : "New Score Entry"}>
          {renderForm()}
        </BaseDesktopDrawer>
      )}
    </>
  );
}
