# SessionStats System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Data Flow Diagram](#data-flow-diagram)
3. [Database Structure](#database-structure)
4. [User Journey](#user-journey)
5. [Business Logic & Calculations](#business-logic--calculations)
6. [Data Analysis Capabilities](#data-analysis-capabilities)
7. [Component Architecture](#component-architecture)

---

## System Overview

The SessionStats system is a comprehensive training session tracking platform designed for sniper/spotter squads. It captures detailed information about training sessions, including participant data, target engagements, and performance metrics. The system supports both precise and estimated data collection, making it flexible for various training scenarios.

### Key Features
- Multi-step wizard interface for data collection
- Support for multiple participants with different roles (Sniper/Spotter)
- Target tracking with environmental conditions
- Automatic hit distribution when individual hits are unknown
- Real-time validation and error handling
- Responsive design for mobile and desktop

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SessionStatsModal                           │
│  (Main Container - Manages wizard state and navigation)             │
└────────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      useSessionStatsLogic                           │
│  (Central Hook - Manages all state and business logic)              │
│                                                                     │
│  • Session Data (assignment, time, period)                          │
│  • Participants Management                                          │
│  • Targets Management                                               │
│  • Engagements (shots/hits per user per target)                    │
│  • Validation Logic                                                 │
│  • Save Operations                                                  │
└────────────────────────────────┬───────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ Step 1:      │        │ Step 2:      │        │ Step 3:      │
│ SessionSetup │        │ Participants │        │ Targets      │
│              │        │              │        │              │
│ • Assignment │        │ • Add Users  │        │ • Distance   │
│ • Day/Night  │        │ • Set Roles  │        │ • Wind Data  │
│ • Time Data  │        │ • Equipment  │        │ • Mistakes   │
└──────────────┘        └──────────────┘        └──────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ Step 4:      │        │ Step 5:      │        │ Step 6:      │
│ Engagements  │        │ Review       │        │ Submit       │
│              │        │              │        │              │
│ • Shots/User │        │ • Validation │        │ • Save Data  │
│ • Hits/User  │        │ • Summary    │        │ • Callbacks  │
│ • Auto-Calc  │        │ • Errors     │        │              │
└──────────────┘        └──────────────┘        └──────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          sessionStore                               │
│  (Zustand Store - Handles API calls and data persistence)           │
└────────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Supabase Database                            │
│                                                                     │
│  • session_stats (main session record)                              │
│  • session_participants (user assignments)                          │
│  • target_stats (target information)                                │
│  • target_engagements (shots/hits per user per target)              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Structure

### Core Relationships
```
training_session (1) ─── (1) session_stats
                              │
                              ├─── (n) session_participants ─── users
                              │                            ─── weapons
                              │                            ─── equipment
                              │
                              └─── (n) target_stats
                                        │
                                        └─── (n) target_engagements ─── users
```

### Table Details

#### 1. session_stats
Primary session record that links to training_session
```sql
- id: uuid (PK)
- training_id: uuid (FK → training_session)
- assignment_id: uuid (FK → assignment_session)
- squad_id: uuid (FK → squads)
- team_id: uuid (FK → teams)
- creator_id: uuid (FK → users)
- day_period: 'day' | 'night'
- time_to_first_shot: integer (seconds)
- note: text (optional)
```

#### 2. session_participants
Records each user's participation in a session
```sql
- id: uuid (PK)
- session_id: uuid (FK → session_stats)
- user_id: uuid (FK → users)
- user_duty: 'sniper' | 'spotter'
- weapon_id: uuid (FK → weapons) - Required for snipers
- equipment_id: uuid (FK → equipment) - Required for spotters
- position: 'Lying' | 'Standing' | 'Sitting' | 'Operational'
```

#### 3. target_stats
One record per target engaged in the session
```sql
- id: uuid (PK)
- session_id: uuid (FK → session_stats)
- distance_m: integer (meters)
- wind_strength: numeric (m/s, optional)
- wind_direction_deg: integer (0-360°, optional)
- total_hits: integer (system calculated)
- target_eliminated: boolean (auto: true if hits ≥ 2)
- mistake_code: text (optional)
```

#### 4. target_engagements
Records individual user performance per target
```sql
- id: uuid (PK)
- target_id: uuid (FK → target_stats)
- user_id: uuid (FK → users)
- shots_fired: integer (required)
- target_hits: integer (optional)
- is_estimated: boolean (true if system calculated)
- estimated_method: text (e.g., 'shots_ratio')
```

---

## User Journey

### Step 1: Session Setup
1. User opens SessionStatsModal
2. Selects assignment from dropdown (required)
3. Chooses day/night period using visual toggle
4. Sets time to first shot (slider with presets: 3s, 5s, 10s)
5. Optionally adds session notes

**Validation:**
- Assignment must be selected
- Time to first shot must be > 0
- Squad/team info must be present

### Step 2: Participants
1. Current user automatically added as first participant
2. Can add individual members from dropdown
3. "Add All Squad Members" button for bulk addition
4. For each participant:
   - Name (auto-filled from user data)
   - Position (Lying/Standing/Sitting/Operational)
   - Duty (Sniper/Spotter)
   - Weapon (for snipers) or Equipment (for spotters)

**Validation:**
- At least one participant required
- Snipers must have weapon assigned
- Spotters must have equipment assigned

### Step 3: Targets
1. Add targets with "Add Target" button
2. For each target:
   - Distance (100-900m, slider interface)
   - Wind strength (optional, m/s)
   - Wind direction (optional, 0-360°)
   - Mistake code (optional text)
3. Targets can be collapsed/expanded for cleaner UI

**Validation:**
- At least one target required
- Distance must be > 0

### Step 4: Engagements
1. For each target, enter engagement data:
   - Shots fired per sniper (required)
   - Option to track hits separately or combined
2. Two modes:
   - **Separate Hits**: Enter hits for each participant
   - **Combined Hits**: Enter total hits, system distributes proportionally

**Auto-distribution Logic:**
```javascript
estimatedHits = Math.round((userShots / totalShots) × totalHits)
// Ensures hits don't exceed shots fired
finalHits = Math.min(estimatedHits, userShots)
```

**Validation:**
- All snipers must have shots fired ≥ 0
- Hits cannot exceed shots fired
- Total hits validated against total shots

### Step 5: Review
1. Displays complete session summary
2. Shows validation status (errors or ready)
3. Lists all:
   - Session information
   - Participants with roles
   - Targets with elimination status
4. Error highlighting for quick fixes

### Step 6: Submit
1. Final confirmation screen
2. Submit button triggers save operation
3. Success callback with session ID
4. Modal closes and form resets

---

## Business Logic & Calculations

### 1. Hit Distribution Algorithm
When using combined hit tracking:

```javascript
// For each participant engaging a target:
const totalShots = target.engagements.reduce((sum, eng) => sum + eng.shotsFired, 0);
const ratio = participant.shotsFired / totalShots;
const estimatedHits = Math.round(totalHits * ratio);
const finalHits = Math.min(estimatedHits, participant.shotsFired);

// Database records:
{
  target_hits: finalHits,
  is_estimated: true,
  estimated_method: 'shots_ratio'
}
```

### 2. Target Elimination Logic
```javascript
// Automatic calculation
target_eliminated = (total_hits >= 2);
```

### 3. Participant Filtering
- Only snipers can have weapons and shoot
- Only spotters can have equipment
- Shots fired only tracked for snipers
- UI dynamically shows/hides fields based on duty

### 4. Data Persistence Strategy
The system uses a transaction-like approach:
1. Validates all data before submission
2. Creates session_stats record
3. Batch inserts participants
4. Creates targets with engagements
5. Returns session ID on success

---

## Data Analysis Capabilities

### 1. Individual Performance Metrics
- **Hit Rate**: `(total_hits / total_shots) × 100`
- **First Shot Accuracy**: Trackable via time_to_first_shot
- **Distance Performance**: Accuracy by distance ranges
- **Environmental Adaptation**: Performance in different wind conditions

### 2. Squad Performance Metrics
- **Squad Hit Rate**: Aggregate performance
- **Day vs Night Performance**: Comparison by period
- **Position Effectiveness**: Hit rates by shooting position
- **Target Elimination Rate**: Percentage of targets eliminated

### 3. Equipment Analysis
- **Weapon Effectiveness**: Hit rates by weapon type
- **Equipment Impact**: Spotter equipment correlation with squad performance
- **Muzzle Velocity Analysis**: Using weapon MV data

### 4. Training Progress
- **Session-over-Session Improvement**: Trend analysis
- **Assignment Difficulty**: Performance by assignment type
- **Environmental Challenge Rating**: Wind impact on accuracy

### 5. Estimation Transparency
All estimated data is clearly marked:
- `is_estimated = true` in database
- Can filter analytics by data quality
- Estimation method tracked for transparency

### 6. Advanced Analytics Queries

**Example: Squad Performance by Assignment**
```sql
SELECT 
  a.assignment_name,
  AVG(CASE WHEN te.is_estimated = false 
       THEN te.target_hits::float / te.shots_fired 
       ELSE NULL END) as precise_hit_rate,
  AVG(te.target_hits::float / te.shots_fired) as overall_hit_rate,
  COUNT(DISTINCT ss.id) as session_count
FROM session_stats ss
JOIN assignment_session a ON ss.assignment_id = a.id
JOIN target_stats ts ON ts.session_id = ss.id
JOIN target_engagements te ON te.target_id = ts.id
GROUP BY a.assignment_name;
```

---

## Component Architecture

### 1. SessionStatsModal
- **Purpose**: Main container and navigation controller
- **Responsibilities**:
  - Step navigation and validation
  - Modal lifecycle management
  - Keyboard shortcuts (ESC to close)
  - Progress indicators
  - Submit orchestration

### 2. useSessionStatsLogic Hook
- **Purpose**: Centralized state and business logic
- **Manages**:
  - All form data (session, participants, targets, engagements)
  - Validation rules
  - Data transformations
  - API communication via sessionStore
  - Form reset on close

### 3. Step Components

#### SessionSetupStep
- Assignment selection
- Day/night toggle with visual feedback
- Time input with presets
- Note textarea

#### ParticipantsStep
- Member dropdown with filtering
- Bulk add functionality
- Role-based field visibility
- Participant removal (except self)

#### TargetsStep
- Distance slider with visual feedback
- Collapsible panels for space efficiency
- Optional environmental data
- Dynamic target management

#### EngagementsStep
- Toggle between separate/combined hit tracking
- Auto-distribution of hits
- Real-time accuracy calculation
- Visual grouping by target

#### ReviewStep
- Comprehensive data summary
- Error state visualization
- Ready/not-ready status
- Grouped display sections

#### SubmitStep
- Simple confirmation UI
- Loading states during save
- Success feedback

### 4. Integration Points

**Zustand Stores Used:**
- `trainingStore`: Current training session
- `userStore`: Current user data
- `teamStore`: Team members list
- `weaponsStore`: Available weapons
- `equipmentStore`: Available equipment
- `sessionStore`: Save operations

**External Dependencies:**
- React Portal for modal rendering
- Lucide React for icons
- Tailwind CSS for styling
- React Toastify for notifications

---

## Key Design Decisions

1. **Flexible Data Entry**: Supporting both precise and estimated hit tracking accommodates real-world training scenarios

2. **Multi-Step Wizard**: Breaks complex data entry into manageable chunks, reducing cognitive load

3. **Auto-Distribution**: Mathematical fairness in hit distribution based on shot volume

4. **Validation at Each Step**: Prevents progression with invalid data, improving data quality

5. **Responsive Design**: Mobile-first approach ensures usability in field conditions

6. **State Persistence**: Form data persists during modal lifecycle but resets on close

7. **Type Safety**: TypeScript interfaces ensure data consistency throughout the flow

8. **Accessibility**: Keyboard navigation, ARIA labels, and focus management

This comprehensive system provides a robust foundation for tracking and analyzing sniper squad training performance with both flexibility and precision.