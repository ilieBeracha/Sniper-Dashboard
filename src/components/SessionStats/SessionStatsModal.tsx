import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSessionStatsLogic } from "./useSessionStatsLogic";
import { ArrowLeft, ArrowRight, Check, Users, Target, Crosshair, FileText, Send } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";
import SessionSetupStep from "./SessionSetupStep";
import ParticipantsStep from "./ParticipantsStep";
import TargetsStep from "./TargetsStep";
import EngagementsStep from "./EngagementsStep";
import ReviewStep from "./ReviewStep";
import SubmitStep from "./SubmitStep";

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
        return sessionData.squad_id && sessionData.team_id && sessionData.timeToFirstShot && sessionData.assignment_id;
      case 2:
        return (
          participants.length > 0 &&
          participants.every((p) => {
            if (p.userDuty === "Sniper") {
              return p.name && p.weaponId;
            } else {
              return p.name && p.equipmentId;
            }
          })
        );
      case 3:
        // Validate targets
        return targets.length > 0 && targets.every((t) => t.distance > 0);
      case 4:
        return true; // Engagements are optional
      case 5:
        // Don't call validateForm here as it causes re-renders
        return true; // Will validate on submit
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 6 && canProceed()) {
      // Validate when moving to review step
      if (currentStep === 4) {
        validateForm();
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
    if (validateForm()) {
      handleSave(onClose);
    }
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
        return <TargetsStep targets={targets} addTarget={addTarget} removeTarget={removeTarget} updateTarget={updateTarget} />;
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
