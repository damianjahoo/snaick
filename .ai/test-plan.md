# Test plan dla Projektu SnAIck

## 1. Wprowadzenie i Cele Testowania

### 1.1 Cel Dokumentu
Niniejszy plan testów określa strategię, zakres oraz procedury testowania aplikacji SnAIck - platformy do generowania spersonalizowanych rekomendacji przekąsek przy użyciu sztucznej inteligencji.

### 1.2 Cele Testowania
- **Zapewnienie jakości** - weryfikacja zgodności z wymaganiami funkcjonalnymi i niefunkcjonalnymi
- **Bezpieczeństwo** - walidacja systemów autentykacji, autoryzacji i ochrony danych użytkowników
- **Niezawodność** - potwierdzenie stabilności integracji z zewnętrznymi usługami (Supabase, OpenRouter.ai)
- **Wydajność** - sprawdzenie responsywności aplikacji i optymalizacji SSR/CSR
- **Kompatybilność** - weryfikacja działania na różnych urządzeniach i przeglądarkach
- **Dostępność** - zapewnienie zgodności z standardami WCAG 2.1

### 1.3 Kryteria Sukcesu MVP
- 80% zarejestrowanych użytkowników generuje co najmniej jedną sugestię przekąski
- 60% zarejestrowanych użytkowników zapisuje co najmniej jedną przekąskę jako ulubioną
- >90% wskaźnik ukończenia procesu od wypełnienia formularza do wygenerowania sugestii
- <50% wskaźnik odrzucenia sugestii i generowania nowych

## 2. Zakres Testów

### 2.1 Obszary Objęte Testami

#### 2.1.1 Funkcjonalności Core
- ✅ System rejestracji i logowania użytkowników
- ✅ Formularz preferencji dietetycznych i ograniczeń
- ✅ Generator przekąsek AI z wykorzystaniem OpenRouter.ai
- ✅ System zarządzania ulubionymi przekąskami
- ✅ API endpoints dla wszystkich operacji CRUD
- ✅ Middleware autoryzacji i sesji

#### 2.1.2 Integracje
- ✅ Integracja z bazą danych Supabase (PostgreSQL)
- ✅ Integracja z OpenRouter.ai (różne modele LLM)
- ✅ System autentykacji Supabase
- ✅ Row Level Security (RLS) policies

#### 2.1.3 Interfejs Użytkownika
- ✅ Responsywność na urządzeniach mobilnych i desktopowych
- ✅ Komponenty Shadcn/ui i ich interakcje
- ✅ Nawigacja i routing Astro

### 2.2 Obszary Wyłączone z Testów
- ❌ Automatyczne śledzenie kalorii i posiłków (poza zakresem MVP)
- ❌ Integracja z aplikacjami fitness/dietetetycznymi
- ❌ System oceniania i komentowania przekąsek
- ❌ Zaawansowane mechanizmy walidacji jakości odpowiedzi LLM
- ❌ Monitoring kosztów i limitów zapytań LLM

## 3. Typy Testów do Przeprowadzenia

### 3.1 Testy Jednostkowe (Unit Tests)
**Narzędzia:** Vitest
**Pokrycie:** ≥80% kodu

#### 3.1.1 Komponenty React
- Komponenty UI (formularze, przyciski, modale)
- Hooki niestandardowe (useFavorites, useFavoriteDetails, useModal)
- Logika walidacji formularzy
- Komponenty wizualizacji danych (wykresy wartości odżywczych)

#### 3.1.2 Usługi i Utilities
- `ai.service.ts` - logika komunikacji z OpenRouter.ai
- `favorite.service.ts` - operacje CRUD na ulubionych
- `snack.service.ts` - zarządzanie danymi przekąsek
- Mappery DTO ↔ Entity
- Funkcje walidacji (Zod schemas)
- Utility functions

