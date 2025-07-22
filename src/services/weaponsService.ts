import { Weapon } from "@/types/weapon";
import { supabase } from "./supabaseClient";

export async function getWeapons(teamId: string) {
  try {
    const { data, error } = await supabase.from("weapons").select("*").eq("team_id", teamId).order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching weapons:", error);
    return [];
  }
}

export async function createWeapon(weapon: Weapon) {
  try {
    const { data, error } = await supabase.from("weapons").insert(weapon).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating weapon:", error);
    return null;
  }
}

export async function updateWeapon(id: string, weapon: Partial<Weapon>) {
  try {
    const { data, error } = await supabase.from("weapons").update(weapon).eq("id", id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating weapon:", error);
    return null;
  }
}
