import { useEffect } from "react";
import { Control, useWatch } from "react-hook-form";
import { RuleFormValues } from "../TemplatesModal";
import { buildLogicFromConditions } from "@/OnePlatform/RulesModel/utils/jsonLogicEngine";

interface Props {
  control: Control<RuleFormValues>;
  setValue: (name: keyof RuleFormValues, value: any, options?: any) => void;
}

export default function LogicPreview({ control, setValue }: Props) {
  const conditions = useWatch({ control, name: "conditions" });
  const combinator = useWatch({ control, name: "combinator" });

  useEffect(() => {
    const logic = buildLogicFromConditions(conditions || [], combinator);
    setValue("logic", logic);
  }, [conditions, combinator, setValue]);

  const json = JSON.stringify(buildLogicFromConditions(conditions || [], combinator), null, 2);

  return <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-auto max-h-40">{json}</pre>;
}
