-- Test script to verify the grouping_type_enum migration
-- This can be run in Supabase SQL editor to test

-- First, check if the enum exists and show current values
SELECT unnest(enum_range(NULL::grouping_type_enum)) AS current_values;

-- The migration will add 'motion' to this list
-- After running the migration, this query should show 'motion' in the results