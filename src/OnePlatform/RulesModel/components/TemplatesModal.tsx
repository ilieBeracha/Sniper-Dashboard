import { useEffect, useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useRuleStore } from "../store/ruleStore";
import FlowBuilder from "./FlowBuilder";
import { createRuleDefinition as createRuleDefinitionSvc } from "../service/ruleService";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { RuleDefinition } from "../service/ruleService";

interface RuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRuleId?: string;
}

import type { SimpleCondition } from "@/OnePlatform/RulesModel/utils/jsonLogicEngine";
import SimpleConditionFields from "./logic/SimpleConditionFields";
import CombinatorToggle from "./logic/CombinatorToggle";
import LogicPreview from "./logic/LogicPreview";

export interface RuleFormValues {
  name: string;
  event_type_id: string;
  combinator: "and" | "or";
  conditions: SimpleCondition[];
  logic: any;
}

export default function TemplatesModal({ isOpen, onClose, editRuleId }: RuleFormModalProps) {
  const { user } = useStore(userStore);
  const [currentRuleId, setCurrentRuleId] = useState(editRuleId || "");
  const { eventTypes, definitions, updateRuleDefinition, loadDefinitions } = useRuleStore();
  const { control, handleSubmit, reset, watch, setValue } = useForm<RuleFormValues>({
    defaultValues: { name: "", event_type_id: "", combinator: "and", conditions: [], logic: {} },
  });

  const logic = watch("logic");

  useEffect(() => {
    if (currentRuleId) {
      const def = definitions.find((d) => d.id === currentRuleId);
      if (def) {
        reset({
          name: def.name,
          event_type_id: def.event_type_id,
          combinator: "and",
          conditions: [],
          logic: def.logic,
        });
      }
    } else {
      reset({ name: "", event_type_id: "", combinator: "and", conditions: [], logic: {} });
    }
  }, [currentRuleId, definitions, reset, loadDefinitions]);

  const onSubmit = async (vals: RuleFormValues) => {
    const payload = {
      name: vals.name,
      event_type_id: vals.event_type_id,
      logic: vals.logic,
      team_id: user?.team_id || "",
      is_active: true,
    };
    if (currentRuleId) {
      await updateRuleDefinition({ ...payload, id: currentRuleId, created_at: new Date().toISOString() });
      await loadDefinitions(user?.team_id!);
      onClose();
    } else {
      const { data: newDef, error: createErr } = await createRuleDefinitionSvc({
        ...payload,
        id: "",
        created_at: new Date().toISOString(),
      } as RuleDefinition);
      if (createErr) {
        console.error("Error creating rule", createErr);
        return;
      }

      await loadDefinitions(user?.team_id!);
      if (newDef && newDef.id) {
        setCurrentRuleId(newDef.id);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" backdrop="transparent" hideCloseButton>
      <ModalContent className="h-[80vh] w-[80vw] bg-zinc-900 rounded-xl overflow-hidden">
        <div className="flex h-full">
          <div className="w-1/3 bg-white dark:bg-gray-800 p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{editRuleId ? "Edit Rule" : "New Rule"}</h3>

            <form className="space-y-4 flex-1 overflow-auto" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rule Name</label>
                    <input
                      {...field}
                      className="mt-1 block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900"
                      placeholder="e.g. Notify on missed assignment"
                    />
                  </div>
                )}
              />

              <Controller
                name="event_type_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trigger Event</label>
                    <select {...field} className="mt-1 block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900">
                      <option value="">Select an event…</option>
                      {eventTypes.map((et) => (
                        <option key={et.id} value={et.id}>
                          {et.key}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />

              {currentRuleId ? (
                <>
                  <SimpleConditionFields control={control} />
                  <CombinatorToggle control={control} />
                  <LogicPreview control={control} setValue={setValue} />
                </>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Create the rule first, then define conditions.</p>
              )}

              <div className="mt-auto flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {editRuleId ? "Save Changes" : "Create Rule"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex-1 bg-gray-50 dark:bg-black/30 p-4">
            <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Define Conditions & Actions</h4>
            <FlowBuilder selectedRuleId={currentRuleId} overrideLogic={logic} />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
