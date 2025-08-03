import jsonLogic from "json-logic-js";
import { RuleDefinition } from "../service/ruleService";

/**
 * Evaluate a JSONLogic expression against arbitrary data.
 *
 * This is a thin wrapper around `json-logic-js` that guarantees a boolean result.
 */
export function evaluateLogic(logic: any, data: Record<string, any>): boolean {
  if (!logic || typeof logic !== "object") return false;
  try {
    return !!jsonLogic.apply(logic, data);
  } catch (err) {
    /* eslint-disable no-console */
    console.error("JSONLogic evaluation failed", err, { logic, data });
    return false;
  }
}

/**
 * Evaluate a stored RuleDefinition against an event payload (or any data).
 *
 * Example:
 * ```ts
 * const shouldFire = evaluateRuleDefinition(definition, {
 *   score: 88,
 *   user_role: "sniper",
 *   // ...whatever keys your logic references
 * });
 * ```
 */
export function evaluateRuleDefinition(def: RuleDefinition, payload: Record<string, any>): boolean {
  return evaluateLogic(def.logic, payload);
}

/**
 * Utility to convert a simple condition array into a JSONLogic object.
 * Each condition is an object: { field, operator, value }.
 * Supported operators: ==, !=, >, >=, <, <=, contains, !contains
 */
export type SimpleCondition = {
  field: string;
  operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "contains" | "!contains";
  value: any;
};

export function buildLogicFromConditions(conditions: SimpleCondition[], combinator: "and" | "or" = "and") {
  const ruleArray = conditions.map((c) => {
    switch (c.operator) {
      case "==":
        return { "==": [{ var: c.field }, c.value] };
      case "!=":
        return { "!=": [{ var: c.field }, c.value] };
      case ">":
        return { ">": [{ var: c.field }, c.value] };
      case ">=":
        return { ">=": [{ var: c.field }, c.value] };
      case "<":
        return { "<": [{ var: c.field }, c.value] };
      case "<=":
        return { "<=": [{ var: c.field }, c.value] };
      case "contains":
        return { in: [c.value, { var: c.field }] };
      case "!contains":
        return { "!": { in: [c.value, { var: c.field }] } };
      default:
        return {};
    }
  });

  if (ruleArray.length === 0) return {};
  if (ruleArray.length === 1) return ruleArray[0];
  return { [combinator === "and" ? "and" : "or"]: ruleArray };
}
