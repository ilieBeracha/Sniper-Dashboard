import { Equipment } from "@/types/equipment";
import { supabase } from "./supabaseClient";

export async function getEquipmentsByTeamId(teamId: string) {
  const { data, error } = await supabase.from("equipment").select("*").eq("team_id", teamId);
  if (error) {
    console.error("Error fetching equipment:", error);
    return [];
  }
  return data as any;
}

export async function createEquipment(equipment: Equipment) {
  const { data, error } = await supabase.from("equipment").insert(equipment).select().single();
  if (error) {
    console.error("Error creating equipment:", error);
    return null;
  }
  return data;
}

export async function updateEquipment(id: string, equipment: Partial<Equipment>) {
  const { data, error } = await supabase.from("equipment").update(equipment).eq("id", id).select().single();
  if (error) {
    console.error("Error updating equipment:", error);
    return null;
  }
  return data;
}
