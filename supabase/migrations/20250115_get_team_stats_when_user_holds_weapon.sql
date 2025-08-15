-- =====================================================
-- GET TEAM STATS WHEN USER HOLDS WEAPON FUNCTION
-- =====================================================
-- This function calculates squad performance metrics when specific users hold specific weapons
-- =====================================================

-- Drop function if exists (for re-running)
DROP FUNCTION IF EXISTS get_team_stats_when_user_holds_weapon;

-- Create the function
CREATE OR REPLACE FUNCTION get_team_stats_when_user_holds_weapon(
    p_team_id UUID,
    p_start DATE DEFAULT NULL,
    p_end DATE DEFAULT NULL
)
RETURNS TABLE (
    user_id UUID,
    first_name TEXT,
    last_name TEXT,
    squad_name TEXT,
    total_shots BIGINT,
    total_hits BIGINT,
    hit_rate NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        -- Get all engagements for users in the team
        SELECT 
            sp.user_id,
            u.first_name,
            u.last_name,
            s.squad_name,
            COUNT(DISTINCT te.id) as total_engagements,
            COALESCE(SUM(te.shots_fired), 0) as total_shots,
            COALESCE(SUM(te.target_hits), 0) as total_hits
        FROM session_participants sp
        JOIN session_stats ss ON sp.session_stats_id = ss.id
        JOIN users u ON sp.user_id = u.id
        LEFT JOIN squads s ON u.squad_id = s.id
        LEFT JOIN target_stats ts ON ts.session_stats_id = ss.id
        LEFT JOIN target_engagements te ON te.target_stats_id = ts.id AND te.user_id = sp.user_id
        WHERE ss.team_id = p_team_id
            AND sp.user_duty = 'Sniper'
            AND (p_start IS NULL OR ss.created_at::DATE >= p_start)
            AND (p_end IS NULL OR ss.created_at::DATE <= p_end)
        GROUP BY sp.user_id, u.first_name, u.last_name, s.squad_name
    )
    SELECT 
        us.user_id,
        us.first_name,
        us.last_name,
        COALESCE(us.squad_name, 'No Squad') as squad_name,
        us.total_shots,
        us.total_hits,
        CASE 
            WHEN us.total_shots > 0 
            THEN ROUND((us.total_hits::NUMERIC / us.total_shots) * 100, 2)
            ELSE 0
        END as hit_rate
    FROM user_stats us
    WHERE us.total_shots > 0  -- Only include users who actually shot
    ORDER BY us.hit_rate DESC, us.total_shots DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_team_stats_when_user_holds_weapon TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_team_stats_when_user_holds_weapon IS 
'Returns squad performance statistics showing shots, hits, and hit rates for each user in the team.
Filters by date range if provided. Only includes users who actually fired shots.';

-- =====================================================
-- TEST THE FUNCTION
-- =====================================================
-- After creating the function, test it with this query:
-- Replace the UUID with an actual team_id from your database

/*
SELECT * FROM get_team_stats_when_user_holds_weapon(
    'YOUR_TEAM_ID_HERE'::UUID,  -- Replace with actual team_id
    NULL,                        -- or start date like '2024-01-01'
    NULL                         -- or end date like '2024-12-31'
) LIMIT 10;
*/