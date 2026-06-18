-- Drop tables in reverse order of dependencies to avoid foreign key constraint errors
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.favorites;
DROP TABLE IF EXISTS public.inventory;
DROP TABLE IF EXISTS public.account;
DROP TABLE IF EXISTS public.classification;

-- Drop custom types/enums
DROP TYPE IF EXISTS public.status_type;
DROP TYPE IF EXISTS public.account_type;