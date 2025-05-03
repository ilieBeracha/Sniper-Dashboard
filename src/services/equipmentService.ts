import { supabase } from "./supabaseClient";

export async function getEquipmentsByTeamId(teamId: string) {
    const { data, error } = await supabase.from('equipment').select('*').eq('team_id', teamId);
    if (error) {
        console.error('Error fetching equipment:', error);
        return [];
    }
    return data as  any;
}
    