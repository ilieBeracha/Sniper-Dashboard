/* =========================================================
   0) Scope helper — sessions in view (squads OR self via auth.uid())
   ========================================================= */
CREATE OR REPLACE FUNCTION public.stats_qualifying_sessions(
  p_squad_ids  uuid[]        DEFAULT NULL,
  p_start      timestamptz   DEFAULT NULL,
  p_end        timestamptz   DEFAULT NULL,
  p_day_night  text[]        DEFAULT NULL
)
RETURNS TABLE (
  session_stats_id uuid,
  training_session_id uuid,
  team_id uuid,
  squad_id uuid,
  day_period text,
  session_date date
)
LANGUAGE sql STABLE
AS $$
WITH me AS (SELECT auth.uid() AS uid),
has_squads AS (SELECT COALESCE(array_length(p_squad_ids,1),0) > 0 AS on)
SELECT
  ss.id               AS session_stats_id,
  ss.training_session_id,
  ss.team_id,
  ss.squad_id,
  ss.day_period,
  ts.date::date       AS session_date
FROM public.session_stats ss
JOIN public.training_session ts ON ts.id = ss.training_session_id
CROSS JOIN me
CROSS JOIN has_squads h
WHERE
  (p_start IS NULL OR ss.created_at >= p_start)
  AND (p_end   IS NULL OR ss.created_at <  p_end + INTERVAL '1 day')
  AND (p_day_night IS NULL OR ss.day_period = ANY(p_day_night))
  AND (
       (h.on AND ss.squad_id = ANY(p_squad_ids))                         -- squad mode
    OR (NOT h.on AND EXISTS (                                            -- self mode
         SELECT 1 FROM public.session_participants sp
         WHERE sp.session_stats_id = ss.id AND sp.user_id = (SELECT uid FROM me)
       ))
  );
$$;

GRANT EXECUTE ON FUNCTION public.stats_qualifying_sessions(uuid[],timestamptz,timestamptz,text[]) TO authenticated, anon;


/* =========================================================
   1) Overview — sessions, shots, hits, targets, hit%, median TTF, elimination%
   ========================================================= */
CREATE OR REPLACE FUNCTION public.stats_overview(
  p_squad_ids  uuid[]        DEFAULT NULL,
  p_start      timestamptz   DEFAULT NULL,
  p_end        timestamptz   DEFAULT NULL,
  p_day_night  text[]        DEFAULT NULL,
  p_positions  positions[]   DEFAULT NULL,
  p_min_shots  int           DEFAULT 0
)
RETURNS TABLE (
  sessions int,
  shots int,
  hits int,
  targets int,
  hit_pct numeric,
  median_ttf_sec numeric,
  elimination_pct numeric
)
LANGUAGE sql STABLE
AS $$
WITH me AS (SELECT auth.uid() AS uid),
qs AS (SELECT * FROM public.stats_qualifying_sessions(p_squad_ids,p_start,p_end,p_day_night)),
flag AS (SELECT COALESCE(array_length(p_squad_ids,1),0) > 0 AS has_squads),
eng AS (
  SELECT te.shots_fired,
         COALESCE(te.target_hits,0) AS target_hits,
         ss.time_to_first_shot_sec,
         ts.target_eliminated,
         te.user_id
  FROM qs
  JOIN public.session_stats ss  ON ss.id = qs.session_stats_id
  JOIN public.target_stats ts   ON ts.session_stats_id = ss.id
  JOIN public.target_engagements te ON te.target_stats_id = ts.id
  JOIN public.session_participants sp ON sp.session_stats_id = ss.id AND sp.user_id = te.user_id
  CROSS JOIN flag f
  WHERE
    (f.has_squads OR te.user_id = (SELECT uid FROM me))
    AND (p_positions IS NULL OR sp.position = ANY(p_positions))
    AND (p_min_shots IS NULL OR te.shots_fired >= p_min_shots)
),
agg AS (
  SELECT
    (SELECT COUNT(DISTINCT session_stats_id) FROM qs) AS sessions,
    COALESCE(SUM(eng.shots_fired),0) AS shots,
    COALESCE(SUM(eng.target_hits),0) AS hits,
    (SELECT COUNT(*) FROM public.target_stats t JOIN qs USING (session_stats_id)) AS targets,
    percentile_disc(0.5) WITHIN GROUP (ORDER BY eng.time_to_first_shot_sec) AS median_ttf_sec,
    SUM(CASE WHEN eng.target_eliminated THEN 1 ELSE 0 END)::numeric AS eliminated
  FROM eng
)
SELECT
  sessions, shots, hits, targets,
  CASE WHEN shots > 0 THEN hits::numeric/shots ELSE 0 END AS hit_pct,
  median_ttf_sec,
  CASE WHEN targets > 0 THEN eliminated/targets ELSE 0 END AS elimination_pct