#### 3.1.3 Typy i Modele Danych
- Walidacja TypeScript DTOs
- Testy mapowania typów bazy danych
- Walidacja JSON Schema dla odpowiedzi AI

### 3.2 Testy Integracyjne (Integration Tests)
**Narzędzia:** Playwright

#### 3.2.1 API Endpoints
- `POST /api/auth/register` - rejestracja użytkowników
- `POST /api/auth/login` - logowanie użytkowników
- `POST /api/snacks/generate` - generowanie przekąsek AI
- `GET /api/favorites` - lista ulubionych z paginacją
- `POST /api/favorites` - dodawanie do ulubionych
- `DELETE /api/favorites/{id}` - usuwanie z ulubionych
- `GET /api/snacks` - historia wygenerowanych przekąsek

#### 3.2.2 Integracja z Bazą Danych
- CRUD operations na tabeli `snacks`
- CRUD operations na tabeli `user_favourites`
- Walidacja RLS policies
- Testy migracji bazy danych
- Testy transakcji i rollback'ów

#### 3.2.3 Integracja z OpenRouter.ai
- Różne modele AI (GPT-4, Claude, Gemini)
- Obsługa błędów API (rate limits, timeouts)
- Walidacja struktury odpowiedzi JSON
- Fallback mechanisms

### 3.3 Testy End-to-End (E2E Tests)
**Narzędzie:** Playwright  
**Pokrycie:** Kluczowe user journeys

#### 3.3.1 Główne Scenariusze Użytkownika
1. **Pełny flow rejestracji i pierwszej rekomendacji**
   - Rejestracja nowego użytkownika
   - Wypełnienie formularza preferencji
   - Wygenerowanie pierwszej przekąski
   - Dodanie do ulubionych

2. **Flow powracającego użytkownika**
   - Logowanie
   - Generowanie nowej przekąski
   - Przeglądanie ulubionych
   - Usuwanie z ulubionych

3. **Flow zarządzania kontem**
   - Wylogowanie

#### 3.3.2 Testy Wieloplatformowe
- Desktop (Chrome, Firefox, Safari)
- Mobile (iOS Safari, Android Chrome)
- Różne rozdzielczości ekranu

### 3.4 Testy Wydajnościowe (Performance Tests)
**Narzędzia:** Lighthouse, WebPageTest, K6

#### 3.4.1 Metryki Core Web Vitals
- **LCP** (Largest Contentful Paint) ≤ 2.5s
- **FID** (First Input Delay) ≤ 100ms
- **CLS** (Cumulative Layout Shift) ≤ 0.1

### 3.5 Testy Bezpieczeństwa (Security Tests)
**Narzędzia:** OWASP ZAP, Burp Suite Community

#### 3.5.1 Autentykacja i Autoryzacja
- Testy bypass'u autentykacji
- Walidacja tokenów sesji
- Testy privilege escalation
- SQL injection prevention

#### 3.5.2 Ochrona Danych
- Walidacja RLS policies
- Testy CSRF protection
- XSS prevention
- Secure headers validation

### 3.6 Testy Dostępności (Accessibility Tests)
**Narzędzia:** Axe, WAVE, Lighthouse Accessibility

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

### 4.1 System Autentykacji

#### TC-AUTH-001: Rejestracja użytkownika - happy path
**Kroki:**
1. Przejdź na `/register`
2. Wypełnij email: `test@example.com`
3. Wypełnij hasło: `Test123!@#`
4. Potwierdź hasło: `Test123!@#`
5. Kliknij "Zarejestruj się"

**Oczekiwany wynik:**
- Użytkownik zostaje przekierowany na stronę główną
- Sesja zostaje utworzona
- Rekord użytkownika pojawia się w bazie danych

#### TC-AUTH-002: Rejestracja - walidacja hasła
**Kroki:**
1. Przejdź na `/register`
2. Wypełnij email: `test@example.com`
3. Wypełnij hasło: `123` (za słabe)
4. Kliknij "Zarejestruj się"

