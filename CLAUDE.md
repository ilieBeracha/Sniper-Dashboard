Squad Training Session Tracker
Goal
Build a flexible, data-rich platform to track sniper/spotter squad training sessions. Capture every layer from squad configuration to per-target performance, even when some details are missing.

Context
Built on Supabase (PostgreSQL) with auth.users

React + Tailwind frontend with dynamic light/dark theming

Modular UI powered by BaseButton, SpPageTabs, TrainingScoresTable, TrainingAnalyticsTab, and modals for add/edit

Schema Overview
🧱 Core Tables:

training_session: top-level record, created by team, linked to assignment

session_stats: 1 per squad session, includes note, time_to_first_shot, day/night

session_participants: users participating in a session (with role, weapon, equipment, position)

🎯 Target Tracking:

target_stats: one row per target in a session (distance, wind, total_hits, mistake_code, target_eliminated is auto-derived)

target_engagements: user-level actions per target (shots_fired required, target_hits optional, is_estimated + estimated_method for logic transparency)

🧍 Users & Structure:

users: extended from auth.users with team, squad, default weapon/equipment, and duty

squads / teams: structural org, with commander linkage

weapons: includes weapon_type, mv (muzzle velocity), shots_fired

equipment: optical or support tools assigned to users

🎓 Assignments:

assignment + assignment_session tables tie training_sessions to exercises (many-to-many-like structure)

UX & Logic
🎛 Session Engagement Form:

Built as a beautiful, form-based UI with per-target and per-user interactions

Auto-distribution logic if user hits unknown (proportional to shots_fired)

Auto target_eliminated calc: target is considered eliminated if total_hits ≥ threshold (default 2)

All engagement rows marked estimated if system fills in data

📈 Analytics Support:

Score tab → TrainingScoresTable

Analytics tab → TrainingAnalyticsTab (breakdowns, role performance, session-level metrics)

Status tab → Session status transitions with modal confirmation

✅ Submission Workflow:

Add Group Score → opens modal with session_id pre-filled

Add Score → handles individual scoring

Session Stats → opens full form for session_participants and target breakdown

ConfirmStatusChangeModal → handles training session state lifecycle

Supabase Schema Overview
This file documents the main tables used in the sniper training session tracking platform.

🪖 training_session
Column Type Notes
id uuid (PK) Generated via gen_random_uuid()
session_name text
location text Optional
date timestamptz
team_id uuid (FK → teams) Nullable
status training_status enum scheduled / in_progress / done
creator_id uuid (FK → users) Nullable

🧠 session_stats
Column Type Notes
id uuid (PK)
training_id uuid (FK → training_session)
assignment_id uuid (FK → assignment_session)
squad_id uuid (FK → squads)
team_id uuid (FK → teams)
creator_id uuid (FK → users)
day_period 'day' or 'night'
time_to_first_shot integer
note text

👥 session_participants
Column Type Notes
id uuid (PK)
session_id uuid (FK → session_stats)
user_id uuid (FK → users)
user_duty enum (sniper / spotter)
weapon_id uuid (FK → weapons)
equipment_id uuid (FK → equipment)
position enum (lying, standing, etc.)

🎯 target_stats
Column Type Notes
id uuid (PK)
session_id uuid (FK → session_stats)
distance_m integer Meters
wind_strength numeric Nullable
wind_direction_deg integer Nullable
total_hits integer Nullable (system derived)
target_eliminated boolean Auto-calculated (if hits ≥ 2)
mistake_code text Optional

🧑‍🎯 target_engagements
Column Type Notes
id uuid (PK)
target_id uuid (FK → target_stats)
user_id uuid (FK → users)
shots_fired integer Required
target_hits integer Optional
is_estimated boolean True if system filled hits
estimated_method text Optional (e.g. 'ratio')

🧑 users
Column Type Notes
id uuid (PK)
email text From auth.users
first_name varchar Nullable
last_name varchar Nullable
team_id uuid (FK → teams)
squad_id uuid (FK → squads)
user_default_duty enum Default role
user_default_weapon uuid (FK → weapons)
user_default_equipment uuid (FK → equipment)

🧰 weapons
Column Type Notes
id uuid (PK)
weapon_type enum e.g., M24, SR-25
serial_number text Unique
team_id uuid (FK → teams)
mv numeric Muzzle velocity
shots_fired smallint Optional

🧭 equipment
Column Type Notes
id uuid (PK)
equipment_type text e.g., scope, rangefinder
serial_number text Unique
team_id uuid (FK → teams)

🪖 squads
Column Type Notes
id uuid (PK)
squad_name text
team_id uuid (FK → teams)
squad_commander_id uuid (FK → users)

🛡 teams
Column Type Notes
id uuid (PK)
team_name text
team_commander_id uuid (FK → users / auth.users)
invite_code uuid Unique

🎓 assignment & assignment_session
Table Description
assignment Assignment template
assignment_session Links assignment to training_session

When target_hits is NOT provided:
We still require:

shots_fired per user (must be entered)

total_hits on the target (entered once for that target)

Then:

We estimate hits per user based on their share of the shots:

estimated_hits = (user_shots / total_shots_all_users) × total_hits

We record:

target_hits = estimated_hits (rounded)

is_estimated = true

estimated_method = 'shots_ratio'

📉 What stats will still work (with less accuracy):
You will still be able to calculate:

Stat / Metric Accuracy Notes
Total shots fired per user ✅ accurate user input directly
Total hits per target ✅ accurate single confirmed value
Hits per user ⚠️ estimated fair but not precise
Hit ratio per user ⚠️ estimated based on inferred hits
Target eliminated flag ✅ accurate based on total_hits threshold
Overall session accuracy ⚠️ approximate good enough for trends
Weapon/equipment effectiveness ⚠️ approximate valid only if engagements are split properly

🧠 Analysis Tagging
You can clearly tag these sessions in analytics with:

“Data partially estimated — based on firing volume, not confirmed hits.”

Or:

“Hits distributed proportionally by shots fired (estimation method: shots_ratio)”