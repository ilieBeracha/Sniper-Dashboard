import { supabase } from "./supabaseClient";

export async function getWeapons(teamId: string) {
    const { data, error } = await supabase.from('weapons').select('*').eq('team_id', teamId);
    if (error) {
        console.error('Error fetching weapons:', error);
        return [];
    }
    return data;
}