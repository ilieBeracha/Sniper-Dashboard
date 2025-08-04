import { Controller, Control, useFieldArray } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { RuleFormValues } from "../TemplatesModal";

const OPERATORS = ["==", "!=", ">", ">=", "<", "<=", "contains", "!contains"] as const;

interface Props {
  control: Control<RuleFormValues>;
}

export default function SimpleConditionFields({ control }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "conditions" });

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => append({ field: "", operator: "==", value: "" })}
        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        + Add condition
      </button>

      {fields.map((field, idx) => (
        <div key={field.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/40 p-2 rounded-lg">
          {/* Field */}
          <Controller
            control={control}
            name={`conditions.${idx}.field` as const}
            render={({ field }) => (
              <input {...field} placeholder="field" className="w-28 px-2 py-1 text-xs bg-transparent border-b border-gray-400 focus:outline-none" />
            )}
          />
          {/* Operator */}
          <Controller
            control={control}
            name={`conditions.${idx}.operator` as const}
            render={({ field }) => (
              <select {...field} className="text-xs bg-transparent border-b border-gray-400 focus:outline-none">
                {OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            )}
          />
          {/* Value */}
          <Controller
            control={control}
            name={`conditions.${idx}.value` as const}
            render={({ field }) => (
              <input {...field} placeholder="value" className="w-32 px-2 py-1 text-xs bg-transparent border-b border-gray-400 focus:outline-none" />
            )}
          />

          <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-700 text-xs">
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}
