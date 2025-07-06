import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

export default function TrainingPageScoreFormModalExtra({
  showOptionalFields,
  setShowOptionalFields,
}: {
  showOptionalFields: boolean;
  setShowOptionalFields: (value: boolean) => void;
}) {
  const { register, setValue, watch } = useFormContext();
  const { theme } = useTheme();
  const formValues = watch();

  return (
    <div className="space-y-4 flex flex-col">
      <button
        type="button"
        onClick={() => setShowOptionalFields(!showOptionalFields)}
        className={`transition-colors duration-200 ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
      >
        {showOptionalFields ? "Hide Additional Information" : "Show Additional Information"}
      </button>

      {showOptionalFields && (
        <>
          <div className="flex items-center gap-2">
            <Info className={`transition-colors duration-200 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} size={16} />
            <h4 className={`text-base font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Additional Information
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className={`text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Target Assessment
              </h4>

              <input
                type="number"
                {...register("time_until_first_shot")}
                placeholder="Time until first shot (seconds)"
                className={`w-full min-h-10 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-zinc-800/50 text-white border-zinc-700 placeholder-gray-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue("first_shot_hit", "true")}
                  className={`flex-1 p-2 rounded-lg border transition-colors duration-200 ${
                    formValues.first_shot_hit === "true"
                      ? theme === "dark"
                        ? "bg-green-400/30 border-green-600"
                        : "bg-green-400/30 border-green-600"
                      : theme === "dark"
                        ? "border-green-700 hover:border-green-600"
                        : "border-green-300 hover:border-green-400"
                  }`}
                >
                  First Shot Hit
                </button>
                <button
                  type="button"
                  onClick={() => setValue("first_shot_hit", "false")}
                  className={`flex-1 p-2 rounded-lg border transition-colors duration-200 ${
                    formValues.first_shot_hit === "false"
                      ? theme === "dark"
                        ? "bg-red-400/30 border-red-600"
                        : "bg-red-400/30 border-red-600"
                      : theme === "dark"
                        ? "border-red-700 hover:border-red-600"
                        : "border-red-300 hover:border-red-400"
                  }`}
                >
                  First Shot Missed
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className={`text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Environmental Factors
              </h4>
              <input
                type="number"
                {...register("wind_strength", { valueAsNumber: true })}
                placeholder="Wind strength (m/s)"
                className={`w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-zinc-800/50 text-white border-zinc-700 placeholder-gray-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
              />
              <input
                type="number"
                {...register("wind_direction", { valueAsNumber: true })}
                placeholder="Wind direction (degrees)"
                className={`w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-zinc-800/50 text-white border-zinc-700 placeholder-gray-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <h4 className={`text-sm font-medium mb-2 transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Mission Notes
              </h4>
              <textarea
                {...register("note")}
                placeholder="Add any observations or comments..."
                rows={3}
                className={`w-full rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-zinc-800/50 text-white border-zinc-700 placeholder-gray-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
