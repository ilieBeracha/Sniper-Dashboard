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
  onSuccess?: (sessionId: string) => void;
  sessionId?: string;
  trainingId?: string;
}

export default function SessionStatsModal({ isOpen, onClose, onSuccess }: SessionStatsModalProps) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidationError, setShowValidationError] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

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
    addMultipleParticipants,
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

  const validateStep = () => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1:
        if (!sessionData.assignment_id) errors.push("Please select an assignment");
        if (!sessionData.timeToFirstShot) errors.push("Time to first shot is required");
        if (!sessionData.squad_id || !sessionData.team_id) errors.push("Squad and team information is missing");
        break;
      case 2:
        if (participants.length === 0) {
          errors.push("At least one participant is required");
        } else {
          participants.forEach((p, index) => {
            if (!p.name) errors.push(`Participant ${index + 1}: Name is required`);
            if (p.userDuty === "Sniper" && !p.weaponId) {
              errors.push(`${p.name || `Participant ${index + 1}`}: Weapon is required for snipers`);
            } else if (p.userDuty === "Spotter" && !p.equipmentId) {
              errors.push(`${p.name || `Participant ${index + 1}`}: Equipment is required for spotters`);
            }
          });
        }
        break;
      case 3:
        if (targets.length === 0) {
          errors.push("At least one target is required");
        } else {
          targets.forEach((t, index) => {
            if (!t.distance || t.distance <= 0) {
              errors.push(`Target ${index + 1}: Distance must be greater than 0`);
            }
          });
        }
        break;
    }

    setStepErrors(errors);
    return errors.length === 0;
  };

  const canProceed = () => {
    const isValid = validateStep();
    setShowValidationError(!isValid);
    return isValid;
  };

  const handleNext = () => {
    if (currentStep < 6) {
      if (canProceed()) {
        setShowValidationError(false);
        setStepErrors([]);
        // Validate when moving to review step
        if (currentStep === 4) {
          validateForm();
        }
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleSave((sessionId?: string) => {
        if (sessionId && onSuccess) {
          onSuccess(sessionId);
        }
        onClose();
      });
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
            addMultipleParticipants={addMultipleParticipants}
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-white dark:bg-neutral-800 rounded-xl shadow-xl flex flex-col overflow-hidden ${theme === "dark" ? "dark:bg-neutral-800" : "bg-white"}`}
      >
        {/* Header with Steps Progress */}
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <div className="py-2 sm:py-3 px-3 sm:px-4 flex justify-between items-center">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-neutral-200">Session Statistics</h3>
            <button
              type="button"
              onClick={onClose}
              className="size-7 sm:size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
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
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4">
              <div className="flex items-center justify-between min-w-max sm:min-w-0">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col sm:flex-row items-center">
                        <div
                          className={`
                          relative shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200
                          ${
                            isActive
                              ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50"
                              : isCompleted
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500"
                          }
                        `}
                        >
                          {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </div>
                        <span
                          className={`
                          hidden sm:block sm:ml-2 text-xs lg:text-sm font-medium
                          ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-neutral-400"}
                        `}
                        >
                          {step.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`
                            flex-1 h-0.5 mx-1 sm:mx-2 lg:mx-3
                            ${currentStep > step.id ? "bg-green-600" : "bg-gray-200 dark:bg-neutral-700"}
                          `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div className="p-4 sm:p-6">
            {/* Validation Errors */}
            {showValidationError && stepErrors.length > 0 && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Please fix the following errors:</h4>
                <ul className="space-y-1">
                  {stepErrors.map((error, index) => (
                    <li key={index} className="text-xs sm:text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {getStepContent()}
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-3 px-3 sm:px-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex gap-2 order-2 sm:order-1">
            {currentStep > 1 && (
              <BaseButton onClick={handlePrevious} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" style="white">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Previous
              </BaseButton>
            )}
          </div>

          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <BaseButton onClick={onClose} style="white" className="flex-1 sm:flex-none text-xs sm:text-sm">
              Cancel
            </BaseButton>

            {currentStep < 6 ? (
              <BaseButton onClick={handleNext} className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                Next
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </BaseButton>
            ) : (
              <BaseButton
                onClick={handleSubmit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                style="purple"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                Submit
              </BaseButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
