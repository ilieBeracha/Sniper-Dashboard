import BaseModal from "./BaseModal";
import TrainingPageScoreFormModalStep1 from "./TrainingPageScoreFormModalStep1";
import TrainingPageScoreFormModalStep2 from "./TrainingPageScoreFormModalStep2";
import { useScoreForm } from "@/hooks/useScoreForm";

export default function ScoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingScore,
  assignmentSessions = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingScore?: any;
  assignmentSessions?: any[];
}) {
  const {
    formValues,
    setFormValues,
    step,
    setStep,
    errors,
    setErrors,
    searchTerm,
    setSearchTerm,
    validateForm,
    handleAssignmentErrors,
    teamMembers,
    resetForm,
  } = useScoreForm({ isOpen, editingScore, assignmentSessions });

  const handleSubmit = () => {
    const score_participants = formValues.participants.map((userId: string) => {
      const duty = formValues.duties[userId];
      return {
        user_id: userId,
        user_duty: duty,
        weapon_id: duty === "Sniper" ? formValues.weapons[userId] : null,
        equipment_id: duty === "Spotter" ? formValues.equipments[userId] : null,
      };
    });

    const payload = {
      ...formValues,
      score_participants,
    };

    onSubmit(payload);
  };

  const handleNextStep = () => {
    if (!validateForm()) {
      handleAssignmentErrors(formValues);
    } else {
      setErrors([]);
      setStep((prevStep) => (prevStep === 1 ? 2 : 1));
    }
    if (step === 2) {
      setTimeout(() => {
        resetForm();
      }, 1000);
    }
  };

  const formattedMembers = teamMembers.map((u) => ({
    id: u.id,
    label: `${u.first_name} ${u.last_name}`,
    description: u.email,
    badge: u.user_role,
  }));

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-5xl">
      <div className="w-full">
        <div className="flex  mb-4 border-b border-white/10 pb-3 w-fulSSl">
          <h2 className="text-xl font-semibold text-white">{editingScore ? "Edit Score Entry" : "New Score Entry"}</h2>
        </div>

        <div className="flex items-center gap-4 mb-2 p-2 w-full ">
          <ol className="flex  w-full max-w-2xl text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            {["Assignment", "Participants"].map((label, idx) => {
              const stepIndex = idx + 1;
              const isActive = step === stepIndex;

              return (
                <li
                  key={label}
                  className={`flex justify-center items-center relative ${
                    idx !== 1
                      ? "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-gray-200 after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border text-xs font-bold transition-all duration-300
                ${isActive ? "bg-gray-300 text-black border-gray-600 shadow-md" : "bg-zinc-700 text-zinc-300 border-zinc-500"}
              `}
                    >
                      {stepIndex}
                    </div>
                    <span className={`${isActive ? "text-white font-semibold" : "text-gray-400"}`}>{label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {step === 1 && (
          <TrainingPageScoreFormModalStep1 formValues={formValues} setFormValues={setFormValues} assignmentSessions={assignmentSessions} />
        )}

        {step === 2 && (
          <TrainingPageScoreFormModalStep2
            formValues={formValues}
            setFormValues={setFormValues}
            formattedMembers={formattedMembers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {errors.length > 0 && (
          <div className="text-center rounded-lg my-6">
            <ul className=" text-zinc-400">
              {errors.map((error, index) => (
                <li className="text-sm text-red-500" key={index}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => (step === 1 ? onClose() : setStep((step - 1) as 1 | 2))}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step === 1 ? (
            <button
              onClick={() => handleNextStep()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
              Save
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
