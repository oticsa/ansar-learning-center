DROP POLICY IF EXISTS "Anyone can read chat rooms" ON public.chat_rooms;
CREATE POLICY "Approved users can read chat rooms" ON public.chat_rooms FOR SELECT TO authenticated USING (public.has_learning_access());
DROP POLICY IF EXISTS "Anyone can read email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Anyone can read presence" ON public.user_presence;
CREATE POLICY "Users read own presence" ON public.user_presence FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all presence" ON public.user_presence FOR SELECT TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::app_role);