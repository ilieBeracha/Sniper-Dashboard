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
    validateScoreParticipantsForm,
    searchTerm,
    setSearchTerm,
    validateScoreForm,
    teamMembers,
    resetForm,
  } = useScoreForm({ isOpen, editingScore, assignmentSessions });

  const handleSubmit = () => {
    const isParticipantsValid = validateScoreParticipantsForm();
    if (!isParticipantsValid) {
      return;
    }

    const score_participants = formValues.participants.map((userId: string) => {
      const duty = formValues.duties[userId];
      return {
        user_id: userId,
        user_duty: duty,
        weapon_id: duty === "Sniper" ? formValues.weapons[userId] : null,
        equipment_id: duty === "Spotter" ? formValues.equipment[userId] : null,
      };
    });

    const payload = {
      ...formValues,
      score_participants,
    };
    onSubmit(payload);
    resetForm();
  };

  const handleNextStep = () => {
    const isValid = validateScoreForm();
    if (!isValid) {
      console.log("errors", errors);
      // handleAssignmentErrors(formValues);
      return;
    } else {
      setErrors([]);
      setStep((prevStep) => (prevStep === 1 ? 2 : 1));
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
      <div className="w-full  from-[#181F3A] via-[#23213A] to-[#1A1A2E] rounded-2xl ">
        <div className="flex mb-4 border-indigo-700/40 pb-3 w-full">
          <h2 className="text-xl font-semibold text-indigo-200 drop-shadow-md">{editingScore ? "Edit Score Entry" : "New Score Entry"}</h2>
        </div>

        <div className="flex items-center gap-4 mb-2 p-2 w-full ">
          <ol className="flex w-full max-w-2xl text-sm font-medium text-indigo-300 sm:text-base">
            {["Assignment", "Participants"].map((label, idx) => {
              const stepIndex = idx + 1;
              const isActive = step === stepIndex;

              return (
                <li
                  key={label}
                  className={`flex justify-center items-center relative ${
                    idx !== 1
                      ? "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-indigo-700/40 after:inline-block after:mx-6 xl:after:mx-10"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 shadow-lg
                ${isActive ? " text-white border-indigo-300 shadow-indigo-500/30" : "bg-zinc-800 text-indigo-300 border-indigo-700"}
              `}
                    >
                      {stepIndex}
                    </div>
                    <span className={`${isActive ? "text-indigo-100 font-semibold" : "text-indigo-400"}`}>{label}</span>
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
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-zinc-700 via-indigo-800 to-zinc-900 rounded-md hover:from-indigo-700 hover:to-indigo-900 shadow-md border border-indigo-900/40"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step === 1 ? (
            <button
              onClick={() => handleNextStep()}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br rounded-md hover:from-indigo-500 hover:to-indigo-700 shadow-md border border-indigo-900/40"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br rounded-md hover:from-blue-500 hover:to-indigo-700 shadow-md border border-indigo-900/40"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