**Oczekiwany wynik:**
- Wyświetla się błąd walidacji hasła
- Rejestracja nie zostaje wykonana

#### TC-AUTH-003: Logowanie - poprawne dane
**Warunki wstępne:** Użytkownik test@example.com istnieje
**Kroki:**
1. Przejdź na `/login`
2. Wypełnij email: `test@example.com`
3. Wypełnij hasło: `Test123!@#`
4. Kliknij "Zaloguj się"

**Oczekiwany wynik:**
- Przekierowanie na stronę główną
- Sesja użytkownika zostaje utworzona

### 4.2 Generator Przekąsek AI

#### TC-AI-001: Generowanie przekąski - kompletny formularz
**Warunki wstępne:** Użytkownik zalogowany
**Kroki:**
1. Przejdź na `/generate`
2. Wypełnij "Posiłki dzisiaj": "Śniadanie: owsianka z owocami, Obiad: grillowany kurczak z warzywami"
3. Wybierz typ przekąski: "Słodka"
4. Wybierz lokalizację: "W domu"
5. Wybierz cel: "Zdrowe odżywianie"
6. Wybierz dietę: "Wegetariańska"
7. Dodaj ograniczenia: "Bez orzechów"
8. Ustaw limit kalorii: 200
9. Kliknij "Wygeneruj przekąskę"

**Oczekiwany wynik:**
- Wyświetla się loader podczas generowania
- Pojawia się karta z sugestią przekąski zawierająca:
  - Nazwę przekąski
  - Opis
  - Listę składników
  - Instrukcje przygotowania
  - Wartości odżywcze (kalorie, białko, tłuszcze, węglowodany, błonnik)
- Przycisk "Dodaj do ulubionych"

#### TC-AI-002: Obsługa błędu API OpenRouter
**Warunki wstępne:** OpenRouter.ai niedostępny (symulacja)
**Kroki:**
1. Wypełnij formularz generowania przekąski
2. Kliknij "Wygeneruj przekąskę"

**Oczekiwany wynik:**
- Wyświetla się komunikat błędu: "Usługa AI jest chwilowo niedostępna. Spróbuj ponownie za chwilę."
- Przycisk "Spróbuj ponownie"

### 4.3 System Ulubionych

#### TC-FAV-001: Dodawanie przekąski do ulubionych
**Warunki wstępne:** 
- Użytkownik zalogowany
- Wygenerowana przekąska wyświetlona
**Kroki:**
1. Kliknij "Dodaj do ulubionych" przy wygenerowanej przekąsce
2. Przejdź na `/favorites`

**Oczekiwany wynik:**
- Komunikat potwierdzenia: "Przekąska dodana do ulubionych"
- Przekąska pojawia się na liście ulubionych
- Data dodania jest aktualna

#### TC-FAV-002: Usuwanie z ulubionych
**Warunki wstępne:** Użytkownik ma przekąski w ulubionych
**Kroki:**
1. Przejdź na `/favorites`
2. Kliknij ikonę kosza przy przekąsce
3. Potwierdź usunięcie w modal'u

**Oczekiwany wynik:**
- Modal potwierdzenia z tekstem "Czy na pewno chcesz usunąć tę przekąskę z ulubionych?"
- Po potwierdzeniu przekąska znika z listy
- Komunikat: "Przekąska usunięta z ulubionych"

#### TC-FAV-003: Paginacja ulubionych
**Warunki wstępne:** Użytkownik ma >10 ulubionych przekąsek
**Kroki:**
1. Przejdź na `/favorites`
2. Przewiń do końca listy
3. Kliknij "Wczytaj więcej"

**Oczekiwany wynik:**
- Następne 10 przekąsek zostaje załadowanych
- Loader podczas ładowania
- Smooth scroll do nowych elementów

## 5. Środowisko Testowe

### 5.1 Środowiska