FROM agg;
$$;

GRANT EXECUTE ON FUNCTION public.stats_overview(uuid[],timestamptz,timestamptz,text[],positions[],int) TO authenticated, anon;


/* =========================================================
   2) First-shot metrics — OVERALL / DAY / NIGHT
   ========================================================= */
CREATE OR REPLACE FUNCTION public.first_shot_metrics(
  p_squad_ids  uuid[]        DEFAULT NULL,
  p_start      timestamptz   DEFAULT NULL,
  p_end        timestamptz   DEFAULT NULL,
  p_day_night  text[]        DEFAULT NULL,
  p_positions  positions[]   DEFAULT NULL,
  p_min_shots  int           DEFAULT 0
)
RETURNS TABLE (
  scope text,
  engagements int,
  first_shot_hits int,
  first_shot_hit_pct numeric,
  sessions int,
  median_ttf_sec numeric
)
LANGUAGE sql STABLE
AS $$
WITH me AS (SELECT auth.uid() AS uid),
qs AS (SELECT * FROM public.stats_qualifying_sessions(p_squad_ids,p_start,p_end,p_day_night)),
flag AS (SELECT COALESCE(array_length(p_squad_ids,1),0) > 0 AS has_squads),
eng AS (
  SELECT qs.session_stats_id,
         qs.day_period,
         te.user_id,
         te.shots_fired,
         COALESCE(te.target_hits,0) AS target_hits,
         (COALESCE(te.target_hits,0) > 0)::int AS first_shot_hit   -- proxy (swap to real boolean if available)
  FROM qs
  JOIN public.target_stats ts ON ts.session_stats_id = qs.session_stats_id
  JOIN public.target_engagements te ON te.target_stats_id = ts.id
  JOIN public.session_participants sp ON sp.session_stats_id = qs.session_stats_id AND sp.user_id = te.user_id
  CROSS JOIN flag f
  WHERE
    (f.has_squads OR te.user_id = (SELECT uid FROM me))
    AND (p_positions IS NULL OR sp.position = ANY(p_positions))
    AND (p_min_shots IS NULL OR te.shots_fired >= p_min_shots)
),
ttf AS (
  SELECT qs.session_stats_id, ss.time_to_first_shot_sec, qs.day_period
  FROM qs JOIN public.session_stats ss ON ss.id = qs.session_stats_id
),
blk AS (SELECT 'OVERALL'::text AS scope UNION ALL SELECT 'DAY' UNION ALL SELECT 'NIGHT'),
agg AS (
  SELECT
    b.scope,
    COUNT(*) FILTER (WHERE b.scope='OVERALL' OR lower(e.day_period)=lower(b.scope))::int AS engagements,
    COALESCE(SUM(CASE WHEN b.scope='OVERALL' OR lower(e.day_period)=lower(b.scope) THEN e.first_shot_hit ELSE 0 END),0)::int AS first_shot_hits,
    COUNT(DISTINCT CASE WHEN b.scope='OVERALL' OR lower(e.day_period)=lower(b.scope) THEN e.session_stats_id END) AS sessions,
    percentile_disc(0.5) WITHIN GROUP (
      ORDER BY CASE WHEN b.scope='OVERALL' OR lower(t.day_period)=lower(b.scope) THEN t.time_to_first_shot_sec END
    ) AS median_ttf_sec
  FROM blk b
  LEFT JOIN eng e ON TRUE
  LEFT JOIN ttf t ON t.session_stats_id = e.session_stats_id
  GROUP BY b.scope
)
SELECT
  scope,
  engagements,
  first_shot_hits,
  CASE WHEN engagements>0 THEN first_shot_hits::numeric/engagements ELSE 0 END AS first_shot_hit_pct,
  sessions,
  median_ttf_sec
