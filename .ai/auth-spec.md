# Specyfikacja modułu autentykacji

## 1. Architektura interfejsu użytkownika

### Layouty i nawigacja
- Główne layouty:
  - `src/layouts/PublicLayout.astro`: header z przyciskami "Zaloguj" i "Zarejestruj" w prawym górnym rogu, wykorzystywany na stronach publicznych, w tym stronie powitalnej (`/`).
  - `src/layouts/AuthLayout.astro`: header z przyciskiem "Wyloguj" w prawym górnym rogu i linkami do stron chronionych, wykorzystywany po zalogowaniu.
- Strona powitalna (`/`):
  - Plik: `src/pages/index.astro` korzysta z `PublicLayout.astro`.
  - Zawartość: krótki opis aplikacji, przyciski CTA "Zarejestruj"/"Zaloguj".
  - Dostępna dla wszystkich użytkowników (zalogowanych i niezalogowanych).
- Dekompozycja/aktualizacja `src/layouts/Layout.astro` na bazie PublicLayout i AuthLayout w celu zachowania spójności.
- Aktualizacja importów w plikach stron:
  - Publiczne strony (`src/pages/index.astro`, `register.astro`, `login.astro`, `reset-password.astro`, `reset-password/[token].astro`): zamiana `import Layout` na `import PublicLayout`.
  - Chronione strony (główny formularz generowania przekąsek, lista ulubionych, szczegóły ulubionych): zamiana `import Layout` na `import AuthLayout`.

### Mapowanie stron chronionych
Zgodnie z PRD, następujące strony wymagają uwierzytelnienia:
- Główny formularz generowania przekąsek (prawdopodobnie `/generate` lub `/dashboard`)
- Lista ulubionych przekąsek (`/favorites`)
- Szczegóły ulubionej przekąski (`/favorites/[id]`)
- Wszystkie inne strony związane z zarządzaniem kontem użytkownika

### Strony i komponenty
- `src/pages/register.astro`
  - Komponent React: `src/components/Auth/RegisterForm.tsx`
    - Pola: `email`, `password`, `confirmPassword`
    - Walidacja: email regex, długość hasła ≥ 8, zgodność haseł.
- `src/pages/login.astro`
  - Komponent React: `src/components/Auth/LoginForm.tsx`
    - Pola: `email`, `password`
    - Walidacja: email, hasło niepuste.
- `src/pages/reset-password.astro` (request)
  - Komponent React: `src/components/Auth/PasswordResetRequestForm.tsx`
    - Pole: `email`
    - Walidacja: email.
- `src/pages/reset-password/[token].astro` (confirm)
  - Komponent React: `src/components/Auth/PasswordResetForm.tsx`
    - Pola: `password`, `confirmPassword`
    - Walidacja jak przy rejestracji.

### Integracja UI ↔ API
- Formularze rejestracji, logowania i resetu hasła wysyłają żądania HTTP POST z `application/json` body do endpointów:
  - `/api/auth/register` (RegisterDTO)
  - `/api/auth/login` (LoginDTO)
  - `/api/auth/logout` (brak body)
  - `/api/auth/reset-password` (PasswordResetRequestDTO)
  - `/api/auth/reset-password/:token` (PasswordResetDTO)
- Po otrzymaniu odpowiedzi HTTP:
  - `200 OK` przy rejestracji/login → przekierowanie do głównej strony aplikacji (pierwsza chroniona strona - formularz generowania przekąsek).
  - `200 OK` przy żądaniu resetu → komunikat o wysłanym mailu.
  - `200 OK` przy potwierdzeniu resetu → przekierowanie do `/login`.
- Błędy `400`, `401`, `409` → wyświetlanie komunikatów pod formularzem lub toast.
- Przyciski submit blokują się i pokazują spinner (komponent `Button` z `shadcn/ui`).

### Przypadki walidacji i komunikaty błędów
- Błędy walidacji front-end:
  - Brakujące/nieprawidłowe dane → komunikat pod polem.
- Błędy po stronie backend:
  - Email już istnieje → alert toast.
  - Niepoprawne dane logowania → komunikat ogólny.
  - Token nieważny → bezpośrednio na stronie resetu.

### Scenariusze:
1. Rejestracja poprawna/niepoprawna.
2. Logowanie poprawne/niepoprawne.
3. Wylogowanie.
4. Żądanie resetu hasła.
5. Reset hasła z tokenem.

## 2. Logika backendowa

### Struktura endpointów (Astro pages API)
- `src/pages/api/auth/register.ts`
- `src/pages/api/auth/login.ts`
- `src/pages/api/auth/logout.ts`
- `src/pages/api/auth/reset-password.ts`
- `src/pages/api/auth/reset-password/[token].ts`
- Każdy endpoint:
  - `export const prerender = false;`
  - Eksportuje `POST({ request, locals })` z logiką:
    - Walidacja `body` przez `zod` (schema w `src/lib/validators/auth.ts`).
    - Wywołanie metod Supabase Auth przez `locals.supabase`:
      - `signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail`, `updateUser`.
    - Obsługa błędów i zwracanie statusów `400`, `401`, `409`, `500` z JSON `{ message }`.

