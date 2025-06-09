# Architektura UI dla SnAIck

## 1. Przegląd struktury UI

SnAIck będzie miał płaską hierarchię nawigacyjną, zapewniającą łatwy dostęp do wszystkich kluczowych funkcji z głównego menu. Aplikacja będzie zbudowana przy użyciu technologii Astro 5, TypeScript 5, React 19, Tailwind 4 i Shadcn/ui, zgodnie z wymaganiami. Struktura UI skupia się wokół trzech głównych przepływów:

1. **Autentykacja** - rejestracja i logowanie użytkowników
2. **Generowanie przekąsek** - wieloetapowy formularz zbierający preferencje i wyświetlający rekomendacje
3. **Zarządzanie przekąskami** - przeglądanie i zarządzanie listą ulubionych przekąsek

Interfejs jest zaprojektowany tak, aby priorytetowo traktować generowanie przekąsek, z intuicyjną nawigacją między widokami i płynnymi przejściami.

## 2. Lista widoków

### 2.1. Strona główna / Landing page
- **Ścieżka:** `/`
- **Główny cel:** Wprowadzenie użytkownika do aplikacji, zachęcenie do rejestracji/logowania
- **Kluczowe informacje:** Krótki opis aplikacji, główne korzyści, CTA do rejestracji/logowania
- **Kluczowe komponenty:** 
  - Hero section z opisem produktu
  - Przyciski "Zarejestruj się" i "Zaloguj się"
  - Przykłady przekąsek generowanych przez aplikację
- **UX/Dostępność/Bezpieczeństwo:** 
  - Responsywny design dla urządzeń mobilnych i desktop
  - Czytelne komunikaty CTA
  - Przekierowanie zalogowanych użytkowników do formularza generowania

### 2.2. Rejestracja
- **Ścieżka:** `/register`
- **Główny cel:** Umożliwienie utworzenia nowego konta użytkownika
- **Kluczowe informacje:** Pola formularza (email, hasło, potwierdzenie hasła)
- **Kluczowe komponenty:** 
  - Formularz rejestracji z walidacją pól
  - Przycisk "Zarejestruj się"
  - Link do strony logowania
- **UX/Dostępność/Bezpieczeństwo:** 
  - Walidacja pól w czasie rzeczywistym
  - Bezpieczne przesyłanie danych (HTTPS)
  - Integracja z Supabase Auth
  - Przekierowanie po pomyślnej rejestracji do formularza generowania

### 2.3. Logowanie
- **Ścieżka:** `/login`
- **Główny cel:** Umożliwienie zalogowania się istniejącego użytkownika
- **Kluczowe informacje:** Pola formularza (email, hasło)
- **Kluczowe komponenty:** 
  - Formularz logowania z walidacją pól
  - Przycisk "Zaloguj się"
  - Link do strony rejestracji
  - Opcja "Zapomniałem hasła"
- **UX/Dostępność/Bezpieczeństwo:** 
  - Obsługa błędów logowania
  - Bezpieczne przesyłanie danych (HTTPS)
  - Integracja z Supabase Auth
  - Przekierowanie po pomyślnym logowaniu do formularza generowania

### 2.4. Formularz generowania przekąsek
- **Ścieżka:** `/generate`
- **Główny cel:** Zebranie preferencji użytkownika do wygenerowania spersonalizowanej propozycji przekąski
- **Kluczowe informacje:** Etapy formularza, instrukcje, wskaźnik postępu
- **Kluczowe komponenty:** 
  - Wieloetapowy formularz:
    1. Spożyte posiłki danego dnia (pole tekstowe)
    2. Typ przekąski (słodka, słona, lekka, sycąca)
    3. Lokalizacja użytkownika (praca, dom, sklep, poza domem)
    4. Cel dietetyczny (utrzymanie, redukcja, przyrost)
    5. Preferowana dieta (standard, wegetariańska, wegańska, bezglutenowa)
    6. Wykluczenia żywieniowe (opcjonalne)
    7. Limit kaloryczny (opcjonalne, tylko jeśli wybrano odpowiedni cel)
  - Wskaźnik postępu w formie kropek
  - Przyciski nawigacji (wstecz/dalej) jako strzałki
  - Przycisk "Pomiń" dla opcjonalnych etapów
  - Przycisk "Znajdź mi przekąskę" na ostatnim etapie
- **UX/Dostępność/Bezpieczeństwo:** 
  - Zachowanie stanu formularza podczas nawigacji między etapami (Zustand)
  - Walidacja zgodna z walidacją API
  - Domyślne wartości w formularzach
  - Obsługa nawigacji klawiaturą