FROM agg
ORDER BY CASE scope WHEN 'OVERALL' THEN 0 WHEN 'DAY' THEN 1 ELSE 2 END;
$$;

GRANT EXECUTE ON FUNCTION public.first_shot_metrics(uuid[],timestamptz,timestamptz,text[],positions[],int) TO authenticated, anon;


/* =========================================================
   3) Elimination by position — all enum buckets + Total
   ========================================================= */
CREATE OR REPLACE FUNCTION public.squad_position_elimination_pct(
  p_squad_ids  uuid[]        DEFAULT NULL,
  p_start      timestamptz   DEFAULT NULL,
  p_end        timestamptz   DEFAULT NULL,
  p_day_night  text[]        DEFAULT NULL,
  p_positions  positions[]   DEFAULT NULL,
  p_min_shots  int           DEFAULT 0
)
RETURNS TABLE (
  bucket text,          -- 'Lying' | 'Sitting' | 'Standing' | 'Operational' | 'Total'
  targets int,
  eliminated int,
  elimination_pct numeric
)
LANGUAGE sql STABLE
AS $$
WITH me AS (SELECT auth.uid() AS uid),
qs AS (SELECT * FROM public.stats_qualifying_sessions(p_squad_ids,p_start,p_end,p_day_night)),
flag AS (SELECT COALESCE(array_length(p_squad_ids,1),0) > 0 AS has_squads),
eng AS (
  SELECT
    ts.id AS target_id,
    sp.position AS position,
    CASE WHEN ts.target_eliminated THEN 1 ELSE 0 END AS elim,
    te.user_id
  FROM qs
  JOIN public.target_stats ts ON ts.session_stats_id = qs.session_stats_id
  JOIN public.target_engagements te ON te.target_stats_id = ts.id
  JOIN public.session_participants sp
    ON sp.session_stats_id = qs.session_stats_id AND sp.user_id = te.user_id
  CROSS JOIN flag f
  WHERE
    (f.has_squads OR te.user_id = (SELECT uid FROM me))
    AND (p_positions IS NULL OR sp.position = ANY(p_positions))
    AND (p_min_shots IS NULL OR te.shots_fired >= p_min_shots)
),
per_pos AS (
  SELECT
    position,
    COUNT(DISTINCT target_id)::int AS targets,
    COUNT(DISTINCT CASE WHEN elim>0 THEN target_id END)::int AS eliminated
  FROM eng
  GROUP BY position
),
all_pos AS (
  SELECT unnest(enum_range(NULL::positions))::positions AS position
),
tot AS (
  SELECT
    'Total'::text AS bucket,
    COUNT(DISTINCT ts.id)::int AS targets,
    COUNT(DISTINCT CASE WHEN ts.target_eliminated THEN ts.id END)::int AS eliminated
  FROM qs
  JOIN public.target_stats ts ON ts.session_stats_id = qs.session_stats_id
),
unioned AS (
  SELECT
    ap.position::text AS bucket,
    COALESCE(pp.targets,0) AS targets,
    COALESCE(pp.eliminated,0) AS eliminated,
    CASE WHEN COALESCE(pp.targets,0)>0 THEN pp.eliminated::numeric/pp.targets ELSE 0 END AS elimination_pct
  FROM all_pos ap
  LEFT JOIN per_pos pp ON pp.position = ap.position

  UNION ALL

  SELECT
    bucket,
    targets,
    eliminated,
    CASE WHEN targets>0 THEN eliminated::numeric/targets ELSE 0 END
  FROM tot
)
SELECT bucket, targets, eliminated, elimination_pct
FROM unioned
ORDER BY CASE bucket WHEN 'Total' THEN 2 ELSE 1 END, bucket;
$$;

GRANT EXECUTE ON FUNCTION public.squad_position_elimination_pct(uuid[],timestamptz,timestamptz,text[],positions[],int) TO authenticated, anon;


/* =========================================================
   4) Weekly trends — optional by weapon
   ========================================================= */
