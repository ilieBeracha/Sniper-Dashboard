import { Weapon } from "@/types/weapon";
import { supabase } from "./supabaseClient";

export async function getWeapons(teamId: string) {
  const { data, error } = await supabase.from("weapons").select("*").eq("team_id", teamId).order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching weapons:", error);
    return [];
  }
  console.log(data);
  return data;
}

export async function createWeapon(weapon: Weapon) {
  const { data, error } = await supabase.from("weapons").insert(weapon).select().single();
  if (error) {
    console.error("Error creating weapon:", error);
    return null;
  }
  return data;
}

export async function updateWeapon(id: string, weapon: Partial<Weapon>) {
  const { data, error } = await supabase.from("weapons").update(weapon).eq("id", id).select().single();
  if (error) {
    console.error("Error updating weapon:", error);
    return null;
  }
  return data;
}
