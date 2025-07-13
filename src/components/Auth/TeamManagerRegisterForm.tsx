import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Check, FileText, Users, Target, ChevronDown } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useStore } from "zustand";
import z from "zod";
import { TrainingSession } from "@/types/training";
import { useEffect, useState } from "react";

export default function SessionStats({ isOpen, onClose, training }: { isOpen: boolean; onClose: () => void; training: TrainingSession }) {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { members } = useStore(teamStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const [activeSection, setActiveSection] = useState("session-info");
  const [openParticipant, setOpenParticipant] = useState(0);
  const [openTarget, setOpenTarget] = useState(0);

  useEffect(() => {
    console.log(weapons);
    console.log(equipments);
  }, [weapons, equipments]);

  const sections = [
    { id: "session-info", label: "Session Information", step: 1, icon: FileText },
    { id: "participants", label: "Participants", step: 2, icon: Users },
    { id: "targets", label: "Target Statistics", step: 3, icon: Target },
  ];

  const getCurrentStepIndex = () => sections.findIndex((s) => s.id === activeSection);
  const isStepCompleted = (stepId: string) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = sections.findIndex((s) => s.id === stepId);
    return stepIndex < currentIndex;
  };

  const groupScoreSchema = z.object({
    team_id: z.string().uuid(),
    training_id: z.string().uuid(),
    assignment_id: z.string().uuid(),
    creator_id: z.string().uuid(),
    squad_id: z.string().uuid(),
    day_period: z.string(),
    time_to_first_shot: z.number().min(0).optional(),
    note: z.string().optional(),
    participants: z.array(
      z.object({
        user_id: z.string().uuid(),
        user_duty: z.string(),
        weapon_id: z.string().uuid().optional(),
        equipment_id: z.string().uuid().optional(),
        position: z.string(),
      }),
    ),
    targets: z.array(
      z.object({
        distance: z.number().min(0),
        wind_strength: z.number().min(0).optional(),
        wind_direction: z.number().min(0).max(360).optional(),
        shots_fired: z.number().min(0).optional(),
        total_hits: z.number().min(0).optional(),
        mistake_code: z.string().optional(),
        target_eliminated: z.boolean().optional(),
        engagements: z.array(
          z.object({
            user_id: z.string().uuid(),
            shots_fired: z.number().min(0),
            target_hits: z.number().min(0).optional(),
            is_estimated: z.boolean().optional(),
            estimated_method: z.string().optional(),
          }),
        ),
      }),
    ),
  });

  const methods = useForm<z.infer<typeof groupScoreSchema>>({
    resolver: zodResolver(groupScoreSchema),
    defaultValues: {
      team_id: user?.team_id ?? "",
      training_id: training?.id,
      assignment_id: training?.assignments?.[0]?.id,
      creator_id: training?.creator_id?.id,
      squad_id: user?.squad_id ?? "",
      day_period: "",
      time_to_first_shot: 0,
      note: "",
      participants: [
        {
          user_id: user?.id ?? "",
          user_duty: user?.user_role ?? "sniper",
          weapon_id: user?.user_default_weapon ?? "",
          equipment_id: user?.user_default_equipment ?? "",
          position: "",
        },
      ],
      targets: [
        {
          distance: 0,
          wind_strength: 0,
          wind_direction: 0,
          shots_fired: 0,
          total_hits: 0,
          mistake_code: "",
          target_eliminated: false,
          engagements: [],
        },
      ],
    },
  });

  const {
    fields: participantFields,
    append: appendParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control: methods.control,
    name: "participants",
  });

  const {
    fields: targetFields,
    append: appendTarget,
    remove: removeTarget,
  } = useFieldArray({
    control: methods.control,
    name: "targets",
  });

  const onSubmit = (data: z.infer<typeof groupScoreSchema>) => {
    console.log(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3" onClick={onClose}>
      <div
        className={`rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border ${
          theme === "dark" ? "bg-[#0A0A0A] border-gray-800" : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <div>
            <h1 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Training Session</h1>
            <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Record your training session details</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <X className={`w-5 h-5 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className={`px-6 py-4 border-b ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id;
              const isCompleted = isStepCompleted(section.id);
              const Icon = section.icon;

              return (
                <div key={section.id} className="flex items-center">
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? theme === "dark"
                          ? "bg-white text-[#0A0A0A] shadow-lg"
                          : "bg-gray-900 text-white shadow-lg"
                        : isCompleted
                          ? theme === "dark"
                            ? "bg-green-600 text-white"
                            : "bg-green-600 text-white"
                          : theme === "dark"
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-700 text-white"
                          : isActive
                            ? theme === "dark"
                              ? "bg-[#0A0A0A] text-white"
                              : "bg-white text-gray-900"
                            : theme === "dark"
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    </div>
                    <span className="hidden sm:block text-xs">{section.label}</span>
                  </button>
                  {index < sections.length - 1 && (
                    <div className={`hidden sm:block w-12 h-px mx-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div>
              {/* Session Information */}
              {activeSection === "session-info" && (
                <div className="space-y-4">
                  <div>
                    <h2 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Session Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Training Period */}
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Training Period
                      </label>
                      <select
                        {...methods.register("day_period")}
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300"
                            : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600"
                        }`}
                      >
                        <option value="">Select training period</option>
                        <option value="day">Day Training</option>
                        <option value="night">Night Training</option>
                      </select>
                    </div>

                    {/* Time to First Shot */}
                    <div>
                      <label className={`block text-xs  font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Time to First Shot (seconds)
                      </label>
                      <input
                        {...methods.register("time_to_first_shot", { valueAsNumber: true })}
                        type="number"
                        placeholder="15"
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                            : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Session Notes */}
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Session Notes</label>
                    <textarea
                      {...methods.register("note")}
                      rows={3}
                      placeholder="Weather conditions, equipment performance, key observations..."
                      className={`w-full px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Participants */}
              {activeSection === "participants" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Participants</h2>
                    <button
                      type="button"
                      onClick={() => {
                        appendParticipant({ user_id: "", user_duty: "sniper", weapon_id: "", equipment_id: "", position: "" });
                        setOpenParticipant(participantFields.length);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400"
                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Participant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {participantFields.map((participant, index) => {
                      const isCurrentUser = index === 0;
                      const currentUserName = user ? `${user.first_name} ${user.last_name}` : "Current User";
                      const isOpen = openParticipant === index;

                      return (
                        <div
                          key={participant.id}
                          className={`rounded-lg border overflow-hidden ${
                            theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {/* Accordion Header */}
                          <button
                            type="button"
                            onClick={() => setOpenParticipant(isOpen ? -1 : index)}
                            className={`w-full p-4 flex items-center justify-between transition-colors ${
                              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                                }`}
                              >
                                <Users className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                              </div>
                              <div className="text-left">
                                <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  {isCurrentUser ? `${currentUserName} (Primary)` : `Participant ${index + 1}`}
                                </h3>
                                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                  {isCurrentUser ? "Session leader" : "Team member"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {!isCurrentUser && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeParticipant(index);
                                    if (openParticipant === index) setOpenParticipant(-1);
                                    if (openParticipant > index) setOpenParticipant(openParticipant - 1);
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                              />
                            </div>
                          </button>

                          {/* Accordion Content */}
                          {isOpen && (
                            <div className={`px-4 pb-4 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                {/* User Selection */}
                                <div className="md:col-span-2">
                                  <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    Team Member
                                  </label>
                                  {isCurrentUser ? (
                                    <div
                                      className={`w-full px-3 py-2 rounded-lg text-sm border ${
                                        theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
                                      }`}
                                    >
                                      {currentUserName}
                                    </div>
                                  ) : (
                                    <select
                                      {...methods.register(`participants.${index}.user_id`)}
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600"
                                      }`}
                                    >
                                      <option value="">Select team member...</option>
                                      {members
                                        .filter((member) => member.id !== user?.id)
                                        .map((member) => (
                                          <option key={member.id} value={member.id}>
                                            {member.first_name} {member.last_name}
                                          </option>
                                        ))}
                                    </select>
                                  )}
                                </div>

                                {/* Role */}
                                <div>
                                  <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    Role
                                  </label>
                                  <input
                                    {...methods.register(`participants.${index}.user_duty`)}
                                    type="text"
                                    placeholder="Sniper, Spotter..."
                                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                      theme === "dark"
                                        ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                        : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                    }`}
                                  />
                                </div>

                                {/* Position */}
                                <div>
                                  <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    Position
                                  </label>
                                  <input
                                    {...methods.register(`participants.${index}.position`)}
                                    type="text"
                                    placeholder="Prone, Standing..."
                                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                      theme === "dark"
                                        ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                        : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                    }`}
                                  />
                                </div>

                                {/* Weapon */}
                                <div>
                                  <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    Weapon
                                  </label>
                                  <select
                                    {...methods.register(`participants.${index}.weapon_id`)}
                                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                      theme === "dark"
                                        ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300"
                                        : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600"
                                    }`}
                                  >
                                    <option value="">Select weapon...</option>
                                    {weapons?.map((weapon) => (
                                      <option key={weapon.id} value={weapon.id}>
                                        {weapon.weapon_type} - #{weapon.serial_number}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Equipment */}
                                <div>
                                  <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    Equipment
                                  </label>
                                  <select
                                    {...methods.register(`participants.${index}.equipment_id`)}
                                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                      theme === "dark"
                                        ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300"
                                        : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600"
                                    }`}
                                  >
                                    <option value="">Select equipment...</option>
                                    {equipments?.map((equipment) => (
                                      <option key={equipment.id} value={equipment.id}>
                                        {equipment.equipment_type} - #{equipment.serial_number} ({equipment.day_night})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Target Statistics */}
              {activeSection === "targets" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Target Statistics</h2>
                    <button
                      type="button"
                      onClick={() => {
                        appendTarget({
                          distance: 0,
                          wind_strength: 0,
                          wind_direction: 0,
                          shots_fired: 0,
                          total_hits: 0,
                          mistake_code: "",
                          target_eliminated: false,
                          engagements: [],
                        });
                        setOpenTarget(targetFields.length);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400"
                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Target
                    </button>
                  </div>

                  <div className="space-y-3">
                    {targetFields.map((target, index) => {
                      const isOpen = openTarget === index;

                      return (
                        <div
                          key={target.id}
                          className={`rounded-lg border overflow-hidden ${
                            theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {/* Accordion Header */}
                          <button
                            type="button"
                            onClick={() => setOpenTarget(isOpen ? -1 : index)}
                            className={`w-full p-4 flex items-center justify-between transition-colors ${
                              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-red-900" : "bg-red-100"}`}
                              >
                                <Target className={`w-4 h-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                              </div>
                              <div className="text-left">
                                <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Target {index + 1}</h3>
                                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Engagement statistics</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {targetFields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTarget(index);
                                    if (openTarget === index) setOpenTarget(-1);
                                    if (openTarget > index) setOpenTarget(openTarget - 1);
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                              />
                            </div>
                          </button>

                          {/* Accordion Content */}
                          {isOpen && (
                            <div className={`px-4 pb-4 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                              <div className="space-y-3 mt-3">
                                {/* Distance and Environmental */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                      Distance Range
                                    </label>
                                    <select
                                      {...methods.register(`targets.${index}.distance`, { valueAsNumber: true })}
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600"
                                      }`}
                                    >
                                      <option value="">Select range</option>
                                      <option value="50">0-50m (Close)</option>
                                      <option value="100">50-100m</option>
                                      <option value="200">100-200m</option>
                                      <option value="300">200-300m</option>
                                      <option value="500">300-500m (Mid)</option>
                                      <option value="800">500-800m</option>
                                      <option value="1000">800-1000m (Long)</option>
                                      <option value="1500">1000m+ (Extreme)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                      Wind Strength (mph)
                                    </label>
                                    <input
                                      {...methods.register(`targets.${index}.wind_strength`, { valueAsNumber: true })}
                                      type="number"
                                      step="0.1"
                                      placeholder="5.5"
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>

                                  <div>
                                    <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                      Wind Direction (°)
                                    </label>
                                    <input
                                      {...methods.register(`targets.${index}.wind_direction`, { valueAsNumber: true })}
                                      type="number"
                                      min="0"
                                      max="360"
                                      placeholder="180"
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Shot Performance */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                      Shots Fired
                                    </label>
                                    <input
                                      {...methods.register(`targets.${index}.shots_fired`, { valueAsNumber: true })}
                                      type="number"
                                      placeholder="0"
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                      Total Hits
                                    </label>
                                    <input
                                      {...methods.register(`targets.${index}.total_hits`, { valueAsNumber: true })}
                                      type="number"
                                      placeholder="0"
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                                  <div>
                                    <label className={`block text-xs font-medium mb-1.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                      Mistake Code
                                    </label>
                                    <input
                                      {...methods.register(`targets.${index}.mistake_code`)}
                                      type="text"
                                      placeholder="Error code (optional)"
                                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        theme === "dark"
                                          ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] border border-gray-300 placeholder-gray-500"
                                          : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white border border-gray-600 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>

                                  <div className="flex items-center">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                      <input
                                        {...methods.register(`targets.${index}.target_eliminated`)}
                                        type="checkbox"
                                        className={`w-3.5 h-3.5 rounded focus:ring-2 ${
                                          theme === "dark"
                                            ? "text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                            : "text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                        }`}
                                      />
                                      <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        Target Eliminated
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className={`flex items-center justify-between mt-8 pt-4 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = getCurrentStepIndex();
                    if (currentIndex > 0) {
                      setActiveSection(sections[currentIndex - 1].id);
                    }
                  }}
                  disabled={getCurrentStepIndex() === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    getCurrentStepIndex() === 0
                      ? theme === "dark"
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Previous
                </button>

                {getCurrentStepIndex() < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = getCurrentStepIndex();
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400"
                        : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600"
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => methods.handleSubmit(onSubmit)()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Complete Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