### Modele danych i DTO
- `src/types.ts`:
  - `RegisterDTO { email: string; password: string; }`
  - `LoginDTO { email: string; password: string; }`
  - `PasswordResetRequestDTO { email: string; }`
  - `PasswordResetDTO { token: string; newPassword: string; }`

### Mechanizm walidacji
- Zod schemas w `src/lib/validators/auth.ts`.
- Schematy dla każdego DTO.
- Walidacja w handlerach przed wykonaniem logiki biznesowej.

### Obsługa wyjątków
- `try/catch` w każdym endpointzie.
- Zwracanie odpowiednich kodów:
  - 400 Bad Request (walidacja).
  - 401 Unauthorized (login/nieprawny token).
  - 409 Conflict (rejestracja, gdy email już istnieje).
  - 500 Internal Server Error (nieoczekiwane).

### Middleware i SSR
- W `astro.config.mjs` definiowanie zmiennych środowiskowych: `SUPABASE_URL` i `SUPABASE_KEY`.
- Rozszerzenie `src/middleware/index.ts`:
  1. Import `createMiddlewareClient` z `@supabase/auth-helpers/astro`.
  2. W `onRequest`:
     - Utworzenie klienta: `const supabase = createMiddlewareClient({ context });`
     - Pobranie sesji: `const { data: { session } } = await supabase.auth.getSession();`
     - `context.locals.supabase = supabase;`
     - `context.locals.session = session;`
     - Lista publicznych ścieżek: `/`, `/login`, `/register`, `/reset-password`, `/reset-password/:token`, `/api/auth/*`.
     - Jeśli ruta chroniona i brak `session` → `return context.redirect('/login');`
     - Jeśli użytkownik zalogowany próbuje dostać się do `/login` lub `/register` → `return context.redirect('/generate');` (lub główna strona aplikacji).
  3. `return next();`

## 3. System autentykacji (Supabase Auth)

### Bezpieczeństwo i zarządzanie hasłami
- Supabase Auth zapewnia bezpieczne hashowanie i przechowywanie haseł.
- Sesje i tokeny są przechowywane przez supabase-js w localStorage i automatycznie odświeżane.
- Ochrona danych i RLS
- Włączone Row-Level Security w bazie Supabase.
- Tabele użytkowników i zasobów:
  - `users`: dane osobowe dostępne tylko dla `auth.uid()`.
  - `favorites`, `history`: operacje dozwolone gdy `user_id = auth.uid()`.

### Rejestracja
- `supabaseClient.auth.signUp({ email, password })`
- Weryfikacja maila (link magic link lub OTP).
- Obsługa callbacków i przekierowań.

### Logowanie
- `supabaseClient.auth.signInWithPassword({ email, password })`
- Supabase-js domyślnie przechowuje tokeny w localStorage, automatycznie odświeżając je.
- Monitorowanie zmian stanu autoryzacji za pomocą `supabaseClient.auth.onAuthStateChange`.

### Wylogowanie
- `supabaseClient.auth.signOut()`
- Usunięcie cookie/localStorage.
- Przekierowanie do `/` (strona powitalna).

### Odzyskiwanie hasła
- Request: `supabaseClient.auth.resetPasswordForEmail(email, { redirectTo })`
- Confirmation: `supabaseClient.auth.updateUser({ password: newPassword })` z tokenem.
- Scenariusz: nieważny lub wygasły token → endpoint zwraca 401 oraz komunikat o konieczności ponownego żądania resetu.

### Środowisko i zmienne
- Zmienne środowiskowe:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
- Plik `src/db/supabase.client.ts` inicjalizuje `supabaseClient` na podstawie tych zmiennych

## 4. Zgodność z wymaganiami PRD

### Realizacja User Stories
- **US-001 (Rejestracja)**: Realizowana przez `/register` z RegisterForm.tsx
- **US-002 (Logowanie)**: Realizowana przez `/login` z LoginForm.tsx  
- **US-003 (Wylogowanie)**: Przycisk "Wyloguj" w AuthLayout, przekierowanie do `/`
- **US-011 (Ochrona danych)**: Supabase Auth + RLS
- **US-012 (Bezpieczny dostęp)**: 
  - Dedykowane strony logowania/rejestracji ✓
  - Email + hasło ✓
  - Potwierdzenie hasła przy rejestracji ✓
  - Brak dostępu bez logowania (poza stroną powitalną) ✓
  - Przyciski w prawym górnym rogu ✓
  - Brak zewnętrznych serwisów logowania ✓
  - Odzyskiwanie hasła ✓

### Przepływ użytkownika zgodny z PRD
1. Użytkownik wchodzi na `/` (strona powitalna)
2. Klika "Zarejestruj" lub "Zaloguj" 
3. Po pomyślnej rejestracji/logowaniu → przekierowanie do głównej funkcjonalności aplikacji
4. Dostęp do formularza generowania przekąsek i zarządzania ulubionymi
5. Możliwość wylogowania z powrotem na stronę powitalną