CREATE OR REPLACE FUNCTION public.weekly_trends(
  p_squad_ids  uuid[]        DEFAULT NULL,
  p_start      timestamptz   DEFAULT NULL,
  p_end        timestamptz   DEFAULT NULL,
  p_day_night  text[]        DEFAULT NULL,
  p_positions  positions[]   DEFAULT NULL,
  p_min_shots  int           DEFAULT 0,
  p_group_by_weapon boolean  DEFAULT FALSE
)
RETURNS TABLE (
  week_start date,
  weapon_id uuid,
  weapon_name text,
  shots int,
  hits int,
  hit_pct numeric,
  sessions int,
  median_ttf_sec numeric,
  targets int,
  eliminated int,
  elimination_pct numeric
)
LANGUAGE sql STABLE
AS $$
WITH me AS (SELECT auth.uid() AS uid),
qs   AS (SELECT * FROM public.stats_qualifying_sessions(p_squad_ids,p_start,p_end,p_day_night)),
flag AS (SELECT COALESCE(array_length(p_squad_ids,1),0) > 0 AS has_squads),
eng AS (
  SELECT
    date_trunc('week', ss.created_at)::date AS week_start,
    CASE WHEN p_group_by_weapon THEN sp.weapon_id ELSE NULL END AS weapon_id,
    CASE WHEN p_group_by_weapon THEN (w.weapon_type || COALESCE(' - '||w.serial_number,'')) ELSE NULL END AS weapon_name,
    te.shots_fired,
    COALESCE(te.target_hits,0) AS target_hits,
    ss.id AS session_stats_id,
    te.user_id
  FROM qs
  JOIN public.session_stats ss ON ss.id = qs.session_stats_id
  JOIN public.target_stats ts ON ts.session_stats_id = ss.id
  JOIN public.target_engagements te ON te.target_stats_id = ts.id
  JOIN public.session_participants sp ON sp.session_stats_id = ss.id AND sp.user_id = te.user_id
  LEFT JOIN public.weapons w ON w.id = sp.weapon_id
  CROSS JOIN flag f
  WHERE
    (f.has_squads OR te.user_id = (SELECT uid FROM me))
    AND (p_positions IS NULL OR sp.position = ANY(p_positions))
    AND (p_min_shots IS NULL OR te.shots_fired >= p_min_shots)
),
ttf AS (
  SELECT date_trunc('week', ss.created_at)::date AS week_start,
         ss.id AS session_stats_id,
         ss.time_to_first_shot_sec
  FROM qs JOIN public.session_stats ss ON ss.id = qs.session_stats_id
),
elim AS (
  SELECT
    date_trunc('week', ss.created_at)::date AS week_start,
    COUNT(*)::int AS targets,
    SUM(CASE WHEN ts.target_eliminated THEN 1 ELSE 0 END)::int AS eliminated
  FROM qs JOIN public.session_stats ss ON ss.id = qs.session_stats_id
  JOIN public.target_stats ts ON ts.session_stats_id = ss.id
  GROUP BY 1
),
agg AS (
  SELECT
    e.week_start,
    e.weapon_id,
    MAX(e.weapon_name) AS weapon_name,
    SUM(e.shots_fired)::int AS shots,
    SUM(e.target_hits)::int AS hits,
    COUNT(DISTINCT e.session_stats_id) AS sessions
  FROM eng e
  GROUP BY e.week_start, e.weapon_id
),
med AS (
  SELECT week_start,
         percentile_disc(0.5) WITHIN GROUP (ORDER BY time_to_first_shot_sec) AS median_ttf_sec
  FROM ttf GROUP BY 1
)
SELECT
  a.week_start, a.weapon_id, a.weapon_name,
  a.shots, a.hits,
  CASE WHEN a.shots>0 THEN a.hits::numeric/a.shots ELSE 0 END AS hit_pct,
  a.sessions,
  m.median_ttf_sec,
  e.targets, e.eliminated,
  CASE WHEN e.targets>0 THEN e.eliminated::numeric/e.targets ELSE 0 END AS elimination_pct
FROM agg a
LEFT JOIN med m USING (week_start)
LEFT JOIN elim e USING (week_start)
ORDER BY a.week_start DESC, a.weapon_name NULLS FIRST;
$$;

