-- migration: 20241230123000_sample_data_demo.sql
-- description: Insert sample Polish snacks for demo
-- purpose: provide demo data for PoC presentation with realistic Polish snack content
-- affected tables: public.snacks
-- author: AI Assistant
-- date: 2024-12-30

-- NOTE: For demo user creation, use the Supabase Auth signup flow or dashboard
-- This migration only provides the snacks data

-- truncate existing data for clean demo (use with caution in production)
truncate table public.user_favourites;
truncate table public.snacks restart identity cascade;

-- insert sample polish snacks with realistic nutritional data
insert into public.snacks (
    title,
    description,
    ingredients,
    instructions,
    snack_type,
    location,
    goal,
    preferred_diet,
    kcal,
    protein,
    fat,
    carbohydrates,
    fibre
) values
-- słodkie przekąski (sweet snacks)
(
    'Jogurt naturalny z miodem i orzechami',
    'Kremowy jogurt naturalny z dodatkiem miodu wielokwiatowego i posiekanych orzechów włoskich. Idealna przekąska na słodko, bogata w białko i zdrowe tłuszcze.',
    'jogurt naturalny (150g), miód wielokwiatowy (1 łyżka), orzechy włoskie (20g)',
    '1. Przełóż jogurt do miski. 2. Dodaj miód i delikatnie wymieszaj. 3. Posiekaj orzechy na drobne kawałki. 4. Posyp jogurt orzechami i podawaj.',
    'słodka',
    'dom',
    'utrzymanie',
    'wegetariańska',
    245,
    8.5,
    14.2,
    18.7,
    2.1
),
(
    'Owsianka z bananem i cynamon',
    'Klasyczna owsianka na mleku z dojrzałym bananem i aromatycznym cynamonem. Sycąca i pożywna przekąska na każdą porę dnia.',
    'płatki owsiane (40g), mleko 2% (200ml), banan (1 sztuka), cynamon (szczypta)',
    '1. Zagotuj mleko w garnku. 2. Dodaj płatki owsiane i gotuj 3-5 minut. 3. Pokrój banana w plastry. 4. Przełóż owsiankę do miski, dodaj banana i cynamon.',
    'słodka',
    'dom',
    'przyrost',
    'wegetariańska',
    285,
    11.2,
    6.8,
    45.3,
    5.4
),
(
    'Smoothie z jagód i jogurtu greckiego',
    'Orzeźwiające smoothie z zamrożonych jagód, jogurtu greckiego i odrobiny miodu. Pełne antyoksydantów i probiotyków.',
    'jagody zamrożone (100g), jogurt grecki (100g), miód (1 łyżeczka), mleko migdałowe (50ml)',
    '1. Wszystkie składniki włóż do blendera. 2. Miksuj przez 1-2 minuty do uzyskania gładkiej konsystencji. 3. Przelej do szklanki i podawaj od razu.',
    'słodka',
    'poza domem',
    'redukcja',
    'wegetariańska',
    165,
    8.9,
    2.1,
    26.4,
    4.2
),
(
    'Bananowe muffiny owsiane',
    'Delikatne, bezglutenowe muffiny z mąki owsianej i dojrzałych bananów. Idealne na wynos do pracy.',
    'mąka owsiana (80g), banany (2 sztuki), jajka (2 sztuki), olej kokosowy (2 łyżki), proszek do pieczenia (1 łyżeczka)',
    '1. Rozgnieć banany na purée. 2. Wymieszaj wszystkie składniki. 3. Przełóż do foremek na muffiny. 4. Piecz 18 minut w 180°C.',
    'słodka',
    'praca',
    'utrzymanie',
    'bezglutenowa',
    195,
    6.8,
    8.4,
    26.1,
    3.7
),
(
    'Chia pudding z mango',
    'Kremowy pudding z nasion chia i mleka kokosowego z kawałkami świeżego mango. Bogaty w omega-3 i błonnik.',
    'nasiona chia (30g), mleko kokosowe (200ml), mango (100g), syrop klonowy (1 łyżka)',
    '1. Wymieszaj chia z mlekiem i syropem. 2. Odstaw na 2 godziny w lodówce. 3. Pokrój mango w kostkę. 4. Podawaj z kawałkami mango.',
    'słodka',
    'dom',
    'utrzymanie',
    'wegańska',
    220,
    5.2,
    11.8,
    23.6,
    8.1
),
-- słone przekąski (savory snacks)
(
    'Awokado na chlebie żytnim',
    'Klasyczna kanapka z dojrzałym awokado, solą morską i pieprzem na chlebie żytnim pełnoziarnistym.',
    'awokado (1/2 sztuki), chleb żytni pełnoziarnisty (2 kromki), sól morska (szczypta), pieprz czarny (szczypta), sok z cytryny (kilka kropli)',
    '1. Opiecz chleb w tosterze. 2. Rozgnieć awokado widelcem. 3. Posmaruj chleb awokado. 4. Skrop sokiem z cytryny, dopraw solą i pieprzem.',
    'słona',
    'praca',
    'utrzymanie',
    'wegańska',
    310,
    8.4,
    18.7,
    28.9,
    11.2
),
(
    'Hummus z marchewką',
    'Kremowy hummus z ciecierzycy podawany z młodą marchewką do maczania. Idealna zdrowa przekąska.',
    'ciecierzyca z puszki (200g), tahini (2 łyżki), czosnek (1 ząbek), sok z cytryny (2 łyżki), marchewka (100g)',
    '1. Odsącz ciecierzycę. 2. Zmiksuj wszystkie składniki na gładką pastę. 3. Pokrój marchewkę w słupki. 4. Podawaj hummus z marchewką.',
    'słona',
    'poza domem',
    'redukcja',
    'wegańska',
    185,
    7.8,
    9.4,
    18.2,
    6.7
),
(
    'Jajka na twardo z ogórkiem',
    'Proste jajka ugotowane na twardo z krojonym ogórkiem i szczyptą soli. Idealne źródło białka.',
    'jajka (2 sztuki), ogórek (1 mały), sól (szczypta), pieprz (szczypta)',
    '1. Ugotuj jajka na twardo (8-10 minut). 2. Obierz i pokrój na połówki. 3. Pokrój ogórek w plastry. 4. Dopraw solą i pieprzem.',
    'słona',
    'praca',
    'przyrost',
    'wegetariańska',
    165,
    12.6,
    10.8,
    3.2,
    1.1
),
(
    'Twaróg z rzodkiewką i szczypiorkiem',
    'Świeży twaróg z pokrojoną rzodkiewką i posiekanym szczypiorkiem. Lekka i orzeźwiająca przekąska.',
    'twaróg półtłusty (150g), rzodkiewka (4 sztuki), szczypiorek (1 łyżka), sól (szczypta)',
    '1. Przełóż twaróg do miski. 2. Pokrój rzodkiewkę w cienkie plastry. 3. Posiekaj szczypiorek. 4. Wymieszaj wszystkie składniki.',
    'słona',
    'dom',
    'redukcja',
    'wegetariańska',
    135,
    16.4,
    4.8,
    5.1,
    1.8
),
(
    'Krakersy pełnoziarniste z serem',
    'Chrupiące krakersy pełnoziarniste z plasterkmi sera żółtego. Szybka przekąska do pracy.',
    'krakersy pełnoziarniste (6 sztuk), ser żółty (30g)',
    '1. Ułóż krakersy na talerzu. 2. Pokrój ser w cienkie plasterki. 3. Połóż po jednym plasterku sera na każdym krakersie.',
    'słona',
    'praca',
    'utrzymanie',
    'wegetariańska',
    210,
    9.7,
    12.3,
    17.5,
    2.4
),
-- lekkie przekąski (light snacks)
(
    'Sałatka z ogórka i pomidora',
    'Orzeźwiająca sałatka z młodego ogórka i pomidorów koktajlowych z oliwą i ziołami.',
    'ogórek (1 sztuka), pomidory koktajlowe (150g), oliwa z oliwek (1 łyżka), bazylia (kilka listków), sól (szczypta)',
    '1. Pokrój ogórek w plastry. 2. Przekrój pomidory na połówki. 3. Wymieszaj z oliwą i bazylią. 4. Dopraw solą.',
    'lekka',
    'poza domem',
    'redukcja',
    'wegańska',
    95,
    2.1,
    6.8,
    8.4,
    2.9
),
(
    'Arbuz z miętą',
    'Soczysty arbuz z listkami świeżej mięty. Idealna przekąska na gorące dni.',
    'arbuz (200g), mięta (kilka listków)',
    '1. Pokrój arbuz w kostki. 2. Posiekaj miętę. 3. Wymieszaj delikatnie i podawaj schłodzone.',
    'lekka',
    'dom',
    'redukcja',
    'wegańska',
    60,
    1.2,
    0.3,
    13.8,
    1.1
),
(
    'Surówka z kapusty pekińskiej',
    'Lekka surówka z kapusty pekińskiej z oliwą i sokiem z cytryny.',
    'kapusta pekińska (100g), oliwa (1 łyżeczka), sok z cytryny (1 łyżeczka), sól (szczypta)',
    '1. Poszatkuj kapustę w cienkie paski. 2. Polej oliwą i sokiem z cytryny. 3. Dopraw solą i wymieszaj.',
    'lekka',
    'praca',
    'redukcja',
    'wegańska',
    45,
    1.8,
    2.1,
    4.2,
    2.3
),
(
    'Koktajl zielony ze szpinakiem',
    'Zdrowy koktajl ze świeżego szpinaku, jabłka i wody kokosowej.',
    'szpinak baby (50g), jabłko (1 sztuka), woda kokosowa (200ml), sok z limonki (1 łyżeczka)',
    '1. Wszystkie składniki włóż do blendera. 2. Miksuj 1-2 minuty. 3. Przelej do szklanki i podawaj.',
    'lekka',
    'dom',
    'redukcja',
    'wegańska',
    85,
    2.4,
    0.8,
    18.6,
    3.1
),
(
    'Herbata zielona z cytryną',
    'Aromatyczna herbata zielona z plasterkiem cytryny i odrobiną miodu.',
    'herbata zielona (1 torebka), cytryna (1 plasterek), miód (1 łyżeczka), woda (250ml)',
    '1. Zaparz herbatę wrzątkiem na 3 minuty. 2. Dodaj plasterek cytryny. 3. Dosłódź miodem do smaku.',
    'lekka',
    'praca',
    'utrzymanie',
    'wegańska',
    25,
    0.1,
    0.0,
    6.2,
    0.0
),
-- sycące przekąski (filling snacks)
(
    'Kanapka z pastą z awokado i jajkiem',
    'Sycąca kanapka z pastą z awokado, gotowanym jajkiem i rukolą na chlebie graham.',
    'chleb graham (2 kromki), awokado (1 sztuka), jajko ugotowane na twardo (1 sztuka), rukola (garść), sól (szczypta)',
    '1. Opiecz chleb. 2. Przygotuj pastę z awokado. 3. Posmaruj chleb pastą. 4. Dodaj plastry jajka i rukolę.',
    'sycąca',
    'praca',
    'przyrost',
    'wegetariańska',
    385,
    16.8,
    24.2,
    29.1,
    9.4
),
(
    'Omlet z warzywami',
    'Puszysty omlet z papryką, cebulą i szpinakiem. Bogaty w białko i witaminy.',
    'jajka (3 sztuki), papryka (50g), cebula (1/4 sztuki), szpinak (garść), olej (1 łyżka), sól (szczypta)',
    '1. Rozbij jajka i ubij. 2. Podsmaż warzywa na patelni. 3. Dodaj jajka i smaż omlet. 4. Podawaj na gorąco.',
    'sycąca',
    'dom',
    'przyrost',
    'wegetariańska',
    295,
    19.4,
    21.7,
    6.8,
    2.1
),
(
    'Kasza jaglana z warzywami',
    'Pożywna kasza jaglana z duszonymi warzywami i ziołami prowansalskimi.',
    'kasza jaglana (60g), marchewka (50g), cukinia (50g), cebula (1/4 sztuki), bulion warzywny (150ml), zioła prowansalskie (szczypta)',
    '1. Ugotuj kaszę w bulionie. 2. Podsmaż warzywa. 3. Wymieszaj kaszę z warzywami. 4. Dopraw ziołami.',
    'sycąca',
    'dom',
    'utrzymanie',
    'wegańska',
    245,
    7.8,
    4.2,
    44.6,
    4.1
),
(
    'Wrap z kurczakiem i warzywami',
    'Sycący wrap z grillowanym kurczakiem, świeżymi warzywami i sosem czosnkowym.',
    'tortilla pełnoziarnista (1 sztuka), filet z kurczaka (80g), sałata (2 liście), pomidor (1/2 sztuki), ogórek (1/4 sztuki), sos czosnkowy (1 łyżka)',
    '1. Upiecz kurczaka na grillu. 2. Pokrój warzywa. 3. Rozłóż składniki na tortilli. 4. Zwiń w wrap.',
    'sycąca',
    'praca',
    'przyrost',
    'standard',
    320,
    26.4,
    11.8,
    28.7,
    4.2
),
(
    'Quinoa z pieczonymi warzywami',
    'Pieczona quinoa z sezonowymi warzywami i orzechami piniowymi.',
    'quinoa (50g), batat (100g), brokuły (80g), orzechy piniowe (15g), oliwa (1 łyżka), tymianek (szczypta)',
    '1. Ugotuj quinoa. 2. Upiecz warzywa w piekarniku. 3. Wymieszaj z orzechami. 4. Skrop oliwą i posyp tymiankiem.',
    'sycąca',
    'dom',
    'utrzymanie',
    'wegańska',
    285,
    9.6,
    12.4,
    36.8,
    6.7
),
-- dodatkowe snacki dla różnorodności
(
    'Bułka pełnoziarnista z masłem orzechowym',
    'Pożywna bułka pełnoziarnista z naturalnym masłem orzechowym i plasterkami banana.',
    'bułka pełnoziarnista (1 sztuka), masło orzechowe (2 łyżki), banan (1/2 sztuki)',
    '1. Przekrój bułkę na pół. 2. Posmaruj masłem orzechowym. 3. Ułóż plasterki banana.',
    'słodka',
    'praca',
    'przyrost',
    'wegańska',
    345,
    12.8,
    16.7,
    38.4,
    6.2
),
(
    'Koktajl proteinowy z owocami',
    'Odżywczy koktajl z protein roślinnych, bananem i jagodami.',
    'protein roślinny (25g), banan (1 sztuka), jagody (50g), mleko migdałowe (250ml)',
    '1. Wszystkie składniki wrzuć do blendera. 2. Miksuj 1 minutę. 3. Podawaj od razu.',
    'słodka',
    'poza domem',
    'przyrost',
    'wegańska',
    265,
    22.4,
    4.8,
    32.1,
    5.9
),
(
    'Sałatka grecka mini',
    'Miniaturowa wersja klasycznej sałatki greckiej z fetą i oliwkami.',
    'pomidory koktajlowe (100g), ogórek (50g), ser feta (30g), oliwki kalamata (6 sztuk), oliwa (1 łyżka)',
    '1. Pokrój warzywa w kostki. 2. Dodaj pokruszoną fetę. 3. Wymieszaj z oliwkami i oliwą.',
    'słona',
    'poza domem',
    'utrzymanie',
    'wegetariańska',
    165,
    7.2,
    13.4,
    6.8,
    2.1
),
(
    'Grzanki z pomidorem i bazylią',
    'Aromatyczne grzanki z świeżymi pomidorami i bazylią.',
    'chleb ciabatta (2 kromki), pomidor (1 sztuka), bazylia (kilka listków), czosnek (1/2 ząbka), oliwa (1 łyżka)',
    '1. Opiecz chleb. 2. Potrzyj czosnkiem. 3. Pokrój pomidora w kostki. 4. Ułóż na chlebie z bazylią.',
    'słona',
    'dom',
    'utrzymanie',
    'wegańska',
    155,
    4.8,
    6.2,
    21.4,
    2.8
),
(
    'Pudding czekoladowy z awokado',
    'Kremowy pudding czekoladowy z awokado bez dodatku cukru.',
    'awokado (1 sztuka), kakao (2 łyżki), syrop daktylowy (2 łyżki), mleko kokosowe (50ml)',
    '1. Zmiksuj wszystkie składniki na gładką masę. 2. Schłódź w lodówce 30 minut. 3. Podawaj w pucharach.',
    'słodka',
    'dom',
    'redukcja',
    'wegańska',
    185,
    4.2,
    14.6,
    18.9,
    7.1
);

-- create indexes for better query performance
create index if not exists idx_snacks_snack_type on public.snacks(snack_type);
create index if not exists idx_snacks_location on public.snacks(location);
create index if not exists idx_snacks_goal on public.snacks(goal);
create index if not exists idx_snacks_preferred_diet on public.snacks(preferred_diet);

-- update table statistics for better query planning
analyze public.snacks; 