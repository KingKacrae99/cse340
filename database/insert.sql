-- 1. Seed Classifications
INSERT INTO public.classification (classification_name, icon_class)
VALUES 
    ('Custom', 'fa-crown'),
    ('Sport', 'fa-gauge-high'),
    ('SUV', 'fa-truck-monster'),
    ('Truck', 'fa-truck'),
    ('Sedan', 'fa-car-side'),
    ('Van', 'fa-shuttle-van'),
    ('Coupe', 'fa-car'),
    ('Hybrid', 'fa-leaf'),
    ('Electric', 'fa-bolt'),
    ('Luxury', 'fa-gem'),
    ('Motorcycle', 'fa-motorcycle'),
    ('Classic', 'fa-clock-rotate-left');

-- 2. Seed Accounts
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES ('CSE340', 'Motors', 'cse340motors@info.com', 'IamOwner', 'Admin');

-- 3. Seed Inventory
-- Note: Fixed initial file paths to direct paths ('/images/...') and defaulted to corporate ownership (account_id = NULL, inv_approved = TRUE)
INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, likes_count, account_id, inv_approved)
VALUES 
    ('Chevy', 'Camaro', '2018', 'If you want to look cool this is the car you need! This car has great performance at an affordable price. Own it today!', '/images/vehicles/camaro.jpg', '/images/vehicles/camaro-tn.jpg', 25000, 101222, 'Silver', 2, 32, NULL, TRUE),
    ('Batmobile', 'Custom', '1966', 'Iconic television vehicle custom-built by George Barris from a 1955 Lincoln Futura concept car body shell.', '/images/vehicles/batmobile.jpg', '/images/vehicles/batmobile-tn.jpg', 4600000, 29887, 'Black', 1, 31, NULL, TRUE),
    ('Toyota', 'Hilux BEV Concept', '2024', 'Fully electric single-cab mid-size pickup truck prototype designed for commercial fleet use.', '/images/vehicles/toyota_hilux_bev_2026.webp', '/images/vehicles/toyota_hilux_bev_2026-tn.webp', 55000, 0, 'white', 1, 21, NULL, TRUE),
    ('Toyota', 'Hilux GR Sport II', '2024', 'Performance-oriented mid-size dual-cab pickup truck featuring Gazoo Racing off-road suspension and wide-track styling.', '/images/vehicles/toyota_hilux_gr_sportII_2024.webp', '/images/vehicles/toyota_hilux_gr_sportII_2024-tn.webp', 65000, 0, 'Red', 4, 44, NULL, TRUE),
    ('Toyota', 'Hilux Double Cab 48V', '2024', 'Mid-size dual-cab pickup utility vehicle equipped with a 48V mild-hybrid diesel powertrain for improved efficiency.', '/images/vehicles/toyota_hilux Hybrid_48v_2025.webp', '/images/vehicles/toyota_hilux Hybrid_48v_2025-tn-.webp', 50000, 41205, 'Bronze', 8, 38, NULL, TRUE),
    ('Lamborghini', 'Adventador', '2018', 'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ', '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg', 417000, 71003, 'White', 2, 22, NULL, TRUE),
    ('Toyota', '4Runner Limited', '2025', 'Sixth-generation rugged mid-size SUV built on a durable body-on-frame platform.', '/images/vehicles/Toyota_4runner_2025.webp', '/images/vehicles/Toyota_4runner_2025-tn.webp', 52000, 18956, 'Heritage Blue', 3, 33, NULL, TRUE),
    ('Toyota', 'RAV4 Prime XSE', '2021', 'High-performance plug-in hybrid compact crossover SUV with dual-tone styling.', '/images/vehicles/toyota_rav4_hybrid_2024.webp', '/images/vehicles/toyota_rav4_hybrid_2024-tn.webp', 43000, 3998, 'Red', 8, 28, NULL, TRUE),
    ('Cadillac', 'Escalade', '2019', 'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.', '/images/vehicles/escalade.jpg', '/images/vehicles/escalade-tn.jpg', 75195, 41958, 'Black', 4, 18, NULL, TRUE),
    ('GM', 'Hummer', '2008', 'Do you have 6 kids and like to go offroading? The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.', '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg', 58800, 56564, 'Yellow', 4, 12, NULL, TRUE), -- Handled your update query text change right here
    ('Toyota', 'bZ4X', '2023', 'All-electric compact crossover utility vehicle built on a dedicated EV platform.', '/images/vehicles/toyota_bz4x_2025.webp', '/images/vehicles/toyota_bz4x_2025-tn.webp', 44000, 200125, 'Silver', 9, 39, NULL, TRUE),
    ('Toyota', 'Hilux Invincible', '2021', 'Mid-size double-cab diesel pickup truck featuring premium comfort trims and robust payload capacity.', '/images/vehicles/truck.webp', '/images/vehicles/truck-tn.webp', 48000, 26357, 'Dark Gray', 4, 55, NULL, TRUE),
    ('Tesla', 'Model 3', '2024', 'All-electric compact luxury sedan featuring the refined "Highland" aerodynamic facelift.', '/images/vehicles/tesla_model_3_2025.webp', '/images/vehicles/tesla_model_3_2025-tn.webp', 39000, 128564, 'Stealth Gray', 9, 23, NULL, TRUE),
    ('Tesla', 'Model S', '2012', 'Premium all-electric full-size luxury liftback sedan showcasing the original pre-facelift nosecone design.', '/images/vehicles/tesla_model_s_2016.webp', '/images/vehicles/tesla_model_s_2016-tn.webp', 75000, 38522, 'Metallic Charcoal', 10, 24, NULL, TRUE),
    ('Audi', 'R8 Coupe', '2014', 'First-generation mid-engine luxury sports car featuring signature LED DRL headlights and sideblades.', '/images/vehicles/black-audi.webp', '/images/vehicles/black-audi-tn.webp', 115000, 108247, 'Matte Black', 2, 34, NULL, TRUE),
    ('Ford', 'Mustang GT Custom', '2013', 'Heavily customized performance muscle coupe featuring an aftermarket body kit, slammed suspension, and deep-dish wheels.', '/images/vehicles/black-coupe.webp', '/images/vehicles/black-coupe-tn.webp', 35000, 0, 'Black', 1, 20, NULL, TRUE),
    ('BMW', '4 Series Coupe (F32)', '2015', 'Sleek luxury compact executive sports coupe featuring an M-Sport aerodynamic package.', '/images/vehicles/bmw.webp', '/images/vehicles/bmw-tn.webp', 42000, 23000, 'Black', 7, 45, NULL, TRUE),
    ('BMW', '3 Series Sedan (F30)', '2013', 'Compact executive four-door luxury sports sedan styled with a blacked-out kidney grille treatment.', '/images/vehicles/bmw-sedan.webp', '/images/vehicles/bmw-sedan-tn.webp', 33000, 45000, 'Black', 5, 35, NULL, TRUE),
    ('Hyundai', 'Grandeur', '2023', 'Seventh-generation full-size flagship luxury sedan featuring futuristic seamless horizon LED light bars.', '/images/vehicles/hyundai-grandeur.webp', '/images/vehicles/hyundai-grandeur-tn.webp', 45000, 15000, 'Silver', 10, 23, NULL, TRUE),
    ('Mercedes-Benz', 'GLS 63 AMG Custom (Larte Design)', '2017', 'Luxury full-size high-performance SUV upgraded with an aggressive widebody carbon fiber aero kit by Larte Design.', '/images/vehicles/firstslidemercedes.webp', '/images/vehicles/firstslidemercedes-tn.webp', 140000, 5000, 'Black', 1, 25, NULL, TRUE),
    ('Mercedes-Benz', 'G 63 AMG', '2016', 'Iconic twin-turbo V8 high-performance luxury off-road vehicle with boxy military heritage styling.', '/images/vehicles/g-wagon.webp', '/images/vehicles/g-wagon-tn.webp', 139000, 13000, 'Matte Black', 3, 30, NULL, TRUE),
    ('Hyundai', 'Ioniq 5 N', '2024', 'High-performance, all-electric crossover featuring track-optimized dual motors, aggressive aero elements, and simulated paddle shifts.', '/images/vehicles/Hyundai-IONIQ-5N.webp', '/images/vehicles/Hyundai-IONIQ-5N-tn.webp', 66000, 0, 'Performance Blue', 9, 40, NULL, TRUE),
    ('Hyundai', 'Elantra N', '2024', 'Track-ready high-performance compact sport sedan equipped with a turbocharged engine and signature red exterior trim accents.', '/images/vehicles/hyundai-motors-1.webp', '/images/vehicles/hyundai-motors-1-tn.webp', 33000, 0, 'Blue', 2, 20, NULL, TRUE),
    ('Hyundai', 'Santa Fe Calligraphy', '2024', 'Radically redesigned mid-size family SUV showcasing a boxy, futuristic aesthetic and premium interior amenities.', '/images/vehicles/hyundai-suv.webp', '/images/vehicles/hyundai-suv-tn.webp', 47000, 23399, 'Terracotta Orange', 8, 25, NULL, TRUE),
    ('Kia', 'F-150 Lightning', '2022', 'Full-size three-row all-electric flagship SUV featuring a striking geometric design and advanced highway driving pilot features.', '/images/vehicles/kia-black-car.webp', '/images/vehicles/kia-black-car-tn.webp', 74000, 0, 'Aurora Black Pearl', 9, 30, NULL, TRUE),
    ('Lamborghini', 'Aventador LP700-4', '2012', 'Exotic Italian supercar powered by a roaring mid-engine V12 with an angular design inspired by stealth fighter jets.', '/images/vehicles/orange-lambo-adventador.webp', '/images/vehicles/orange-lambo-adventador-tn.webp', 393000, 15000, 'Arancio Argos Orange', 2, 20, NULL, TRUE),
    ('Mercedes-Benz', 'A-Class Hatchback (W177)', '2019', 'Premium compact luxury hatchback displaying the modern AMG-line exterior package styling cues.', '/images/vehicles/red-small-benz.webp', '/images/vehicles/red-small-benz-tn.webp', 35000, 20000, 'Red', 10, 30, NULL, TRUE),
    ('Genesis', 'G80', '2021', 'Elegant mid-size luxury executive sedan featuring the brand iconic crest grille and twin-line LED headlights.', '/images/vehicles/sedan.webp', '/images/vehicles/sedan-tn.webp', 48000, 15000, 'Savile Silver', 5, 25, NULL, TRUE),
    ('Tesla', 'Semi', '2023', 'Class 8 all-electric commercial tri-motor tractor designed for heavy-duty, long-haul freight transportation.', '/images/vehicles/semi-truck.webp', '/images/vehicles/semi-truck-tn.webp', 180000, 0, 'Alpine White', 9, 40, NULL, TRUE),
    ('Mercedes-Benz', 'CLA Coupe', '2020', 'Sleek, subcompact luxury four-door coupe showcasing a sloping panoramic roofline and frameless doors.', '/images/vehicles/small-benz.webp', '/images/vehicles/small-benz-tn.webp', 37000, 12000, 'Polar White', 7, 22, NULL, TRUE),
    ('Ford', 'F-150 Lightning', '2022', 'All-electric full-size pickup truck offering traditional truck capability combined with an advanced signature front LED lightbar.', '/images/vehicles/truck.webp', '/images/vehicles/truck-tn.webp', 55000, 0, 'Antimatter Blue', 9, 30, NULL, TRUE);

-- 4. Sample Verification Join Query (Sport Class Vehicles)
SELECT inv_make, inv_model, classification_name 
FROM public.inventory
JOIN public.classification USING(classification_id)
WHERE classification_name = 'Sport';

INSERT INTO public.tier_classifications_catalog (classification_name) 
    VALUES ('LEASE'),
    ('FINANCE'),
    ('EQUITY_LINE')
    ON CONFLICT (classification_name) DO NOTHING;

INSERT INTO public.tier_names_catalog (display_name)
    VALUES ('Bespoke Asset Leasing'),
    ('Direct Capital Acquisition'),
    ('Equity Line Access')
    ON CONFLICT (display_name) DO NOTHING;