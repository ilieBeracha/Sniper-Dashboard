import React from "react";
import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Assignment } from "@/types/training";
import { Target, Sun, Activity, Crosshair, Zap, Wind, Navigation, Timer, StickyNote, CheckCircle2, XCircle, FileQuestion, Ruler } from "lucide-react";
import { Button } from "../common";

interface ScoreFormFieldProps {
  field: string;
  type: string;
  formValues: ScoreFormValues;
  setFormValues: (values: ScoreFormValues) => void;
  assignmentSessions?: Assignment[];
}

const fieldConfig = {
  assignment_session_id: {
    icon: FileQuestion,
    title: "Assignment",
    placeholder: "Choose your mission",
  },
  day_night: {
    icon: Sun,
    title: "Time of Day",
    placeholder: "Day or night operation?",
  },
  position: {
    icon: Activity,
    title: "Shooting Position",
    placeholder: "Select your stance",
  },
  distance: {
    icon: Ruler,
    title: "Distance (m)",
    placeholder: "How far was the target?",
  },
  target_hit: {
    icon: Target,
    title: "Hits on Target",
    placeholder: "Number of successful hits",
  },
  shots_fired: {
    icon: Crosshair,
    title: "Shots Fired",
    placeholder: "Total shots taken",
  },
  target_eliminated: {
    icon: CheckCircle2,
    title: "Target Eliminated?",
    placeholder: "Was target neutralized?",
  },
  first_shot_hit: {
    icon: Zap,
    title: "First Shot Hit?",
    placeholder: "Did your first shot connect?",
  },
  wind_strength: {
    icon: Wind,
    title: "Wind Strength",
    placeholder: "Wind speed (m/s)",
  },
  wind_direction: {
    icon: Navigation,
    title: "Wind Direction",
    placeholder: "Degrees (0-360)",
  },
  time_until_first_shot: {
    icon: Timer,
    title: "Time to First Shot (s)",
    placeholder: "Seconds before engaging",
  },
  note: {
    icon: StickyNote,
    title: "Additional Notes",
    placeholder: "Any observations or comments?",
  },
};

const ScoreFormField: React.FC<ScoreFormFieldProps> = ({ field, type, formValues, setFormValues, assignmentSessions }) => {
  const config = fieldConfig[field as keyof typeof fieldConfig];
  const Icon = config?.icon || Target;

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          value={(formValues[field as keyof ScoreFormValues] as any) || ""}
          onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
          className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white 
                     border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 
                     focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200
                     appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.2em 1.2em",
            paddingRight: "2rem",
          }}
        >
          <option value="" className="bg-zinc-800 text-zinc-400">
            {config?.placeholder || `Select ${field.replace(/_/g, " ")}`}
          </option>

          {field === "assignment_session_id" && assignmentSessions ? (
            assignmentSessions.map((assignment: Assignment) => (
              <option key={assignment.id} value={assignment.id} className="bg-zinc-800 text-white">
                {assignment?.assignment_name}
              </option>
            ))
          ) : field === "position" ? (
            <>
              <option value="lying" className="bg-zinc-800">
                Lying
              </option>
              <option value="standing" className="bg-zinc-800">
                Standing
              </option>
              <option value="sitting" className="bg-zinc-800">
                Sitting
              </option>
              <option value="operational" className="bg-zinc-800">
                Operational
              </option>
            </>
          ) : field === "day_night" ? (
            <>
              <option value="day" className="bg-zinc-800">
                Day
              </option>
              <option value="night" className="bg-zinc-800">
                Night
              </option>
            </>
          ) : field === "mistake" ? (
            <>
              <option value="missed" className="bg-zinc-800">
                Missed
              </option>
              <option value="wrong target" className="bg-zinc-800">
                Wrong Target
              </option>
              <option value="slow reaction" className="bg-zinc-800">
                Slow Reaction
              </option>
            </>
          ) : null}
        </select>
      );
    } else if (type === "boolean") {
      const value = (formValues as any)[field];

      return (
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => setFormValues({ ...formValues, [field]: "true" })}
            variant={value === "true" ? "success" : "secondary"}
            size="sm"
            className="flex-1"
            leftIcon={<CheckCircle2 size={14} />}
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => setFormValues({ ...formValues, [field]: "false" })}
            variant={value === "false" ? "danger" : "secondary"}
            size="sm"
            className="flex-1"
            leftIcon={<XCircle size={14} />}
          >
            No
          </Button>
        </div>
      );
    } else if (type === "text" && field === "note") {
      return (
        <textarea
          value={(formValues as any)[field] || ""}
          onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
          placeholder={config?.placeholder}
          rows={2}
          className="w-full rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white 
                     border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 
                     focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200
                     resize-none"
        />
      );
    } else {
      return (
        <input
          type={type}
          value={(formValues as any)[field] || ""}
          onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
          placeholder={config?.placeholder}
          className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white 
                     border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 
                     focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
        />
      );
    }
  };

  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-1.5 text-sm text-zinc-300 font-medium mb-1.5" htmlFor={field}>
        <Icon size={14} className="text-zinc-400" />
        {config?.title ||
          field
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
      </label>
      {renderInput()}
    </div>
  );
};

export default ScoreFormField;
