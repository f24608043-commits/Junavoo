
-- Fix coupons: replace ALL policy with specific operations
DROP POLICY "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can insert coupons" ON public.coupons FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update coupons" ON public.coupons FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete coupons" ON public.coupons FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
