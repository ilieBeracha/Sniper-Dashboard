import { Equipment } from "@/types/equipment";
import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export async function getEquipmentsByTeamId(teamId: string) {
  try {
    const { data, error } = await supabase.from("equipment").select("*").eq("team_id", teamId);
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch equipment");
    }
    return data as any;
  } catch (error: any) {
    console.error("Error fetching equipment:", error.message);
    throw new Error("Failed to fetch equipment");
  }
}

export async function createEquipment(equipment: Equipment) {
  try {
    const { data, error } = await supabase.from("equipment").insert(equipment).select().single();
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to create equipment");
    }
    return data;
  } catch (error: any) {
    console.error("Error creating equipment:", error.message);
    throw new Error("Failed to create equipment");
  }
}

export async function updateEquipment(id: string, equipment: Partial<Equipment>) {
  try {
    const { data, error } = await supabase.from("equipment").update(equipment).eq("id", id).select().single();
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to update equipment");
    }
    return data;
  } catch (error: any) {
    console.error("Error updating equipment:", error.message);
    throw new Error("Failed to update equipment");
  }
}

export async function deleteEquipment(id: string) {
  try {
    const { error } = await supabase.from("equipment").delete().eq("id", id);
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to delete equipment");
    }
    return true;
  } catch (error: any) {
    console.error("Error deleting equipment:", error.message);
    throw new Error("Failed to delete equipment");
  }
}
