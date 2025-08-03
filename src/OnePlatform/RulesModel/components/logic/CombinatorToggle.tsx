import { Controller, Control } from "react-hook-form";
import { RuleFormValues } from "../TemplatesModal";

interface Props {
  control: Control<RuleFormValues>;
}

export default function CombinatorToggle({ control }: Props) {
  return (
    <Controller
      control={control}
      name="combinator"
      render={({ field: { value, onChange } }) => (
        <div className="inline-flex rounded-full bg-gray-200 dark:bg-gray-700 p-0.5 mt-2">
          {[
            { label: "All (AND)", val: "and" },
            { label: "Any (OR)", val: "or" },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => onChange(opt.val as "and" | "or")}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                value === opt.val ? "bg-white dark:bg-gray-900 text-blue-600" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    />
  );
}
