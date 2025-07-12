import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSessionStatsLogic } from "./useSessionStatsLogic";
import { ArrowLeft, ArrowRight, Check, Users, Target, Crosshair, FileText, Send } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";

interface SessionStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
  trainingId?: string;
}

export default function SessionStatsModal({ isOpen, onClose }: SessionStatsModalProps) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: "Session Setup", icon: FileText },
    { id: 2, name: "Participants", icon: Users },
    { id: 3, name: "Targets", icon: Target },
    { id: 4, name: "Engagements", icon: Crosshair },
    { id: 5, name: "Review", icon: Check },
    { id: 6, name: "Submit", icon: Send },
  ];

  const {
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

    addParticipant,
    removeParticipant,
    updateParticipant,

    addTarget,
    removeTarget,
    updateTarget,
    updateEngagement,
    calculateEstimatedHits,

    handleSave,
    validateForm,
  } = useSessionStatsLogic(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      // Reset to first step when opening
      setCurrentStep(1);
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return sessionData.squadId && sessionData.teamId && sessionData.timeToFirstShot && sessionData.assignmentId;
      case 2:
        return participants.length > 0 && participants.every((p) => {
          if (p.userDuty === "sniper") {
            return p.name && p.weaponId;
          } else {
            return p.name && p.equipmentId;
          }
        });
      case 3:
        return targets.length > 0;
      case 4:
        return true; // Engagements are optional
      case 5:
        validateForm();
        return validationErrors.length === 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 6 && canProceed()) {
      if (currentStep === 4) {
        validateForm(); // Validate before moving to review
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    handleSave(onClose);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SessionSetupStep sessionData={sessionData} setSessionData={setSessionData} assignments={assignments} />;
      case 2:
        return (
          <ParticipantsStep
            participants={participants}
            members={members}
            user={user}
            addParticipant={addParticipant}
            removeParticipant={removeParticipant}
            updateParticipant={updateParticipant}
            uniqueWeapons={uniqueWeapons}
            uniqueEquipments={uniqueEquipments}
          />
        );
      case 3:
        return (
          <TargetsStep
            targets={targets}
            addTarget={addTarget}
            removeTarget={removeTarget}
            updateTarget={updateTarget}
            calculateEstimatedHits={calculateEstimatedHits}
          />
        );
      case 4:
        return <EngagementsStep targets={targets} participants={participants} updateEngagement={updateEngagement} />;
      case 5:
        return <ReviewStep sessionData={sessionData} participants={participants} targets={targets} validationErrors={validationErrors} />;
      case 6:
        return <SubmitStep />;
      default:
        return null;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-neutral-800 rounded-xl shadow-xl flex flex-col overflow-hidden ${theme === "dark" ? "dark:bg-neutral-800" : "bg-white"}`}
      >
        {/* Header with Steps Progress */}
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <div className="py-3 px-4 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Session Statistics Wizard</h3>
            <button
              type="button"
              onClick={onClose}
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Step Indicators */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500"
                        }
                      `}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-neutral-400"}`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-full h-0.5 mx-2 ${currentStep > step.id ? "bg-green-600" : "bg-gray-200 dark:bg-neutral-700"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div className="p-6">{getStepContent()}</div>
        </div>

        {/* Footer with Navigation */}
        <div className="flex justify-between items-center py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <BaseButton onClick={handlePrevious} className="flex items-center gap-2" style="white">
                <ArrowLeft className="w-4 h-4" />
                Previous
              </BaseButton>
            )}
          </div>

          <div className="flex gap-2">
            <BaseButton onClick={onClose} style="white">
              Cancel
            </BaseButton>

            {currentStep < 6 ? (
              <BaseButton onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </BaseButton>
            ) : (
              <BaseButton onClick={handleSubmit} className="flex items-center gap-2" style="purple">
                <Send className="w-4 h-4" />
                Submit Session
              </BaseButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

// Step 1: Session Setup
function SessionSetupStep({ sessionData, setSessionData, assignments }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">📋 Session Information</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">Set up the basic information about your training session. All fields are required.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assignment Select */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Assignment <span className="text-red-500">*</span>
            <span className="block text-xs text-gray-500 dark:text-neutral-400 mt-1">The training exercise being performed</span>
          </label>
          <select
            value={sessionData.assignmentId || ""}
            onChange={(e) => setSessionData({ ...sessionData, assignmentId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment: any) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_name}
              </option>
            ))}
          </select>
        </div>

        {/* Day Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Day Period <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSessionData({ ...sessionData, dayPeriod: "day" })}
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                sessionData.dayPeriod === "day"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-300 bg-white hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500"
              }`}
            >
              <svg
                className={`w-8 h-8 mb-2 ${sessionData.dayPeriod === "day" ? "text-yellow-500" : "text-gray-400 dark:text-neutral-500"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <span
                className={`text-sm font-medium ${
                  sessionData.dayPeriod === "day" ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-neutral-300"
                }`}
              >
                Day
              </span>
              {sessionData.dayPeriod === "day" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSessionData({ ...sessionData, dayPeriod: "night" })}
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                sessionData.dayPeriod === "night"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-300 bg-white hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500"
              }`}
            >
              <svg
                className={`w-8 h-8 mb-2 ${
                  sessionData.dayPeriod === "night" ? "text-blue-400 dark:text-blue-300" : "text-gray-400 dark:text-neutral-500"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  sessionData.dayPeriod === "night" ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-neutral-300"
                }`}
              >
                Night
              </span>
              {sessionData.dayPeriod === "night" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Time to First Shot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Time to First Shot (seconds) <span className="text-red-500">*</span>
            <span className="block text-xs text-gray-500 dark:text-neutral-400 mt-1">Time from target appearance to first shot</span>
          </label>
          <input
            type="number"
            value={sessionData.timeToFirstShot || ""}
            onChange={(e) => setSessionData({ ...sessionData, timeToFirstShot: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
            placeholder="Enter time in seconds"
          />
        </div>

        {/* Note */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Session Note <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={sessionData.note || ""}
            onChange={(e) => setSessionData({ ...sessionData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
            rows={3}
            placeholder="Add any session notes..."
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Participants
function ParticipantsStep({
  participants,
  members,
  user,
  addParticipant,
  removeParticipant,
  updateParticipant,
  uniqueWeapons,
  uniqueEquipments,
}: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">👥 Participants</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Add squad members who participated in this session. You are automatically added as the first participant.
        </p>
      </div>

      <div className="flex justify-end">
        <select
          onChange={(e) => {
            if (e.target.value) {
              addParticipant(e.target.value);
              e.target.value = "";
            }
          }}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
        >
          <option value="">Add Member</option>
          {members
            ?.filter((member: any) => !participants.find((p: any) => p.userId === member.id))
            .map((member: any) => (
              <option key={member.id} value={member.id}>
                {member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-4">
        {participants.map((participant: any, index: number) => {
          const isSniper = participant.userDuty === "sniper";
          const gridCols = isSniper ? "md:grid-cols-5" : "md:grid-cols-4";
          
          return (
            <div key={participant.userId} className={`grid grid-cols-1 ${gridCols} gap-4 p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-lg relative`}>
              {participant.userId !== user?.id && (
                <button
                  onClick={() => removeParticipant(index, participant.userId)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  aria-label="Remove participant"
                >
                  Remove
                </button>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-neutral-700 rounded-md text-gray-700 dark:text-neutral-300">{participant.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Duty <span className="text-red-500">*</span>
                </label>
                <select
                  value={participant.userDuty}
                  onChange={(e) => {
                    const newDuty = e.target.value;
                    // Update duty and clear relevant fields in one update
                    if (newDuty === "spotter") {
                      updateParticipant(index, {
                        userDuty: newDuty,
                        weaponId: "",
                        shotsFired: 0
                      });
                    } else {
                      updateParticipant(index, {
                        userDuty: newDuty,
                        equipmentId: ""
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                >
                  <option value="sniper">Sniper</option>
                  <option value="spotter">Spotter</option>
                </select>
              </div>
              
              {/* Conditional fields based on duty */}
              {isSniper ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Weapon <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={participant.weaponId}
                      onChange={(e) => updateParticipant(index, "weaponId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                    >
                      <option value="">Select Weapon</option>
                      {uniqueWeapons.map((weapon: string) => (
                        <option key={weapon} value={weapon}>
                          {weapon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Total Shots Fired <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={participant.shotsFired || 0}
                      onChange={(e) => updateParticipant(index, "shotsFired", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                      placeholder="Total shots"
                      min="0"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Equipment <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={participant.equipmentId}
                    onChange={(e) => updateParticipant(index, "equipmentId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  >
                    <option value="">Select Equipment</option>
                    {uniqueEquipments.map((equipment: string) => (
                      <option key={equipment} value={equipment}>
                        {equipment}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={participant.position}
                  onChange={(e) => updateParticipant(index, "position", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                >
                  <option value="lying">Lying</option>
                  <option value="standing">Standing</option>
                  <option value="kneeling">Kneeling</option>
                  <option value="sitting">Sitting</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Step 3: Targets
function TargetsStep({ targets, addTarget, removeTarget, updateTarget, calculateEstimatedHits }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Target Information</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">Add targets engaged during this session. Distance and total hits are required.</p>
      </div>

      <div className="flex justify-end">
        <BaseButton onClick={addTarget} className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Add Target
        </BaseButton>
      </div>

      <div className="space-y-6">
        {targets.map((target: any, targetIndex: number) => (
          <div key={target.id} className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h5 className="font-medium text-gray-800 dark:text-neutral-200">Target {targetIndex + 1}</h5>
              <button onClick={() => removeTarget(targetIndex)} className="text-red-500 hover:text-red-700 text-sm" aria-label="Remove target">
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Distance (m) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={target.distance}
                  onChange={(e) => updateTarget(targetIndex, "distance", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Distance in meters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Total Hits <span className="text-red-500">*</span>
                  <span className="block text-xs text-gray-500 dark:text-neutral-400 mt-1">Total successful hits on this target</span>
                </label>
                <input
                  type="number"
                  value={target.totalHits || ""}
                  onChange={(e) => updateTarget(targetIndex, "totalHits", e.target.value ? parseInt(e.target.value) : undefined)}
                  onBlur={() => calculateEstimatedHits(targetIndex)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Total hits on target"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Wind Strength <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={target.windStrength || ""}
                  onChange={(e) => updateTarget(targetIndex, "windStrength", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Wind Direction (°) <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={target.windDirection || ""}
                  onChange={(e) => updateTarget(targetIndex, "windDirection", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="0-360"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Mistake Code <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={target.mistakeCode || ""}
                  onChange={(e) => updateTarget(targetIndex, "mistakeCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Optional mistake code"
                />
              </div>
            </div>

            {target.totalHits !== undefined && target.totalHits >= 2 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                <Check className="w-4 h-4" />
                Target Eliminated
              </div>
            )}
          </div>
        ))}

        {targets.length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-neutral-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600">
            <Target className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-500 mb-3" />
            <p className="text-gray-500 dark:text-neutral-400 font-medium">No targets added yet</p>
            <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">Click "Add Target" to start tracking target engagements</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: Engagements
function EngagementsStep({ targets, participants, updateEngagement }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Personal Score Tracking (Optional)</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Track individual sniper performance for each target. This step is optional.
          <br />
          <strong>Note:</strong> Only snipers can record hits. The system will validate that total personal hits don't exceed the target's total hits.
        </p>
      </div>

      <div className="space-y-6">
        {targets.map((target: any, targetIndex: number) => (
          <div key={target.id} className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-4">
              Target {targetIndex + 1} - {target.distance}m
            </h5>

            <div className="space-y-2">
              {target.engagements.map((engagement: any, engIndex: number) => {
                const participant = participants.find((p: any) => p.userId === engagement.userId);
                if (!participant) return null;

                // Only show snipers in engagements
                if (participant.userDuty !== "sniper") return null;
                
                return (
                  <div key={engagement.userId} className="grid grid-cols-3 gap-3 items-center p-3 bg-gray-50 dark:bg-neutral-700/30 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{participant.name}</span>
                      <span className="text-xs text-gray-500 dark:text-neutral-400">(Sniper)</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={engagement.targetHits || ""}
                        onChange={(e) => updateEngagement(targetIndex, engIndex, "targetHits", e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                        placeholder="Personal hits"
                        min="0"
                        max={target.totalHits || undefined}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">
                      {participant.shotsFired > 0 && engagement.targetHits !== undefined
                        ? `${((engagement.targetHits / participant.shotsFired) * 100).toFixed(0)}% accuracy`
                        : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Show validation info */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="text-gray-600 dark:text-neutral-400">
                Target Total Hits: <span className="font-medium">{target.totalHits || 0}</span>
              </div>
              <div className="text-gray-600 dark:text-neutral-400">
                Total Personal Hits: <span className="font-medium">
                  {target.engagements
                    .filter((e: any) => {
                      const p = participants.find((p: any) => p.userId === e.userId);
                      return p?.userDuty === "sniper" && e.targetHits !== undefined;
                    })
                    .reduce((sum: number, e: any) => sum + (e.targetHits || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 5: Review
function ReviewStep({ sessionData, participants, targets, validationErrors }: any) {
  return (
    <div className="space-y-6">
      <div
        className={`border rounded-lg p-4 ${
          validationErrors.length > 0
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        }`}
      >
        <h4
          className={`text-base font-semibold mb-2 ${
            validationErrors.length > 0 ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"
          }`}
        >
          {validationErrors.length > 0 ? "⚠️ Review Required" : "✅ Ready to Submit"}
        </h4>
        {validationErrors.length > 0 ? (
          <>
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">Please fix the following errors:</p>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
              {validationErrors.map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-green-700 dark:text-green-300">
            All information is complete. Review your session details below before submitting.
          </p>
        )}
      </div>

      {/* Session Summary */}
      <div className="space-y-4">
        <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">Session Information</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-neutral-400">Assignment:</span>
              <span className="ml-2 text-gray-700 dark:text-neutral-300">{sessionData.assignmentId ? "Selected" : "Not selected"}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-neutral-400">Day Period:</span>
              <span className="ml-2 text-gray-700 dark:text-neutral-300 capitalize">{sessionData.dayPeriod || "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-neutral-400">Time to First Shot:</span>
              <span className="ml-2 text-gray-700 dark:text-neutral-300">
                {sessionData.timeToFirstShot ? `${sessionData.timeToFirstShot}s` : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">Participants ({participants.length})</h5>
          <div className="space-y-2">
            {participants.map((p: any) => (
              <div key={p.userId} className="flex items-center gap-4 text-sm">
                <span className="text-gray-700 dark:text-neutral-300">{p.name}</span>
                <span className="text-gray-500 dark:text-neutral-400">• {p.userDuty}</span>
                <span className="text-gray-500 dark:text-neutral-400">• {p.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">Targets ({targets.length})</h5>
          <div className="space-y-2">
            {targets.map((t: any, index: number) => (
              <div key={t.id} className="flex items-center gap-4 text-sm">
                <span className="text-gray-700 dark:text-neutral-300">Target {index + 1}</span>
                <span className="text-gray-500 dark:text-neutral-400">• {t.distance}m</span>
                <span className="text-gray-500 dark:text-neutral-400">• {t.totalHits || 0} hits</span>
                {t.totalHits >= 2 && <span className="text-green-600 dark:text-green-400">• Eliminated</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 6: Submit
function SubmitStep() {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-2">Ready to Submit</h3>
      <p className="text-gray-600 dark:text-neutral-400">
        Your session statistics are ready to be saved. Click the Submit button below to complete the process.
      </p>
    </div>
  );
}
