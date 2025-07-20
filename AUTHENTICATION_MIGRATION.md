# Authentication Service Migration

This document outlines the migration of the authentication service from a separate backend (`sniper-supabase-auth`) into the main frontend application (`sniper-dash`).

## Changes Made

### 1. Integrated Authentication Logic

- Moved all authentication logic from the backend into the frontend services
- Consolidated service files:
  - `src/services/auth.ts` - Main authentication service with all business logic
  - `src/services/userService.ts` - All user database operations (merged from auth/userService.ts)
  - `src/services/invitationService.ts` - Invitation handling (moved from auth/invitationService.ts)

### 2. Updated Authentication Flow

- Removed dependency on external authentication API
- Direct integration with Supabase from the frontend
- Maintained the same logic and database operations

### 3. Removed Files

- `src/services/requestService.ts` - No longer needed for API calls

### 4. Updated Error Handling

- Simplified error handling to work with direct Supabase integration
- Consistent error messages across all auth operations

## Architecture

### Before:

```
Frontend (sniper-dash) → API calls → Backend (sniper-supabase-auth) → Supabase
```

### After:

```
Frontend (sniper-dash) → Supabase (direct integration)
```

## Benefits

- Simplified architecture
- Reduced latency (no intermediate API calls)
- Easier deployment (single application)
- Maintains the same business logic

## Security Considerations

- Uses Supabase Row Level Security (RLS) for data protection
- Authentication tokens managed by Supabase Auth
- No exposed service role keys in frontend

## Next Steps

1. Remove the `sniper-supabase-auth` backend service
2. Update environment variables (remove `VITE_AUTH_BASE_URL`)
3. Test all authentication flows thoroughly
