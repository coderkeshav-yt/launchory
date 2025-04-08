
# RLS Policy Fix for Profiles Table

You need to execute the following SQL in your Supabase SQL editor to fix the infinite recursion issue:

```sql
-- Create a security definer function to check if a user is an admin
-- This avoids the infinite recursion problem in RLS policies
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  SELECT is_admin INTO admin_status 
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN COALESCE(admin_status, false);
END;
$$;

-- Drop any problematic RLS policies on the profiles table
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a simple policy that allows all authenticated users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create a policy that allows authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

Please run this SQL in your Supabase SQL Editor to fix the infinite recursion issue.