#### 5.1.1 Development (DEV)
- **URL:** `http://localhost:3000`
- **Baza danych:** Supabase local development
- **AI Service:** OpenRouter.ai (klucz testowy z limitami)
- **Cel:** Testy lokalne podczas development'u

#### 5.1.2 Staging (STG)
- **URL:** `https://snaick-staging.vercel.app`
- **Baza danych:** Supabase staging project
- **AI Service:** OpenRouter.ai (klucz staging)
- **Cel:** Testy integracyjne i E2E przed release

#### 5.1.3 Production (PROD)
- **URL:** `https://snaick.com`
- **Baza danych:** Supabase production
- **AI Service:** OpenRouter.ai (klucz produkcyjny)
- **Cel:** Smoke tests i monitoring

### 5.2 Dane Testowe

#### 5.2.1 Użytkownicy Testowi
```sql
-- Staging database seed data
INSERT INTO auth.users (email, encrypted_password) VALUES 
('test.user@example.com', 'hashed_password'),
('power.user@example.com', 'hashed_password'),
('edge.case@example.com', 'hashed_password');
```

#### 5.2.2 Przekąski Testowe
- 50 przykładowych przekąsek różnych typów
- 100 rekordów w tabeli user_favourites
- Różne kombinacje ograniczeń dietetycznych

### 5.3 Konfiguracja CI/CD

#### 5.3.1 GitHub Actions Pipeline
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - run: npm run test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright install
      - run: npm run test:e2e
