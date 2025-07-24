import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/contexts/ThemeContext";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { weaponsStore } from "@/store/weaponsStore";
import BaseDesktopDrawer from "../BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "../BaseDrawer/BaseMobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const groupScoreSchema = z.object({
  sniper_user_id: z.string().uuid(),
  weapon_id: z.string().uuid({ message: "Weapon is required" }),
  bullets_fired: z.number().min(0),
  time_seconds: z.number().min(0).optional().or(z.literal(null)),
  cm_dispersion: z
    .number()
    .min(0)
    .optional()
    .or(z.literal(null))
    .refine((val) => val == null || Number.isInteger(val * 10), {
      message: "Dispersion must be in 0.1 steps (e.g., 0.1, 0.2, 0.3)",
    }),
  shooting_position: z.string(),
  effort: z.boolean(),
  type: z.enum(["normal", "timed", "position_abandonment"]),
});

type GroupScoreFormValues = z.infer<typeof groupScoreSchema>;

export default function TrainingPageGroupFormModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupScoreFormValues) => void;
}) {
  const { user } = useStore(userStore);
  const { weapons } = useStore(weaponsStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile(640);

  const methods = useForm<GroupScoreFormValues>({
    resolver: zodResolver(groupScoreSchema),
    defaultValues: {
      sniper_user_id: user?.id ?? "",
      weapon_id: "",
      bullets_fired: 4,
      time_seconds: null,
      cm_dispersion: null,
      shooting_position: "",
      effort: false,
      type: "normal",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const bulletsFired = watch("bullets_fired");
  const isDisabled = bulletsFired < 4;

  useEffect(() => {
    if (isDisabled) {
      setValue("time_seconds", null);
      setValue("cm_dispersion", null);
      setValue("shooting_position", "");
      setValue("effort", false);
      setValue("type", "normal");
    }
  }, [isDisabled, setValue]);

  const message = <p className="text-sm italic mt-1 text-gray-500">This field is available only when 4 or more bullets are fired</p>;

  // Create a wrapper for the form submission
  const handleFormSubmit = (data: GroupScoreFormValues) => {
    onSubmit(data);
  };

  // Debounce the submit handler to prevent rapid form submissions
  const [debouncedSubmit] = useDebounce(handleFormSubmit, 500, [onSubmit]);

  const renderForm = () => (
    <form onSubmit={handleSubmit(debouncedSubmit)} className={`space-y-6 ${isMobile ? "min-w-[300px]" : "min-w-[600px]"}`}>
      <input type="hidden" {...register("sniper_user_id")} />

      <div className="grid grid-cols-1 gap-4">
        {/* Weapon */}
        <div>
          <label className="block text-sm mb-1">Weapon</label>
          <select
            {...register("weapon_id")}
            className={`w-full min-h-10 rounded-lg px-3 py-2 text-sm border ${
              theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
            }`}
          >
            <option value="">Select weapon</option>
            {weapons.map((weapon: any) => (
              <option key={weapon.id} value={weapon.id}>
                {weapon.weapon_type} — {weapon.serial_number}
              </option>
            ))}
          </select>
          {errors.weapon_id && <p className="text-red-500 text-sm mt-1">{errors.weapon_id.message}</p>}
        </div>

        {/* Bullets Fired */}
        <div>
          <label className="block text-sm mb-1">Bullets Fired</label>
          <input
            type="number"
            {...register("bullets_fired", { valueAsNumber: true })}
            className={`w-full rounded-lg px-3 py-2 text-sm border ${
              theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
            }`}
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm mb-1">Time (Seconds)</label>
          <input
            type="number"
            disabled={isDisabled}
            {...register("time_seconds", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
            className={`w-full rounded-lg px-3 py-2 text-sm border ${
              theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {isDisabled && message}
        </div>

        {/* Dispersion */}
        <div>
          <label className="block text-sm mb-1">Dispersion (cm)</label>
          <input
            type="number"
            step="0.1"
            disabled={isDisabled}
            {...register("cm_dispersion", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
            className={`w-full rounded-lg px-3 py-2 text-sm border ${
              theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {isDisabled && message}
          {errors.cm_dispersion && <p className="text-red-500 text-sm mt-1">{errors.cm_dispersion.message}</p>}
        </div>

        {/* Shooting Position */}
        <div>
          <label className="block text-sm mb-1">Shooting Position</label>
          <select
            disabled={isDisabled}
            {...register("shooting_position")}
            className={`w-full min-h-10 rounded-lg px-3 py-2 text-sm border ${
              theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="">Select Position</option>
            <option value="Lying">Lying</option>
            <option value="Standing">Standing</option>
            <option value="Sitting">Sitting</option>
            <option value="Operational">Operational</option>
          </select>
          {isDisabled && message}
        </div>

        {/* Effort */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={isDisabled}
            {...register("effort")}
            id="effort"
            className={`h-4 w-4 border-gray-300 rounded ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          <label htmlFor="effort" className="text-sm">
            Effort Given
          </label>
        </div>
        {isDisabled && message}

        {/* Type */}
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select
            disabled={isDisabled}
            {...register("type")}
            className={`w-full min-h-10 rounded-lg px-3 py-2 text-sm border ${
              theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="normal">Normal</option>
            <option value="timed">Timed</option>
            <option value="position_abandonment">Position Abandonment</option>
          </select>
          {isDisabled && message}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-6">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            theme === "dark" ? "text-white bg-zinc-700 hover:bg-zinc-600" : "text-gray-800 bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-md">
          Save
        </button>
      </div>
    </form>
  );

  return (
    <FormProvider {...methods}>
      {isMobile ? (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={onClose} title="Add Group Score">
          {renderForm()}
        </BaseMobileDrawer>
      ) : (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={onClose} title="Add Group Score">
          {renderForm()}
        </BaseDesktopDrawer>
      )}
    </FormProvider>
  );
}
