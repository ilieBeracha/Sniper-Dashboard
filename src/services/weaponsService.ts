import { supabase } from "./supabaseClient";

export async function getWeapons() {
    const { data, error } = await supabase.from('weapons').select('*');
    if (error) {
        console.error('Error fetching weapons:', error);
        return [];
    }
    return data;
}