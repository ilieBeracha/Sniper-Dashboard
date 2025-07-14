# SessionStatsFull Component Structure

This directory contains the modular structure for the SessionStatsFull component, which is a multi-step form for recording training session statistics.

## Directory Structure

```
SessionStatsFull/
├── types/               # TypeScript interfaces and types
│   └── index.ts        # All shared types
├── sections/           # Individual section components
│   ├── index.ts       # Barrel export for all sections
│   ├── SectionHeader.tsx          # Shared section header component
│   ├── ProgressIndicator.tsx      # Progress sidebar component
│   ├── SessionConfigSection.tsx   # Session configuration form
│   ├── ParticipantsSection.tsx   # Team participants management
│   ├── TargetsSection.tsx        # Target setup and configuration
│   ├── EngagementsSection.tsx   # Target engagement data entry
│   └── SummarySection.tsx        # Summary and submission
└── README.md          # This file
```

## Component Breakdown

### Main Component

- **sessionStatsFull.tsx**: The main container component that manages state and orchestrates all sections

### Section Components

1. **SessionConfigSection**: Handles basic session information

   - Training assignment selection
   - Day/night period selection
   - Time to first shot
   - Session notes

2. **ParticipantsSection**: Manages team participants

   - Add individual members or entire squad
   - Assign roles (Sniper/Spotter)
   - Select positions and equipment/weapons

3. **TargetsSection**: Configure training targets

   - Set target distances
   - Configure wind conditions
   - Add mistake codes

4. **EngagementsSection**: Record performance data

   - Shots fired per participant per target
   - Target hits tracking

5. **SummarySection**: Review and submit
   - Display summary statistics
   - Validation errors
   - Submit button

### Shared Components

- **SectionHeader**: Consistent header styling for each section
- **ProgressIndicator**: Fixed sidebar showing progress and validation status

## Types

All TypeScript interfaces are defined in `types/index.ts`:

- `SessionData`: Session configuration data
- `Participant`: Team member information
- `Target`: Target configuration
- `TargetEngagement`: Performance data per target
- `Section`: Section metadata for navigation

## Usage

The main component can be imported and used as:

```tsx
import ImprovedSessionStats from "@/views/sessionStatsFull";
```

## Features

- **Progressive Form Flow**: Users move through sections in order
- **Real-time Validation**: Each section validates independently
- **Smooth Scrolling**: Snap scrolling between sections
- **Progress Tracking**: Visual indicator of current section and validation status
- **Responsive Design**: Works on mobile and desktop

## State Management

All state is managed in the main component and passed down to sections via props:

- Session data
- Participants list
- Targets configuration
- Validation errors

Helper functions for state updates are also passed as props to maintain centralized state management.
