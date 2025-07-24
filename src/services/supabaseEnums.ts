// src/services/supabaseEnums.ts
import { supabase } from "./supabaseClient";

export async function getEnumValues(enumName: string): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_enum_values_v1", {
    enum_name: enumName,
  });

  if (error) {
    console.error(`Failed to load enum ${enumName}:`, error.message);
    return [];
  }

  return data ?? [];
}