### 2.5. Wynik generowania
- **Ścieżka:** `/snack-result`
- **Główny cel:** Prezentacja wygenerowanej propozycji przekąski
- **Kluczowe informacje:** Nazwa przekąski, opis, składniki, instrukcje, wartości odżywcze
- **Kluczowe komponenty:** 
  - Karta z informacjami o przekąsce
  - Wykres kołowy wartości odżywczych z tooltipami
  - Przycisk "Zapisz do ulubionych"
  - Przycisk "Wygeneruj inną"
  - Spinner podczas ładowania z komunikatem "Generujemy Twoją idealną przekąskę..."
- **UX/Dostępność/Bezpieczeństwo:** 
  - Toast bar z potwierdzeniem po dodaniu do ulubionych
  - Optymistyczne aktualizacje UI
  - Pełna dostępność wykresu (alternatywna prezentacja danych)

### 2.6. Lista wszystkich przekąsek
- **Ścieżka:** `/snacks`
- **Główny cel:** Przeglądanie wszystkich wygenerowanych przez użytkownika przekąsek
- **Kluczowe informacje:** Lista przekąsek, podstawowe informacje o każdej przekąsce
- **Kluczowe komponenty:** 
  - Karty przekąsek (nazwa, krótki opis, wartość kaloryczna)
  - Przycisk "Dodaj do ulubionych" przy każdej karcie
  - Paginacja (6 elementów na stronę)
- **UX/Dostępność/Bezpieczeństwo:** 
  - Responsywny układ kart
  - Toast bar z potwierdzeniem po dodaniu do ulubionych
  - Informacja gdy lista jest pusta

### 2.7. Lista ulubionych przekąsek
- **Ścieżka:** `/favorites`
- **Główny cel:** Przeglądanie zapisanych przez użytkownika ulubionych przekąsek
- **Kluczowe informacje:** Lista ulubionych, podstawowe informacje o każdej przekąsce
- **Kluczowe komponenty:** 
  - Karty przekąsek jako prostokątne bloki
  - Przycisk "Usuń z ulubionych" przy każdej karcie
  - Paginacja (6 elementów na stronę)
- **UX/Dostępność/Bezpieczeństwo:** 
  - Responsywna siatka skalująca się w zależności od szerokości ekranu
  - Potwierdzenie przed usunięciem z ulubionych
  - Toast bar z potwierdzeniem po usunięciu
  - Informacja gdy lista jest pusta

### 2.8. Szczegóły przekąski (modal)
- **Ścieżka:** nie dotyczy (modal)
- **Główny cel:** Prezentacja pełnych szczegółów wybranej przekąski
- **Kluczowe informacje:** Nazwa, pełny opis, składniki, instrukcje, wartości odżywcze
- **Kluczowe komponenty:** 
  - Modal z możliwością zamknięcia przez kliknięcie tła lub klawisz Escape
  - Wykres kołowy wartości odżywczych z tooltipami
  - Przyciski akcji (dodaj/usuń z ulubionych)
- **UX/Dostępność/Bezpieczeństwo:** 
  - Możliwość zamknięcia modalu przez kliknięcie tła lub klawisz Escape
  - Pełna dostępność dla czytników ekranu
  - Tooltips na wykresie pokazujące dokładne wartości

### 2.9. Panel użytkownika
- **Ścieżka:** `/profile`
- **Główny cel:** Zarządzanie kontem użytkownika i wylogowanie
- **Kluczowe informacje:** Informacje o użytkowniku, opcje konta
- **Kluczowe komponenty:** 
  - Informacja o adresie email
  - Przycisk "Wyloguj się"
  - Opcjonalnie: zmiana hasła
- **UX/Dostępność/Bezpieczeństwo:** 
  - Potwierdzenie przed wylogowaniem
  - Bezpieczne zarządzanie sesją
  - Przekierowanie po wylogowaniu

## 3. Mapa podróży użytkownika

### 3.1. Przepływ dla nowego użytkownika
1. Użytkownik wchodzi na stronę główną (`/`)
2. Klika przycisk "Zarejestruj się"
3. Jest przekierowany do widoku rejestracji (`/register`)
4. Wypełnia formularz rejestracji i zatwierdza
5. Po pomyślnej rejestracji zostaje przekierowany do formularza generowania (`/generate`)
6. Przechodzi przez etapy formularza generowania przekąski:
   - Wprowadza informacje o spożytych posiłkach
   - Wybiera typ przekąski
   - Określa swoją lokalizację
   - Wybiera cel dietetyczny
   - Wybiera preferowaną dietę
   - Opcjonalnie: wprowadza wykluczenia żywieniowe
   - Opcjonalnie: określa limit kaloryczny
