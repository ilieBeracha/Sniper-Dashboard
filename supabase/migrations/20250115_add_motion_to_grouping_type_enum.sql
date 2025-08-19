-- =====================================================
-- ADD 'motion' VALUE TO grouping_type_enum
-- =====================================================
-- This migration adds a new value 'motion' to the existing
-- grouping_type_enum for use in grouping score selection
-- =====================================================

-- Add 'motion' value to the grouping_type_enum
-- This is safe to run multiple times as PostgreSQL will throw an error
-- if the value already exists, but won't break the migration
DO $$ 
BEGIN
    -- Check if 'motion' value doesn't already exist
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum 
        WHERE enumlabel = 'motion' 
        AND enumtypid = (
            SELECT oid 
            FROM pg_type 
            WHERE typname = 'grouping_type_enum'
        )
    ) THEN
        -- Add the new value
        ALTER TYPE grouping_type_enum ADD VALUE 'motion';
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON TYPE grouping_type_enum IS 
'Enum for grouping types including the new motion option for grouping score selection';