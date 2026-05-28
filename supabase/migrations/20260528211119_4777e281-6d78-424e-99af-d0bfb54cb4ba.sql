-- Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public roles.
-- These functions are only meant to be invoked by triggers, never by API callers.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;