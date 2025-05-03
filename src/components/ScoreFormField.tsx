import React from "react";
import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Assignment } from "@/types/training";

interface ScoreFormFieldProps {
  field: string;
  type: string;
  formValues: ScoreFormValues;
  setFormValues: (values: ScoreFormValues) => void;
  assignmentSessions?: Assignment[];
}

const ScoreFormField: React.FC<ScoreFormFieldProps> = ({ field, type, formValues, setFormValues, assignmentSessions }) => (
  <div className="flex flex-col mt-4 ">
    <label className="block text-sm text-gray-300 font-medium mb-1" htmlFor={field}>
      {field
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </label>
    {type === "select" ? (
      <select
        value={(formValues[field as keyof ScoreFormValues] as any) || ""}
        onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
        className="w-full min-h-10 rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:ring-indigo-500 text-md"
      >
        <option value="">Select {field.replace(/_/g, " ")}</option>

        {field === "assignment_session_id" && assignmentSessions ? (
          assignmentSessions.map((assignment: Assignment) => (
            <option key={assignment.assignment.id} value={assignment.id}>
              {assignment.assignment.assignment_name}
            </option>
          ))
        ) : field === "position" ? (
          <>
            <option value="lying">Lying</option>
            <option value="standing">Standing</option>
            <option value="sitting">Sitting</option>
            <option value="operational">Operational</option>
          </>
        ) : field === "day_night" ? (
          <>
            <option value="day">Day</option>
            <option value="night">Night</option>
          </>
        ) : field === "mistake" ? (
          <>
            <option value="missed">Missed</option>
            <option value="wrong target">Wrong Target</option>
            <option value="slow reaction">Slow Reaction</option>
          </>
        ) : (
          <option value="">No options</option>
        )}
      </select>
    ) : type === "boolean" ? (
      <select
        value={(formValues as any)[field] || ""}
        onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
        className="w-full min-h-10 rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select {field.replace(/_/g, " ")}</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    ) : (
      <input
        type={type}
        value={(formValues as any)[field] || ""}
        onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
        className="w-full min-h-10 rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
      />
    )}
  </div>
);

export default ScoreFormField;
