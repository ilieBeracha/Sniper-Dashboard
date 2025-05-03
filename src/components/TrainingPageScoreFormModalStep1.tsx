import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Assignment } from "@/types/training";
import ScoreFormField from "./ScoreFormField";

interface Step1Props {
  formValues: ScoreFormValues;
  setFormValues: (values: ScoreFormValues) => void;
  assignmentSessions: Assignment[];
}

export default function TrainingPageScoreFormModalStep1({ formValues, setFormValues, assignmentSessions }: Step1Props) {
  const optionalFields = {
    target_eliminated: "boolean",
    first_shot_hit: "boolean",
    wind_strength: "number",
    wind_direction: "number",
    time_until_first_shot: "number",
    note: "text",
  };

  return (
    <form className="w-full rounded-xl p-2 shadow-lg">
      <ScoreFormField
        field="assignment_session_id"
        type="select"
        formValues={formValues}
        setFormValues={setFormValues}
        assignmentSessions={assignmentSessions}
      />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-center">
        <ScoreFormField
          field="day_night"
          type="select"
          formValues={formValues}
          setFormValues={setFormValues}
          assignmentSessions={assignmentSessions}
        />
        <ScoreFormField
          field="position"
          type="select"
          formValues={formValues}
          setFormValues={setFormValues}
          assignmentSessions={assignmentSessions}
        />
        <ScoreFormField
          field="distance"
          type="number"
          formValues={formValues}
          setFormValues={setFormValues}
          assignmentSessions={assignmentSessions}
        />
        <ScoreFormField
          field="target_hit"
          type="number"
          formValues={formValues}
          setFormValues={setFormValues}
          assignmentSessions={assignmentSessions}
        />
        <ScoreFormField
          field="shots_fired"
          type="number"
          formValues={formValues}
          setFormValues={setFormValues}
          assignmentSessions={assignmentSessions}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg text-gray-200  font-semibold mb-6">Other Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(optionalFields).map(([field, type]) => (
            <ScoreFormField
              key={field}
              field={field}
              type={type}
              formValues={formValues}
              setFormValues={setFormValues}
              assignmentSessions={assignmentSessions}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
