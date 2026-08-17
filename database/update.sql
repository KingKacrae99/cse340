UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 2 AND account_firstname = 'CSE340' AND account_lastname = 'Motors';

SELECT * FROM public.account
WHERE account_type = 'Admin'