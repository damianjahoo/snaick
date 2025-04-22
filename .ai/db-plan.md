# Schemat bazy danych PostgreSQL

## 1. Lista tabel z ich kolumnami, typami danych i ograniczeniami

### a. Tabela `users`

Tabela zarządzana przez Supabase Auth.

- **id**: SERIAL PRIMARY KEY
- **email**: VARCHAR NOT NULL UNIQUE
- **password_hash**: VARCHAR NOT NULL
- **created_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

*Uwagi:* Przechowuje podstawowe dane użytkownika z możliwością przyszłej rozbudowy.

### b. Tabela `snacks`
- **id**: SERIAL PRIMARY KEY
- **title**: TEXT NOT NULL
- **description**: TEXT
- **ingredients**: TEXT
- **instructions**: TEXT
- **snack_type**: snack_type_enum NOT NULL
- **location**: location_enum NOT NULL
- **goal**: goal_enum NOT NULL
- **preferred_diet**: preferred_diet_enum NOT NULL
- **kcal**: NUMERIC NOT NULL CHECK (kcal >= 0)
- **protein**: NUMERIC NOT NULL CHECK (protein >= 0)
- **fat**: NUMERIC NOT NULL CHECK (fat >= 0)
- **carbohydrates**: NUMERIC NOT NULL CHECK (carbohydrates >= 0)
- **fibre**: NUMERIC NOT NULL CHECK (fibre >= 0)
- **created_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

*Uwagi:* Przechowuje dane akceptowanych przekąsek. Dane pochodzą zarówno z pliku JSON (np. title, description) jak i formularza (typ przekąski, lokalizacja, cel, preferowana dieta). Informacje odżywcze są rozbite na osobne kolumny.

### c. Tabela `user_favourites`
- **user_id**: INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **snack_id**: INTEGER NOT NULL REFERENCES snacks(id) ON DELETE CASCADE
- **added_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- **PRIMARY KEY**: (user_id, snack_id)

*Uwagi:* Tabela łącząca użytkowników z ich ulubionymi przekąskami.

## 2. Relacje między tabelami

- Relacja jeden-do-wielu między `users` a `user_favourites`: Jeden użytkownik może mieć wiele ulubionych przekąsek.
- Relacja jeden-do-wielu między `snacks` a `user_favourites`: Jedna przekąska może być ulubioną dla wielu użytkowników.
- Klucze obce w tabeli `user_favourites` zapewniają spójność danych z tabelami `users` oraz `snacks`.

## 3. Indeksy

- Klucze podstawowe (`users.id`, `snacks.id`) są indeksowane automatycznie.
- Tabela `user_favourites` posiada zdefiniowany klucz główny (kompozytowy), co tworzy indeks na kolumnach `user_id` i `snack_id`.
- Dodatkowe indeksy mogą być dodane na kolumnach często wykorzystywanych w zapytaniach (np. `snack_type`, `location`).

## 4. Zasady PostgreSQL (RLS)

- Włączone mechanizmy Row-Level Security (RLS) na tabelach `users`, `snacks` oraz `user_favourites`:
  - Przykład: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`
  - Dodatkowo należy zaimplementować polityki RLS, które ograniczają dostęp do danych wyłącznie do właścicieli rekordów lub uprawnionych użytkowników.

## 5. Dodatkowe uwagi i wyjaśnienia

- **Typy ENUM** zostały zdefiniowane dla następujących pól:
  - `snack_type_enum`: ENUM ('słodka', 'słona', 'lekka', 'sycąca')
  - `location_enum`: ENUM ('praca', 'dom', 'sklep', 'poza domem')
  - `goal_enum`: ENUM ('utrzymanie', 'redukcja', 'przyrost')
  - `preferred_diet_enum`: ENUM ('standard', 'wegetariańska', 'wegańska', 'bezglutenowa')

  *Uwaga:* Enumy te są skonstruowane z myślą o możliwości rozszerzania wartości w przyszłości.

- Schemat został zaprojektowany z myślą o migracjach i skalowalności, umożliwiając przyszłe rozszerzenie funkcjonalności.
- Bezpośrednie mapowanie odpowiedzi z LLM do struktury tabel umożliwia szybki zapis danych do bazy.
- Standardowe indeksy na kluczach obcych poprawią wydajność zapytań. 