```

## 6. Narzędzia do Testowania

### 6.1 Testy Jednostkowe i Integracyjne
- **Vitest** - test runner, szybkie wykonanie
- **React Testing Library** - testowanie komponentów React
- **@testing-library/jest-dom** - custom matchers
- **MSW (Mock Service Worker)** - mockowanie API calls

### 6.2 Testy End-to-End
- **Playwright** - wieloplatformowe testy E2E
- **@playwright/test** - runner z wbudowanymi assertions
- **playwright-lighthouse** - audyty wydajności

### 6.3 Testy Wydajnościowe
- **Lighthouse CI** - automatyczne audyty Core Web Vitals
- **K6** - testy obciążeniowe API
- **WebPageTest** - szczegółowa analiza wydajności

### 6.4 Testy Bezpieczeństwa
- **OWASP ZAP** - automatyczne skanowanie bezpieczeństwa
- **npm audit** - skanowanie zależności
- **Snyk** - ciągłe monitorowanie vulnerability

### 6.5 Testy Dostępności
- **axe-playwright** - automatyczne testy a11y
- **WAVE** - manualna walidacja dostępności
- **Screen Reader** - testowanie z NVDA/JAWS

### 6.6 Narzędzia Wspomagające
- **Faker.js** - generowanie danych testowych
- **Storybook** - dokumentacja i testy wizualne komponentów
- **Percy** - visual regression testing
- **Codecov** - raportowanie coverage

## 7. Harmonogram Testów

### 7.1 Faza 1: Przygotowanie (Tydzień 1)
- ✅ Konfiguracja środowisk testowych
- ✅ Setup narzędzi (Vitest, Playwright, itd.)
- ✅ Przygotowanie danych testowych i seed'ów
- ✅ Utworzenie repo z testami i CI/CD pipeline

### 7.2 Faza 2: Testy Podstawowe (Tydzień 2-3)
- ✅ Testy jednostkowe (80% coverage)
- ✅ Testy integracyjne API endpoints
- ✅ Podstawowe testy E2E (happy paths)
- ✅ Testy bezpieczeństwa (autentykacja, autoryzacja)

### 7.3 Faza 3: Testy Zaawansowane (Tydzień 4)
- ✅ Testy wydajnościowe (Core Web Vitals)
- ✅ Testy dostępności (WCAG 2.1)
- ✅ Edge cases i error handling
- ✅ Cross-browser testing

### 7.4 Faza 4: Finalizacja (Tydzień 5)
- ✅ Regression testing
- ✅ Load testing (obciążeniowe)
- ✅ Security penetration testing
- ✅ Documentation i raportowanie

### 7.5 Ciągłe Testowanie (Post-release)
- 🔄 Smoke tests po każdym deployment
- 🔄 Monitoring wydajności (Real User Monitoring)
- 🔄 Testy regresyjne przed każdym release
- 🔄 Security scanning (dependency updates)

## 8. Kryteria Akceptacji Testów

### 8.1 Kryteria Przejścia (Pass Criteria)

#### 8.1.1 Pokrycie Kodu
- **Unit Tests:** ≥80% line coverage
- **Integration Tests:** 100% API endpoints
- **E2E Tests:** 100% critical user journeys

#### 8.1.2 Wydajność
- **Lighthouse Score:** ≥90 (Performance)
- **LCP:** ≤2.5 sekundy
- **FID:** ≤100 ms
- **CLS:** ≤0.1

#### 8.1.3 Bezpieczeństwo
- **OWASP ZAP:** 0 High/Critical vulnerabilities
- **npm audit:** 0 High/Critical dependencies
- **Manual penetration:** Brak krytycznych luk

#### 8.1.4 Dostępność
- **Lighthouse Accessibility:** ≥95
- **Manual testing:** WCAG 2.1 Level AA compliance
- **Screen reader:** Pełna funkcjonalność

#### 8.1.5 Funkcjonalność
- **API Tests:** 100% success rate
- **E2E Tests:** 100% success rate
- **Cross-browser:** Chrome, Firefox, Safari support

### 8.2 Kryteria Blokujące (Blocking Criteria)
- 🚫 Critical security vulnerabilities
- 🚫 Data corruption or loss
- 🚫 Complete system unavailability
- 🚫 Failed authentication system
- 🚫 AI integration completely broken

### 8.3 Metryki Jakości

#### 8.3.1 Defects Density
- **Target:** <5 defects/1000 lines of code
- **Critical bugs:** 0 w produkcji
- **High bugs:** <2 w produkcji

#### 8.3.2 Test Execution
- **Automated tests:** 95% automated
- **Test execution time:** <30 minut (pełna suita)
- **Flaky tests:** <2% failure rate

## 10. Procedury Raportowania Błędów

### 10.1 Klasyfikacja Błędów

#### 10.1.1 Critical (P0)
**Definicja:** Błędy blokujące podstawowe funkcjonalności
**Przykłady:**
- Niemożność logowania/rejestracji
- Całkowita awaria generowania przekąsek
- Utrata danych użytkowników
- Security vulnerabilities

**SLA:** Fix w ciągu 24h, hotfix deployment

#### 10.1.2 High (P1)
**Definicja:** Poważne błędy wpływające na user experience
**Przykłady:**
- Błędy w zapisywaniu do ulubionych
- Niepoprawne wyświetlanie danych
- Performance issues (>5s load time)
- Mobile responsiveness broken

**SLA:** Fix w ciągu 3 dni, następny sprint

#### 10.1.3 Medium (P2)
**Definicja:** Błędy funkcjonalne nieco wpływające na UX
**Przykłady:**
- Minor UI inconsistencies
- Slow performance (2-5s load time)
- Accessibility issues
- Edge case errors

**SLA:** Fix w ciągu 1 tygodnia

#### 10.1.4 Low (P3)
**Definicja:** Kosmetyczne błędy i nice-to-have improvements
**Przykłady:**
- Text typos
- Minor style inconsistencies
- Enhancement requests
- Documentation updates

**SLA:** Fix w backlog, gdy capacity pozwala

### 10.2 Template Raportu Błędu

```markdown
## Bug ID: BUG-YYYY-MM-DD-XXX