7. Klika "Znajdź mi przekąskę"
8. Widzi spinner ładowania z komunikatem
9. Otrzymuje wynik generowania (`/snack-result`)
10. Może:
    - Zapisać przekąskę do ulubionych (pojawi się toast z potwierdzeniem)
    - Wygenerować nową propozycję (powrót do punktu 8)
    - Przejść do listy wszystkich przekąsek lub ulubionych przez menu główne

### 3.2. Przepływ dla powracającego użytkownika
1. Użytkownik wchodzi na stronę główną (`/`)
2. Klika przycisk "Zaloguj się"
3. Jest przekierowany do widoku logowania (`/login`)
4. Wypełnia formularz logowania i zatwierdza
5. Po pomyślnym logowaniu zostaje przekierowany do formularza generowania (`/generate`)
6. Może bezpośrednio przejść do listy wszystkich przekąsek (`/snacks`) lub ulubionych (`/favorites`)
7. Z listy może:
   - Kliknąć na przekąskę, aby zobaczyć szczegóły (modal)
   - Dodać/usunąć przekąskę z ulubionych
   - Przejść do kolejnej strony za pomocą paginacji

### 3.3. Przepływ zarządzania ulubionymi
1. Użytkownik przegląda listę ulubionych przekąsek (`/favorites`)
2. Może:
   - Kliknąć na przekąskę, aby zobaczyć szczegóły w modalu
   - Usunąć przekąskę z ulubionych (pojawi się potwierdzenie)
   - Przejść do kolejnej strony za pomocą paginacji
3. Po kliknięciu na przekąskę otwiera się modal ze szczegółami
4. W modalu może usunąć przekąskę z ulubionych
5. Po zamknięciu modalu wraca do listy ulubionych

## 4. Układ i struktura nawigacji

### 4.1. Główna nawigacja
SnAIck będzie miał płaską strukturę nawigacyjną z głównym menu dostępnym zawsze po zalogowaniu:

- **Nagłówek** (stały element na górze ekranu):
  - Logo/Nazwa aplikacji (link do formularza generowania)
  - Menu główne:
    - Generuj przekąskę (`/generate`)
    - Moje przekąski (`/snacks`)
    - Ulubione (`/favorites`)
  - Profil użytkownika (dropdown):
    - Informacje o użytkowniku
    - Link do profilu (`/profile`)
    - Wyloguj się

### 4.2. Nawigacja formularza
Wieloetapowy formularz generowania przekąsek będzie miał następującą nawigację:

- Wskaźnik postępu w formie kropek na górze (zmodyfikowany komponent Stepper)
- Przyciski nawigacji na dole formularza:
  - Przycisk "Wstecz" (strzałka w lewo) - nieaktywny na pierwszym etapie
  - Przycisk "Pomiń" - widoczny tylko dla opcjonalnych etapów
  - Przycisk "Dalej" (strzałka w prawo) - na ostatnim etapie zamieniony na "Znajdź mi przekąskę"

### 4.3. Nawigacja w widoku przekąsek i ulubionych
Listy przekąsek będą miały następującą nawigację:

- Nagłówek z tytułem sekcji
- Karty przekąsek w układzie siatki
- Paginacja na dole strony (6 elementów na stronę)
- Możliwość kliknięcia na kartę, aby otworzyć modal ze szczegółami

## 5. Kluczowe komponenty

### 5.1. AuthForm
Wspólny komponent do obsługi rejestracji i logowania, konfigurowalny w zależności od kontekstu.

### 5.2. MultiStepForm
Komponent do obsługi wieloetapowego formularza generowania przekąsek, zarządzający nawigacją między etapami i stanem formularza za pomocą Zustand.

### 5.3. StepIndicator
Wskaźnik postępu w formularzu w formie kropek, bazujący na komponencie Stepper z Shadcn/ui.

### 5.4. SnackCard
Komponent karty przekąski używany w widoku wszystkich przekąsek i ulubionych, zawierający podstawowe informacje i przyciski akcji.

### 5.5. SnackDetailsModal
Modal ze szczegółami przekąski, używany w różnych kontekstach (wynik generowania, lista przekąsek, ulubione).

### 5.6. NutritionChart
Wykres kołowy wartości odżywczych wykorzystujący Chart.js, z tooltipami pokazującymi dokładne wartości.

### 5.7. LoadingSpinner
Komponent spinnera z komunikatem, używany podczas generowania przekąski i innych operacji asynchronicznych.

### 5.8. ToastNotification
Komponent powiadomień typu toast, wyświetlany na dole ekranu po wykonaniu akcji (dodanie/usunięcie z ulubionych).

### 5.9. ResponsiveGrid
Responsywna siatka do wyświetlania kart przekąsek, automatycznie dostosowująca się do szerokości ekranu.

### 5.10. Pagination
Komponent paginacji używany w widokach list, z konfiguracją 6 elementów na stronę. 