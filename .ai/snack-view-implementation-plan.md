# API Endpoint Implementation Plan: Get All Snacks

## 1. Przegląd punktu końcowego
Celem tego punktu końcowego jest umożliwienie autoryzowanemu użytkownikowi pobrania paginowanej listy przekąsek. Endpoint dostarcza skrócone informacje o przekąskach, takie jak identyfikator, tytuł, opis, wartość energetyczna oraz data utworzenia, co pozwala użytkownikowi szybko przeglądać dostępne dane.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/snacks`
- **Parametry zapytania:**
  - **Opcjonalne:**
    - `page`: liczba (domyślnie 1) – numer strony paginacji
    - `limit`: liczba (domyślnie 20) – liczba elementów zwracanych na stronie
- **Request Body:** Brak

## 3. Wykorzystywane typy
- **DTOs:**
  - `SnackListResponse` – reprezentuje odpowiedź zawierającą listę skróconych danych przekąsek oraz metadane paginacji.
  - `SnackListItemResponse` – skrócone dane przekąsek (m.in. `id`, `title`, `description`, `kcal`, `created_at`).

## 4. Szczegóły odpowiedzi
- **Kod odpowiedzi:** 200 OK przy pomyślnym pobraniu danych.
- **Struktura odpowiedzi:**
  ```json
  {
    "data": [
      {
        "id": number,
        "title": string,
        "description": string,
        "kcal": number,
        "created_at": string
      }
    ],
    "meta": {
      "total": number,
      "page": number,
      "limit": number,
      "has_more": boolean
    }
  }
  ```
- **Inne kody statusu:**
  - 401 Unauthorized – użytkownik nie jest zalogowany
  - 400 Bad Request – nieprawidłowe dane wejściowe
  - 500 Internal Server Error – błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie GET do `/api/snacks` z opcjonalnymi parametrami `page` i `limit`.
2. Endpoint sprawdza autoryzację użytkownika poprzez `context.locals` (użycie Supabase jako backendu).
3. Parametry zapytania poddawane są walidacji przy użyciu `zod` lub podobnej biblioteki.
4. Endpoint wywołuje metodę w warstwie serwisowej (np. `snack.service.ts`), przekazując parametry paginacji i identyfikator użytkownika.
5. Warstwa serwisowa łączy się z bazą danych poprzez Supabase, pobierając dane z tabeli `snacks` i filtrując je odpowiednio.
6. Wynik jest transformowany do formatu `SnackListResponse` i zwracany do endpointu.
7. Endpoint zwraca odpowiedź JSON do klienta.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Upewnienie się, że żądanie pochodzi od uwierzytelnionego użytkownika (sprawdzenie sesji przy użyciu `context.locals`).
- **Walidacja wejściowa:** Wszystkie parametry zapytania (np. `page` i `limit`) muszą być walidowane za pomocą `zod` lub innego narzędzia, aby zapobiec wprowadzaniu nieprawidłowych danych.
- **Zapobieganie atakom:** Użycie parametrized queries Supabase zmniejsza ryzyko SQL injection. Dodatkowo, stosowanie middleware do logowania i monitorowania błędów.

## 7. Obsługa błędów
- **401 Unauthorized:** Zwracane, gdy użytkownik nie jest zalogowany lub sesja jest nieważna.
- **400 Bad Request:** Zwracane w przypadku nieprawidłowych parametrów zapytania. Walidacja wejścia powinna zwracać szczegółowe informacje o błędach.
- **500 Internal Server Error:** Błąd po stronie serwera (np. problem z bazą danych). Wszystkie błędy powinny być logowane, a użytkownik otrzymuje przyjazny komunikat o błędzie.

## 8. Rozważania dotyczące wydajności
- **Paginacja:** Zastosowanie paginacji poprzez parametry `page` i `limit` pozwala na ograniczenie ilości danych pobieranych naraz.
- **Optymalizacja zapytań:** Upewnić się, że zapytania do bazy danych są zoptymalizowane (np. poprzez odpowiednie indeksy w tabeli `snacks`).
- **Cache'owanie:** W zależności od obciążenia, rozważyć cache'owanie wyników zapytań, aby zmniejszyć liczbę bezpośrednich odwołań do bazy danych.

## 9. Etapy wdrożenia
1. **Utworzenie pliku endpointu:** Stworzenie pliku `src/pages/api/snacks.ts` zgodnie z architekturą Astro.
2. **Implementacja walidacji parametrów:** Użycie `zod` do walidacji danych wejściowych (parametry `page` i `limit`).
3. **Sprawdzenie autoryzacji:** Weryfikacja sesji użytkownika poprzez `context.locals` (Supabase client).
4. **Wywołanie logiki serwisowej:** Utworzenie lub aktualizacja serwisu (`snack.service.ts`), który obsłuży pobieranie danych z bazy.
5. **Implementacja paginacji:** Implementacja logiki paginacji w serwisie, aby odpowiednio zwracać dane i metadane.
6. **Obsługa błędów:** Dodanie obsługi błędów, logowanie wyjątków oraz zwracanie odpowiednich kodów statusu.