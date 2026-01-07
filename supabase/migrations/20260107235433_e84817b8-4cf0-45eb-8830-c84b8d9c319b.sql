-- 1. Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Update handle_new_user to validate and sanitize full_name input
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(TRIM(LEFT(NEW.raw_user_meta_data ->> 'full_name', 100)), '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;

-- 3. Add constraint for full_name max length on profiles table
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_full_name_length CHECK (char_length(full_name) <= 100);