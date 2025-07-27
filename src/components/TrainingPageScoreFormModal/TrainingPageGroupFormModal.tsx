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
import { useEffect, useRef, useState } from "react";
import DayPeriodSelect from "../DayPeriodSelect";
import { DayNight } from "@/types/equipment";
import { BaseLabelRequired } from "../base/BaseLabelRequired";
import { Loader2 } from "lucide-react";

const groupScoreSchema = z.object({
  sniper_user_id: z.string().uuid(),
  weapon_id: z.string().uuid({ message: "Weapon is required" }),
  bullets_fired: z.number().min(1, "Bullets fired must be at least 1"),
  time_seconds: z.number().min(0).optional().or(z.literal(null)),
  cm_dispersion: z
    .number()
    .min(0)
    .optional()
    .or(z.literal(null))
    .refine((val) => val == null || Number.isInteger(val * 10), {
      message: "Dispersion must be in 0.1 steps (e.g., 0.1, 0.2, 0.3)",
    }),
  shooting_position: z.string().min(1, "Shooting position is required"),
  effort: z.boolean(),
  day_period: z.enum(["day", "night"]),
  type: z.enum(["normal", "timed", "position_abandonment"]),
});

type GroupScoreFormValues = z.infer<typeof groupScoreSchema>;

interface TrainingPageGroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupScoreFormValues) => Promise<void>;
  isLoading: boolean;
  initialData?: any;
}

