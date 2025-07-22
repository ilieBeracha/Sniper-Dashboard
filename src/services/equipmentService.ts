import { Equipment } from "@/types/equipment";
import { supabase } from "./supabaseClient";

export async function getEquipmentsByTeamId(teamId: string) {
  try {
    const { data, error } = await supabase.from("equipment").select("*").eq("team_id", teamId);
    if (error) throw error;
    return data as any;
  } catch (error: any) {
    console.error("Error fetching equipment:", error.message);
    throw new Error("Failed to fetch equipment");
  }
}

export async function createEquipment(equipment: Equipment) {
  try {
    const { data, error } = await supabase.from("equipment").insert(equipment).select().single();
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error creating equipment:", error.message);
    throw new Error("Failed to create equipment");
  }
}

export async function updateEquipment(id: string, equipment: Partial<Equipment>) {
  try {
    const { data, error } = await supabase.from("equipment").update(equipment).eq("id", id).select().single();
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error updating equipment:", error.message);
    throw new Error("Failed to update equipment");
  }
}
