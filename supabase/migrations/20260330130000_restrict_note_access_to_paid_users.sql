-- Migration to restrict Notes CRUD access to paid users (Pro/Enterprise)
-- Free tier users will not be able to interact with notes, as requested.

-- Drop the old policy
DROP POLICY IF EXISTS "Users can CRUD their own notes" ON public.notes;

-- Create the new restricted policy
CREATE POLICY "Only paid users can CRUD their own notes" ON public.notes
  FOR ALL
  USING (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.plan IN ('pro', 'enterprise')
    )
  );
