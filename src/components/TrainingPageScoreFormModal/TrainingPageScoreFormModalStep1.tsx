import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Assignment } from "@/types/training";
import ScoreFormField from "@/components/TrainingPageScoreFormModal/ScoreFormField";
import { Target, Info, Crosshair, Wind, StickyNote } from "lucide-react";
import { useState } from "react";

interface Step1Props {
  formValues: ScoreFormValues;
  setFormValues: (values: ScoreFormValues) => void;
  assignmentSessions: Assignment[];
}

export default function TrainingPageScoreFormModalStep1({ formValues, setFormValues, assignmentSessions }: Step1Props) {
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const requiredFields = [
    { field: "day_night", type: "select" },
    { field: "position", type: "select" },
    { field: "distance", type: "number" },
    { field: "shots_fired", type: "number" },
    { field: "target_hit", type: "number" },
  ];

  const renderRequiredFields = () => (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-3">
        <Crosshair className="text-green-400" size={16} />
        <h4 className="text-sm font-semibold text-white">Combat Details</h4>
        <div className="flex-1 h-px bg-zinc-700/50 ml-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requiredFields.map(({ field, type }) => (
          <ScoreFormField
            key={field}
            field={field}
            type={type}
            formValues={formValues}
            setFormValues={setFormValues}
            assignmentSessions={assignmentSessions}
          />
        ))}
        <ScoreFormField field="time_until_first_shot" type="number" formValues={formValues} setFormValues={setFormValues} />
      </div>

      <ScoreFormField field="target_eliminated" type="boolean" formValues={formValues} setFormValues={setFormValues} />
    </div>
  );

  const renderOptionalFields = () => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Info className="text-blue-400" size={16} />
        <h4 className="text-base font-semibold text-white">Additional Information</h4>
        <div className="flex-1 h-px bg-zinc-700/50 ml-3"></div>
      </div>

      <div className="bg-zinc-800/20 p-4 rounded-lg border border-zinc-700/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Group Yes/No questions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Target size={12} />
              Target Assessment
            </h4>
            <ScoreFormField field="first_shot_hit" type="boolean" formValues={formValues} setFormValues={setFormValues} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Wind size={12} />
              Environmental Factors
            </h4>
            <ScoreFormField field="wind_strength" type="number" formValues={formValues} setFormValues={setFormValues} />
            <ScoreFormField field="wind_direction" type="number" formValues={formValues} setFormValues={setFormValues} />
          </div>

          {/* Notes - Full width on its own row */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2 mb-3">
              <StickyNote size={12} />
              Mission Notes
            </h4>
            <ScoreFormField field="note" type="text" formValues={formValues} setFormValues={setFormValues} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <form className="w-full ">
        <div className="mb-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-indigo-400" size={16} />
            <h2 className="text-base font-semibold text-white">Mission Selection</h2>
          </div>
          <div className="space-y-4">
            <ScoreFormField
              field="assignment_session_id"
              type="select"
              formValues={formValues}
              setFormValues={setFormValues}
              assignmentSessions={assignmentSessions}
            />
          </div>
        </div>

        {renderRequiredFields()}

        <button type="button" onClick={() => setShowOptionalFields(!showOptionalFields)} className="mb-4 text-blue-400 hover:text-blue-300">
          {showOptionalFields ? "Hide Additional Information" : "Show Additional Information"}
        </button>

        {showOptionalFields && renderOptionalFields()}
      </form>
    </div>
  );
}
