import { useState, useEffect } from "react";
import BaseDesktopDrawer from "../BaseDrawer/BaseDesktopDrawer";
import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { teamStore } from "@/store/teamStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { userStore } from "@/store/userStore";
import { TrainingStore } from "@/store/trainingStore";
import { scoreStore } from "@/store/scoreSrore";
import BaseMobileDrawer from "../BaseDrawer/BaseMobileDrawer";
import { isMobile } from "react-device-detect";
import { useModal } from "@/hooks/useModal";
import TrainingPageScoreFormModalInfo from "./TrainingPageScoreFormModalInfo";
import TrainingPageScoreFormModalStats from "./TrainingPageScoreFormModalStats";
import TrainingPageScoreFormModalParticipants from "./TrainingPageScoreFormModalParticipants";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/contexts/ThemeContext";
import TrainingPageScoreFormModalExtra from "./TrainingPageScoreFormModalExtra";

const scoreTargetSchema = z.object({
  distance: z.number().min(100).max(900),
  shots_fired: z.number().min(0),
  target_hits: z.number().min(0),
});

const scoreFormSchema = z
  .object({
    assignment_session_id: z.string().min(1, "Assignment is required"),
    day_night: z.enum(["day", "night"]),
    position: z.string().min(1, "Position is required"),
    wind_strength: z.number().min(0, "Wind strength must be positive").optional(),
    wind_direction: z.number().min(0).max(360, "Wind direction must be between 0 and 360").optional(),
    note: z.string().optional(),
    participants: z.array(z.string()).min(1, "At least one participant is required"),
    duties: z.record(z.string(), z.string()),
    weapons: z.record(z.string(), z.string()),
    equipment: z.record(z.string(), z.string()),
    training_id: z.string(),
    creator_id: z.string(),
    scoreTargets: z.array(scoreTargetSchema).min(1, "At least one distance entry is required"),
  })
  .refine(
    (data) => {
      // Validate each participant has a role and appropriate equipment
      for (const participantId of data.participants) {
        const duty = data.duties[participantId];
        if (!duty) return false;
        if (duty === "Sniper" && !data.weapons[participantId]) return false;
        if (duty === "Spotter" && !data.equipment[participantId]) return false;
      }
      return true;
    },
    {
      message: "Each participant must have a role and appropriate equipment",
    },
  )
  .refine(
    (data) => {
      // Validate score targets
      return data.scoreTargets.every((target) => target.target_hits <= target.shots_fired);
    },
    {
      message: "Hits cannot exceed shots fired for any target",
    },
  );

type ScoreFormValues = z.infer<typeof scoreFormSchema>;