GRANT EXECUTE ON FUNCTION public.weekly_trends(uuid[],timestamptz,timestamptz,text[],positions[],int,boolean) TO authenticated, anon;


/* =========================================================
   5) Distance matrix — buckets for ChartMatrix
   ========================================================= */
CREATE OR REPLACE FUNCTION public.get_first_shot_matrix(
  p_squad_ids  uuid[]        DEFAULT NULL,
  p_start      timestamptz   DEFAULT NULL,
  p_end        timestamptz   DEFAULT NULL,
  p_day_night  text[]        DEFAULT NULL,
  p_positions  positions[]   DEFAULT NULL,
  p_distance_bucket int      DEFAULT 25,
  p_min_targets int          DEFAULT 0,
  p_min_distance int         DEFAULT 100,
  p_max_distance int         DEFAULT 900,
  p_min_shots int            DEFAULT 0
)
RETURNS TABLE (
  distance_bucket int,
  targets int,
  first_shot_hit_rate numeric,
  avg_time_to_first_shot_sec numeric
)
LANGUAGE sql STABLE
AS $$
WITH me AS (SELECT auth.uid() AS uid),
cfg AS (
  SELECT
    GREATEST(COALESCE(p_distance_bucket,25),1) AS bucket,
    GREATEST(COALESCE(p_min_distance,100),0)   AS dmin,
    GREATEST(COALESCE(p_max_distance,900),0)   AS dmax
),
qs   AS (SELECT * FROM public.stats_qualifying_sessions(p_squad_ids,p_start,p_end,p_day_night)),
flag AS (SELECT COALESCE(array_length(p_squad_ids,1),0) > 0 AS has_squads),
grid AS (
  SELECT gs::int AS distance_bucket
  FROM cfg c, generate_series((SELECT dmin FROM cfg),(SELECT dmax FROM cfg),(SELECT bucket FROM cfg)) gs
),
base AS (
  SELECT
    (floor(ts2.distance_m::numeric / (SELECT bucket FROM cfg)) * (SELECT bucket FROM cfg))::int AS distance_bucket,
    (COALESCE(te.target_hits,0) > 0)::int AS first_hit,                 -- proxy for first-shot
    ss.time_to_first_shot_sec::numeric AS ttfshot
  FROM qs
  JOIN public.session_stats ss ON ss.id = qs.session_stats_id
  JOIN public.target_stats ts2 ON ts2.session_stats_id = ss.id
  JOIN public.target_engagements te ON te.target_stats_id = ts2.id
  JOIN public.session_participants sp ON sp.session_stats_id = ss.id AND sp.user_id = te.user_id
  CROSS JOIN flag f
  WHERE
    (f.has_squads OR te.user_id = (SELECT uid FROM me))
    AND (p_positions IS NULL OR sp.position = ANY(p_positions))
    AND (p_min_shots IS NULL OR te.shots_fired >= p_min_shots)
    AND ts2.distance_m IS NOT NULL
    AND ts2.distance_m BETWEEN (SELECT dmin FROM cfg) AND (SELECT dmax FROM cfg)
),
agg AS (
  SELECT
    distance_bucket,
    COUNT(*)::int AS targets,
    AVG(first_hit)::numeric AS first_shot_hit_rate,
    AVG(ttfshot)::numeric   AS avg_time_to_first_shot_sec
  FROM base
  GROUP BY distance_bucket
)
SELECT
  g.distance_bucket,
  COALESCE(a.targets,0) AS targets,
  CASE WHEN COALESCE(a.targets,0) >= COALESCE(p_min_targets,0) THEN a.first_shot_hit_rate ELSE NULL END,
  CASE WHEN COALESCE(a.targets,0) >= COALESCE(p_min_targets,0) THEN a.avg_time_to_first_shot_sec ELSE NULL END
FROM grid g
LEFT JOIN agg a USING (distance_bucket)
ORDER BY g.distance_bucket;
$$;

GRANT EXECUTE ON FUNCTION public.get_first_shot_matrix(uuid[],timestamptz,timestamptz,text[],positions[],int,int,int,int,int) TO authenticated, anon;


/* =========================================================
   Refresh PostgREST schema cache
   ========================================================= */
NOTIFY pgrst, 'reload schema';