export default function TrainingPageGroupFormModal({ isOpen, onClose, onSubmit, isLoading, initialData }: TrainingPageGroupFormModalProps) {
  const { user } = useStore(userStore);
  const { weapons } = useStore(weaponsStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile(640);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLSelectElement>(null);

  const methods = useForm<GroupScoreFormValues>({
    resolver: zodResolver(groupScoreSchema),
    defaultValues: {
      sniper_user_id: user?.id ?? "",
      weapon_id: user?.user_default_weapon ?? "",
      bullets_fired: 4,
      time_seconds: null,
      cm_dispersion: null,
      shooting_position: "",
      effort: false,
      day_period: "day",
      type: "normal",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = methods;

  const { ref: weaponRef, ...weaponRegister } = register("weapon_id");

  const bulletsFired = watch("bullets_fired");
  const isRestrictedMode = bulletsFired < 4;

  // Focus first input when modal opens and populate form if editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Populate form with initial data for editing
        reset({
          sniper_user_id: initialData.sniper_user_id || user?.id || "",
          weapon_id: initialData.weapon_id || "",
          bullets_fired: initialData.bullets_fired || 4,
          time_seconds: initialData.time_seconds || null,
          cm_dispersion: initialData.cm_dispersion || null,
          shooting_position: initialData.shooting_position || "",
          effort: initialData.effort || false,
          day_period: initialData.day_period || "day",
          type: initialData.type || "normal",
        });
      } else {
        // Reset to default values for new entry
        reset({
          sniper_user_id: user?.id ?? "",
          weapon_id: user?.user_default_weapon ?? "",
          bullets_fired: 4,
          time_seconds: null,
          cm_dispersion: null,
          shooting_position: "",
          effort: false,
          day_period: "day",
          type: "normal",
        });
      }

      if (firstInputRef.current) {
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    }
  }, [isOpen, initialData, reset, user]);

  // Clear restricted fields when bullets fired < 4
  useEffect(() => {
    if (isRestrictedMode) {
      setValue("time_seconds", null);
      setValue("cm_dispersion", null);
      setValue("shooting_position", "");
      setValue("effort", false);
      setValue("day_period", "day");
      setValue("type", "normal");
    }
  }, [isRestrictedMode, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data: GroupScoreFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset(); // Reset form on success
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const inputClasses = (isError?: boolean, isDisabled?: boolean) =>
    `w-full rounded-lg px-3 py-2 min-h-10 text-sm border transition-all duration-200 ${
      theme === "dark"
        ? `bg-zinc-800/50 text-white border-zinc-700 ${
            isError ? "border-red-500 focus:border-red-500" : "hover:border-zinc-600 focus:border-blue-500"
          }`
        : `bg-white text-gray-900 border-gray-300 ${isError ? "border-red-500 focus:border-red-500" : "hover:border-gray-400 focus:border-blue-500"}`
    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500/20`;

  const buttonClasses = (variant: "primary" | "secondary") => {
    if (variant === "primary") {
      return `px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-md transition-all duration-200 ${
        isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-indigo-800 active:scale-95"
      }`;
    }
    return `px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
      theme === "dark"
        ? "text-white bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800"
        : "text-gray-800 bg-gray-200 hover:bg-gray-300 active:bg-gray-100"
    }`;
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${isMobile ? "min-w-[300px]" : "min-w-[600px]"}`}>
      <input type="hidden" {...register("sniper_user_id")} />

      <div className="grid grid-cols-1 gap-4">
        {/* Weapon Selection */}
        <div>
          <BaseLabelRequired>Weapon</BaseLabelRequired>
          <select
            ref={(e) => {
              weaponRef(e);
              firstInputRef.current = e;
            }}
            {...weaponRegister}
            className={inputClasses(!!errors.weapon_id)}
            disabled={isSubmitting}
          >
            <option value="">Select weapon</option>
            {weapons.map((weapon: any) => (
              <option key={weapon.id} value={weapon.id}>
                {weapon.weapon_type} — {weapon.serial_number}
              </option>
            ))}
          </select>
          {errors.weapon_id && <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.weapon_id.message}</p>}
        </div>

        {/* Bullets Fired */}
        <div>
          <BaseLabelRequired>Bullets Fired</BaseLabelRequired>
          <input
            type="number"
            min="1"
            {...register("bullets_fired", { valueAsNumber: true })}
            className={inputClasses(!!errors.bullets_fired)}
            disabled={isSubmitting}
          />
          {errors.bullets_fired && <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.bullets_fired.message}</p>}
          {bulletsFired < 4 && <p className="text-amber-600 text-xs mt-1 animate-fadeIn">⚠️ Advanced fields require 4+ bullets</p>}
        </div>

        {/* Time (Seconds) */}
        <div>
          <label className="block text-sm mb-1">Time (Seconds)</label>
          <input
            type="number"
            min="0"
            disabled={isRestrictedMode || isSubmitting}
            {...register("time_seconds", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
            className={inputClasses(!!errors.time_seconds, isRestrictedMode)}
            placeholder={isRestrictedMode ? "Requires 4+ bullets" : "Enter time in seconds"}
          />
        </div>

        {/* Dispersion */}
        <div>
          <label className="block text-sm mb-1">Dispersion (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            disabled={isRestrictedMode || isSubmitting}
            {...register("cm_dispersion", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
            className={inputClasses(!!errors.cm_dispersion, isRestrictedMode)}
            placeholder={isRestrictedMode ? "Requires 4+ bullets" : "e.g., 0.1, 0.2, 0.3"}
          />
          {errors.cm_dispersion && !isRestrictedMode && <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.cm_dispersion.message}</p>}
        </div>

        {/* Shooting Position */}
        <div>
          <BaseLabelRequired>Shooting Position</BaseLabelRequired>
          <select
            disabled={isRestrictedMode || isSubmitting}
            {...register("shooting_position")}
            className={inputClasses(!!errors.shooting_position, isRestrictedMode)}
          >
            <option value="">Select position</option>
            <option value="Lying">Lying</option>
            <option value="Standing">Standing</option>
            <option value="Sitting">Sitting</option>
            <option value="Operational">Operational</option>
          </select>
          {errors.shooting_position && !isRestrictedMode && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.shooting_position.message}</p>
          )}
        </div>

        {/* Effort Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={isRestrictedMode || isSubmitting}
            {...register("effort")}
            id="effort"
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 ${
              isRestrictedMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          />
          <label htmlFor="effort" className={`text-sm select-none ${isRestrictedMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
            Effort Given
          </label>
        </div>

        {/* Day/Night Period */}
        <div className={isRestrictedMode ? "opacity-50 pointer-events-none" : ""}>
          <DayPeriodSelect dayPeriod={watch("day_period")} onDayPeriodChange={(dayPeriod) => setValue("day_period", dayPeriod as DayNight)} />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select disabled={isRestrictedMode || isSubmitting} {...register("type")} className={inputClasses(false, isRestrictedMode)}>
            <option value="normal">Normal</option>
            <option value="timed">Timed</option>
            <option value="position_abandonment">Position Abandonment</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-6 border-t border-gray-200 dark:border-zinc-700">
        <button type="button" onClick={handleClose} disabled={isSubmitting} className={buttonClasses("secondary")}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting || isLoading || !isDirty} className={buttonClasses("primary")}>
          {isSubmitting || isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : initialData ? (
            "Update"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );

  const content = <div className={`transition-opacity duration-200 ${isSubmitting || isLoading ? "opacity-75" : ""}`}>{renderForm()}</div>;

  return (
    <FormProvider {...methods}>
      {isMobile ? (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={handleClose} title={initialData ? "Edit Group Score" : "Add Group Score"}>
          {content}
        </BaseMobileDrawer>
      ) : (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={handleClose} title={initialData ? "Edit Group Score" : "Add Group Score"}>
          {content}
        </BaseDesktopDrawer>
      )}
    </FormProvider>
  );
}