### 📋 Podstawowe Informacje
- **Tytuł:** [Krótki, opisowy tytuł]
- **Priorytet:** [P0/P1/P2/P3]
- **Severity:** [Critical/High/Medium/Low]
- **Status:** [New/In Progress/Fixed/Verified/Closed]
- **Assignee:** [Nazwa developera]
- **Reporter:** [Nazwa testera]
- **Date Found:** [YYYY-MM-DD]

### 🌍 Środowisko
- **Environment:** [DEV/STG/PROD]
- **Browser:** [Chrome 120, Firefox 121, Safari 17]
- **OS:** [Windows 11, macOS 14, iOS 17]
- **Device:** [Desktop/Mobile/Tablet]
- **Resolution:** [1920x1080, 375x667]

### 📝 Opis Błędu
[Jasny, szczegółowy opis co się wydarzyło]

### 🔄 Kroki do Reprodukcji
1. Przejdź na stronę [URL]
2. Kliknij [element]
3. Wypełnij formularz [danymi]
4. Obserwuj [zachowanie]

### ✅ Oczekiwany Rezultat
[Co powinno się wydarzyć]

### ❌ Aktualny Rezultat
[Co się faktycznie wydarzyło]

### 🔗 Dodatkowe Informacje
- **Screenshots:** [załącz screenshoty]
- **Console Errors:** [błędy z console]
- **Network Issues:** [błędy sieciowe]
- **Related Tickets:** [linki do powiązanych]

### 🧪 Test Data Used
```json
{
  "user": "test@example.com",
  "input": "specific test data"
}
```

### 🏷️ Labels
`bug` `frontend` `api` `mobile` `accessibility`
```

### 10.3 Workflow Raportowania

#### 10.3.1 Discovery Phase
1. 🔍 **Tester** znajduje błąd podczas testów
2. 📋 **Tester** weryfikuje reprodukowalność (3x)
3. 🔍 **Tester** sprawdza czy błąd nie był już zgłoszony
4. 📝 **Tester** tworzy bug report według template'u

#### 10.3.2 Triage Phase
1. 👀 **Tech Lead** reviewuje bug w ciągu 24h
2. 🏷️ **Tech Lead** klasyfikuje priorytet i severity
3. 👤 **Tech Lead** przypisuje do odpowiedniego developera
4. 📅 **Tech Lead** ustala milestone/sprint

#### 10.3.3 Resolution Phase
1. 🔧 **Developer** implementuje fix
2. ✅ **Developer** tworzy unit/integration tests
3. 📤 **Developer** tworzy pull request
4. 👀 **Code Review** przez innego developera
5. 🚀 **Deploy** na staging environment

#### 10.3.4 Verification Phase
1. ✅ **Tester** weryfikuje fix na staging
2. 🧪 **Tester** przeprowadza regression testing
3. ✅ **Tester** approves bug jako Fixed
4. 🚀 **Deploy** na production environment
5. ✅ **Tester** final verification na production

### 10.4 Komunikacja i Eskalacja

#### 10.4.1 Kanały Komunikacji
- **Slack #bugs** - daily bug reports i updates
- **Weekly Bug Review** - meeting z całym zespołem
- **Jira/GitHub Issues** - oficjalne tracking
- **Severity P0/P1** - natychmiastowa escalation do Tech Lead

#### 10.4.2 Escalation Matrix
```
P0 (Critical) → Tech Lead → CTO → CEO
P1 (High) → Tech Lead → Engineering Manager
P2 (Medium) → Assigned Developer → Tech Lead
P3 (Low) → Assigned Developer
```

#### 10.4.3 Raportowanie Metryk
**Weekly Bug Report:**
- 📊 Nowe bugs vs rozwiązane
- 📈 Trend jakości (bugs/feature)
- 🕐 Average resolution time
- 🎯 Quality gates status
- 🚀 Release readiness assessment

**Monthly Quality Review:**
- 📊 Test coverage trends
- 🔄 Automation percentage
- 💰 Cost of quality (bug fix time)
- 📈 Customer satisfaction correlation
- 🎯 Process improvement recommendations
