-- =====================================================
-- SQUAD PERFORMANCE IMPACT FUNCTION
-- =====================================================
-- Run this SQL in your Supabase Dashboard SQL Editor
-- Go to: https://supabase.com/dashboard/project/cgchdqebebdxlmeswjsw/sql/new
-- =====================================================

-- Drop function if exists (for re-running)
DROP FUNCTION IF EXISTS get_squad_performance_impact;

-- Create the function
CREATE OR REPLACE FUNCTION get_squad_performance_impact(
    p_team_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_weapon_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    user_id UUID,
    user_name TEXT,
    weapon_id UUID,
    weapon_name TEXT,
    training_date DATE,
    user_hit_rate NUMERIC,
    squad_hit_rate_before NUMERIC,
    squad_hit_rate_after NUMERIC,
    impact_percentage NUMERIC,
    total_shots INTEGER,
    squad_members_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH training_data AS (
        -- Get training sessions with group scores for the team
        SELECT DISTINCT
            ts.id AS session_id,
            ts.date::DATE AS session_date,
            gs.sniper_user_id,
            u.first_name || ' ' || u.last_name AS user_full_name,
            gs.weapon_id,
            COALESCE(w.weapon_type || ' - ' || w.serial_number, 'Unknown Weapon') AS weapon_full_name,
            gs.shots_fired,
            gs.target_hit,
            CASE 
                WHEN gs.shots_fired > 0 
                THEN (gs.target_hit::NUMERIC / gs.shots_fired) * 100
                ELSE 0
            END AS hit_rate
        FROM training_session ts
        JOIN group_scores gs ON gs.training_id = ts.id
        JOIN users u ON gs.sniper_user_id = u.id
        LEFT JOIN weapons w ON gs.weapon_id = w.id
        WHERE ts.team_id = p_team_id
            AND (p_start_date IS NULL OR ts.date >= p_start_date)
            AND (p_end_date IS NULL OR ts.date <= p_end_date)
            AND (p_user_id IS NULL OR gs.sniper_user_id = p_user_id)
            AND (p_weapon_id IS NULL OR gs.weapon_id = p_weapon_id)
            AND gs.shots_fired > 0
    ),
    squad_performance AS (
        -- Calculate squad average before and after each training
        SELECT 
            td.session_date,
            td.sniper_user_id,
            td.user_full_name,
            td.weapon_id,
            td.weapon_full_name,
            td.shots_fired,
            td.hit_rate AS user_hit_rate,
            -- Squad hit rate before this session (average of all previous sessions)
            (
                SELECT AVG(hit_rate)
                FROM training_data td2
                WHERE td2.session_date < td.session_date
                    AND td2.sniper_user_id != td.sniper_user_id
            ) AS squad_hit_rate_before,
            -- Squad hit rate after this session (including this session)
            (
                SELECT AVG(hit_rate)
                FROM training_data td2
                WHERE td2.session_date <= td.session_date
            ) AS squad_hit_rate_after,
            -- Count of unique squad members
            (
                SELECT COUNT(DISTINCT sniper_user_id)
                FROM training_data
            ) AS squad_members
        FROM training_data td
    )
    SELECT 
        sp.sniper_user_id AS user_id,
        sp.user_full_name AS user_name,
        sp.weapon_id,
        sp.weapon_full_name AS weapon_name,
        sp.session_date AS training_date,
        ROUND(sp.user_hit_rate, 2) AS user_hit_rate,
        ROUND(COALESCE(sp.squad_hit_rate_before, sp.user_hit_rate), 2) AS squad_hit_rate_before,
        ROUND(COALESCE(sp.squad_hit_rate_after, sp.user_hit_rate), 2) AS squad_hit_rate_after,
        ROUND(
            CASE 
                WHEN sp.squad_hit_rate_before IS NOT NULL AND sp.squad_hit_rate_before > 0
                THEN ((sp.squad_hit_rate_after - sp.squad_hit_rate_before) / sp.squad_hit_rate_before) * 100
                WHEN sp.squad_hit_rate_before IS NULL OR sp.squad_hit_rate_before = 0
                THEN 0
                ELSE 0
            END, 2
        ) AS impact_percentage,
        sp.shots_fired::INTEGER AS total_shots,
        sp.squad_members::INTEGER AS squad_members_count
    FROM squad_performance sp
    ORDER BY sp.session_date DESC, sp.user_full_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_squad_performance_impact TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_squad_performance_impact IS 
'Returns squad performance impact data showing how individual training sessions affect overall squad performance.
Uses group_scores table to calculate hit rates before and after each training session to show the impact percentage.';

-- =====================================================
-- TEST THE FUNCTION
-- =====================================================
-- After creating the function, test it with this query:
-- Replace the UUID with an actual team_id from your database

/*
SELECT * FROM get_squad_performance_impact(
    'YOUR_TEAM_ID_HERE'::UUID,  -- Replace with actual team_id
    NULL,                        -- or specific user_id
    NULL,                        -- or specific weapon_id  
    NULL,                        -- or start date like '2024-01-01'
    NULL                         -- or end date like '2024-12-31'
) LIMIT 10;
*/

-- To find a valid team_id, you can run:
-- SELECT id, team_name FROM teams LIMIT 5;