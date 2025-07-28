import { useForm, FormProvider, Controller } from "react-hook-form";
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
import BaseSelect from "../base/BaseSelect";
import BaseInput from "../base/BaseInput";
import { Loader2 } from "lucide-react";

const groupScoreSchema = z.object({
  sniper_user_id: z.string().uuid(),
  weapon_id: z.string().uuid({ message: "Weapon is required" }),
  bullets_fired: z.number().min(1, "Bullets fired must be at least 1"),
  time_seconds: z
  .preprocess((val) => (val === "" ? null : val), z.number().min(0).nullable())
  .optional(),
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
  type: z.enum(["normal", "timed", "complex","position_abandonment"]),
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
    control,
    formState: { errors, isDirty },
  } = methods;

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
        <Controller
          name="weapon_id"
          control={control}
          render={({ field }) => (
            <BaseSelect
              {...field}
              ref={firstInputRef}
              label="Weapon"
              isRequired
              error={errors.weapon_id?.message}
              options={weapons.map((weapon: any) => ({
                value: weapon.id,
                label: `${weapon.weapon_type} — ${weapon.serial_number}`,
              }))}
              placeholder="Select weapon"
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="shooting_position"
          control={control}
          render={({ field }) => (
            <BaseSelect
              {...field}
              label="Shooting Position"
              isRequired
              error={errors.shooting_position?.message}
              options={[
                { value: "Lying", label: "Lying" },
                { value: "Standing", label: "Standing" },
                { value: "Sitting", label: "Sitting" },
                { value: "Operational", label: "Operational" },
              ]}
              placeholder="Select position"
              disabled={isSubmitting}
            />
          )}
        />
        {/* Day/Night Period */}
        <div>
          <DayPeriodSelect dayPeriod={watch("day_period")} onDayPeriodChange={(dayPeriod) => setValue("day_period", dayPeriod as DayNight)} />
        </div>
        {/* Bullets Fired */}
        <div>
          <BaseInput
            type="number"
            min="1"
            label="Bullets Fired"
            isRequired
            {...register("bullets_fired", { valueAsNumber: true })}
            error={errors.bullets_fired?.message}
            disabled={isSubmitting}
          />
          {bulletsFired < 4 && <p className="text-amber-600 text-xs mt-1 animate-fadeIn">⚠️ Advanced fields require 4+ bullets</p>}
        </div>

        {/* Time (Seconds) */}
        <BaseInput
          type="number"
          min="0"
          label="Time (Seconds)"
          disabled={isRestrictedMode || isSubmitting}
          {...register("time_seconds", {
            valueAsNumber: true,
            setValueAs: (v) => (v === "" ? null : Number(v)),
          })}
          error={errors.time_seconds?.message}
          placeholder={isRestrictedMode ? "Requires 4+ bullets" : "Enter time in seconds"}
        />

        {/* Dispersion */}
        <BaseInput
          type="number"
          step="0.1"
          min="0"
          label="Dispersion (cm)"
          disabled={isRestrictedMode || isSubmitting}
          {...register("cm_dispersion", {
            valueAsNumber: true,
            setValueAs: (v) => (v === "" ? null : Number(v)),
          })}
          error={errors.cm_dispersion && !isRestrictedMode ? errors.cm_dispersion.message : undefined}
          placeholder={isRestrictedMode ? "Requires 4+ bullets" : "e.g., 0.1, 0.2, 0.3"}
        />

        {/* Type Selection */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <BaseSelect
              {...field}
              label="Type"
              options={[
                { value: "normal", label: "Normal" },
                { value: "timed", label: "Timed" },
                { value: "position_abandonment", label: "Position Abandonment" },
                { value: "complex", label: "Complex"}
              ]}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Effort Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          disabled={isSubmitting}
          {...register("effort")}
          id="effort"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
        <label htmlFor="effort" className="text-sm select-none cursor-pointer">
          Effort Given
        </label>
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
