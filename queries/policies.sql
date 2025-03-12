-- RUN ON SUPABASE SQL EDITOR

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Policies for profiles table
-- ============================================================================

-- Policy: Allow users to read their own profile
CREATE POLICY read_own_profile ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Allow users to update their own profile
CREATE POLICY update_own_profile ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Allow users to delete their own profile
CREATE POLICY delete_own_profile ON profiles
    FOR DELETE
    USING (auth.uid() = id);