interface scoreTargets {
  distance?: number;
  shots_fired?: number;
  target_hits?: number;
  day_night?: string;
  position?: string;
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
  trainingId: string;
}) {
  const { training, createAssignment, loadTrainingById } = useStore(TrainingStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const { members: teamMembers } = useStore(teamStore);
  const { scoreTargetsByScoreId } = useStore(scoreStore);
  const { theme } = useTheme();
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showParticipantSelect, setShowParticipantSelect] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [teamMemberWithUserRole, setTeamMemberWithUserRole] = useState<any[]>([]);
  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

  const methods = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreFormSchema),
    defaultValues: {
      assignment_session_id: "",
      creator_id: "",
      day_night: "day",
      position: "",
      participants: [],
      duties: {},
      weapons: {},
      equipment: {},
      training_id: trainingId,
      scoreTargets: [
        {
          distance: 100,
          shots_fired: 0,
          target_hits: 0,
        },
      ],
    },
  });

  const {
    handleSubmit: hookFormHandleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = methods;
  const formValues = watch();

  useEffect(() => {
    if (user && !formValues.participants.includes(user.id)) {
      setValue("assignment_session_id", training?.assignment_sessions?.[0]?.id || "");
      setValue("creator_id", user.id);
      setValue("participants", [...formValues.participants, user.id]);
      setValue("duties", { ...formValues.duties, [user.id]: "Sniper" });
      setValue("weapons", { ...formValues.weapons, [user.id]: "1" });
      setValue("equipment", { ...formValues.equipment, [user.id]: "1" });
    }
  }, [user, setValue, formValues.participants, formValues.duties, formValues.weapons, formValues.equipment, training]);

  const filteredAssignments = training?.assignment_sessions;

  const handleOnAddAssignment = async (assignmentName: string) => {
    const { id } = await createAssignment(assignmentName, true, trainingId);
    setValue("assignment_session_id", id);
    await loadTrainingById(trainingId);
    setIsAddAssignmentOpen(false);
  };

  useEffect(() => {
    if (editingScore) {
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

      const currentUserId = user?.id;
      const finalParticipants = currentUserId && !participants.includes(currentUserId) ? [...participants, currentUserId] : participants;

      const formData = {
        assignment_session_id: editingScore.assignment_session_id || "",
        day_night: editingScore.day_night || "day",
        position: editingScore.position || "",
        creator_id: editingScore.creator_id || "",
        wind_strength: editingScore.wind_strength || undefined,
        wind_direction: editingScore.wind_direction || undefined,
        note: editingScore.note || "",
        participants: finalParticipants,
        duties: duties,
        weapons: weapons,
        equipment: equipment,
        training_id: trainingId,
        scoreTargets:
          scoreTargetsByScoreId?.length > 0
            ? scoreTargetsByScoreId.map((st: any) => ({
                distance: Number(st.distance) || 100,
                shots_fired: Number(st.shots_fired) || 0,
                target_hits: Number(st.target_hits) || 0,
              }))
            : [
                {
                  distance: 100,
                  shots_fired: 0,
                  target_hits: 0,
                },
              ],
      };

      reset(formData);
    } else {
      // Reset form for new score
      reset({
        assignment_session_id: "",
        creator_id: "",
        day_night: "day",
        position: "",
        participants: [],
        duties: {},
        weapons: {},
        equipment: {},
        training_id: trainingId,
        scoreTargets: [
          {
            distance: 100,
            shots_fired: 0,
            target_hits: 0,
          },
        ],
      });
    }
  }, [editingScore, trainingId, scoreTargetsByScoreId, reset, user]);

  // Update team member list when teamMembers or user changes
  useEffect(() => {
    const updatedTeamMembers = [
      ...teamMembers,
      { id: user?.id, first_name: user?.first_name, last_name: user?.last_name, user_role: user?.user_role },
    ].filter((member) => member.id); // Filter out undefined users
    setTeamMemberWithUserRole(updatedTeamMembers);
  }, [teamMembers, user]);

  // Add current user as default participant for new scores only
  useEffect(() => {
    const userId = user?.id;

    if (userId && !editingScore && !formValues.participants.includes(userId)) {
      setValue("assignment_session_id", training?.assignment_sessions?.[0]?.id || formValues.assignment_session_id);
      setValue("creator_id", userId);
      setValue("participants", [...formValues.participants, userId]);
      setValue("duties", { ...formValues.duties, [userId]: "Sniper" });
      setValue("weapons", { ...formValues.weapons, [userId]: "1" });
      setValue("equipment", { ...formValues.equipment, [userId]: "1" });
    }
  }, [
    user,
    editingScore,
    training,
    setValue,
    formValues.participants,
    formValues.duties,
    formValues.weapons,
    formValues.equipment,
    formValues.assignment_session_id,
  ]);

  const handleSubmit = hookFormHandleSubmit((data) => {
    try {
      const score_participants = data.participants.map((userId: string) => ({
        user_id: userId,
        user_duty: data.duties[userId],
        weapon_id: data.duties[userId] === "Sniper" ? data.weapons[userId] : null,
        equipment_id: data.duties[userId] === "Spotter" ? data.equipment[userId] : null,
      }));

      const scoreData = {
        ...data,
        score_participants,
        training_id: trainingId,
        assignment_session_id: data.assignment_session_id,
      };

      onSubmit(scoreData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  });

  const addParticipant = (userId: string) => {
    if (!formValues.participants.includes(userId)) {
      setValue("participants", [...formValues.participants, userId]);
      setValue("duties", { ...formValues.duties, [userId]: "" });
      setValue("weapons", { ...formValues.weapons, [userId]: "" });
      setValue("equipment", { ...formValues.equipment, [userId]: "" });
    }
    setShowParticipantSelect(false);
  };

  const removeParticipant = (userId: string) => {
    // Prevent removing the current user
    if (userId === user?.id) {
      return;
    }

    if (formValues.participants.length === 1) {
      return;
    }

    const newParticipants = formValues.participants.filter((id: string) => id !== userId);
    setValue("participants", newParticipants);
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
        {[1, 2].map((step) => (
          <div key={step} className=" items-center mx-auto flex justify-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? "bg-indigo-600 text-white" : theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-300 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 2 && (
              <div className={`w-8 h-0.5 mx-2 ${currentStep > step ? "bg-indigo-600" : theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
  const addDistanceEntry = () => {
    const newEntry: scoreTargets = {
      distance: 100,
      shots_fired: 0,
      target_hits: 0,
    };
    setValue("scoreTargets", [...formValues.scoreTargets, newEntry as any]);
  };

  const removeDistanceEntry = (index: number) => {
    if (formValues.scoreTargets.length <= 1) return;
    const newDistances = formValues.scoreTargets.filter((_, i: number) => i !== index);
    setValue("scoreTargets", newDistances);
  };

  const updateDistanceEntry = (index: number, field: keyof scoreTargets, value: number) => {
    const newDistances = [...formValues.scoreTargets];
    newDistances[index] = { ...newDistances[index], [field]: value };
    setValue("scoreTargets", newDistances);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <TrainingPageScoreFormModalInfo
              setIsAddAssignmentOpen={setIsAddAssignmentOpen}
              filteredAssignments={filteredAssignments}
              isAddAssignmentOpen={isAddAssignmentOpen}
              handleOnAddAssignment={handleOnAddAssignment}
            />
            <div className="my-4 border-t border-gray-200 dark:border-gray-800" />
            <TrainingPageScoreFormModalParticipants
              teamMembers={teamMembers}
              user={user}
              weapons={weapons}
              equipments={equipments}
              showParticipantSelect={showParticipantSelect}
              setShowParticipantSelect={setShowParticipantSelect}
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
              teamMemberWithUserRole={teamMemberWithUserRole}
            />
          </>
        );
      case 2:
        return (
          <>
            <TrainingPageScoreFormModalStats
              addDistanceEntry={addDistanceEntry}
              removeDistanceEntry={removeDistanceEntry}
              updateDistanceEntry={updateDistanceEntry}
            />
            <TrainingPageScoreFormModalExtra showOptionalFields={showOptionalFields} setShowOptionalFields={setShowOptionalFields} />
          </>
        );
      default:
        return <></>;
    }
  };

  const renderForm = () => (
    <div className="w-full space-y-6 min-w-[30vw]">
      {renderStepIndicator()}
      {renderCurrentStep()}

      {Object.keys(errors).length > 0 && (
        <div className="text-center rounded-lg my-6">
          <ul className="text-red-500">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{(error as any)?.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              theme === "dark"
                ? "text-white bg-gradient-to-br from-zinc-700 via-indigo-800 to-zinc-900"
                : "text-gray-700 bg-gradient-to-br from-gray-200 via-indigo-200 to-gray-300"
            }`}
          >
            Cancel
          </button>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                theme === "dark" ? "text-white bg-gray-600 hover:bg-gray-700" : "text-gray-700 bg-gray-300 hover:bg-gray-400"
              }`}
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
    <FormProvider {...methods}>
      {isMobile ? (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={onClose} title={editingScore ? "Edit Score Entry" : "New Score Entry"}>
          {renderForm()}
        </BaseMobileDrawer>
      ) : (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={onClose} title={editingScore ? "Edit Score Entry" : "New Score Entry"}>
          {renderForm()}
        </BaseDesktopDrawer>
      )}
    </FormProvider>
  );
}
