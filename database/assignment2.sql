---- QUERY 1 ----
-- Add data into the `account table`
INSERT INTO public.account (account_firstname,
        account_lastname,
		account_email,
		account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

---- QUERY 2 ----
-- Update account_id=1 in the `account table`
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

---- QUERY 3 ----
-- Delete data from the `account table`
DELETE FROM public.account
WHERE account_id=1;

---- Query 4 ----
-- Update GM Hummer data from the `inventory table`
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'AND inv_model = 'Hummer' AND classification_id = 4;

---- Query 5 ----
-- Using Select & Inner join statment `inventory table`
SELECT inv_make, inv_model, classification_name 
FROM public.inventory
JOIN public.classification
USING(classification_id)
WHERE classification_name = 'Sport';

-- Query 6
-- Updating inv_image & inv_thumbnail in the `inventory table`
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', 'images/vehicles/');