# API Endpoint Implementation Plan: User Favorites

## 1. Przegląd punktu końcowego

Endpoints dla zarządzania ulubionymi przekąskami użytkowników. Implementuje pełny zestaw operacji CRUD z obsługą paginacji, uwierzytelniania i walidacji danych. Wszystkie endpointy wymagają uwierzytelnionego użytkownika i operują na tabeli `user_favourites` z kluczem kompozytowym (user_id, snack_id).

## 2. Szczegóły żądania

### GET /api/favorites
- **Metoda HTTP**: GET
- **Struktura URL**: `/api/favorites`
- **Parametry**:
  - Opcjonalne: `page` (number, default: 1), `limit` (number, default: 20)
- **Request Body**: Brak

### GET /api/favorites/{id}
- **Metoda HTTP**: GET
- **Struktura URL**: `/api/favorites/{id}`
- **Parametry**:
  - Wymagane: `id` (number) - identyfikator ulubionej przekąski
- **Request Body**: Brak

### POST /api/favorites
- **Metoda HTTP**: POST
- **Struktura URL**: `/api/favorites`
- **Parametry**: Brak
- **Request Body**:
  ```json
  {
    "snack_id": number
  }
  ```

### DELETE /api/favorites/{id}
- **Metoda HTTP**: DELETE
- **Struktura URL**: `/api/favorites/{id}`
- **Parametry**:
  - Wymagane: `id` (number) - identyfikator ulubionej przekąski
- **Request Body**: Brak

## 3. Wykorzystywane typy

### Command Models (Request DTOs):
- `AddFavoriteRequest` - dla POST /api/favorites

### Response DTOs:
- `FavoriteListResponse` - paginowana lista ulubionych (GET /api/favorites)
- `FavoriteListItemResponse` - element listy ulubionych
- `FavoriteDetailsResponse` - szczegóły ulubionej z pełnymi danymi przekąski (GET /api/favorites/{id})
- `AddFavoriteResponse` - odpowiedź po dodaniu do ulubionych (POST /api/favorites)
- `RemoveFavoriteResponse` - odpowiedź po usunięciu z ulubionych (DELETE /api/favorites/{id})
- `PaginatedResponse<T>` i `PaginationMeta` - dla paginacji

### Database Entity Types:
- `UserFavorite` - reprezentuje rekord z tabeli user_favourites
- `Snack` - dla pełnych danych przekąski

## 4. Szczegóły odpowiedzi

### GET /api/favorites (200 OK):
```json
{
  "data": [
    {
      "id": number,
      "snack_id": number,
      "title": string,
      "description": string,
      "kcal": number,
      "added_at": string
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

### GET /api/favorites/{id} (200 OK):
```json
{
  "id": number,
  "snack_id": number,
  "user_id": string,
  "added_at": string,
  "snack": {
    "id": number,
    "title": string,
    "description": string,
    "ingredients": string,
    "instructions": string,
    "snack_type": string,
    "location": string,
    "goal": string,
    "preferred_diet": string,
    "kcal": number,
    "protein": number,
    "fat": number,
    "carbohydrates": number,
    "fibre": number,
    "created_at": string
  }
}
```

### POST /api/favorites (201 Created):
```json
{
  "id": number,
  "user_id": string,
  "snack_id": number,
  "added_at": string
}
```

### DELETE /api/favorites/{id} (200 OK):
```json
{
  "success": true
}
```

## 5. Przepływ danych

### GET /api/favorites:
1. Walidacja parametrów paginacji
2. Pobranie user_id z kontekstu Supabase
3. Zapytanie do bazy z JOIN na tabele user_favourites i snacks
4. Obliczenie metadanych paginacji
5. Mapowanie wyników na FavoriteListItemResponse
6. Zwrócenie paginowanej odpowiedzi

### GET /api/favorites/{id}:
1. Walidacja parametru id
2. Pobranie user_id z kontekstu Supabase
3. Zapytanie do bazy z JOIN na wszystkie pola
4. Sprawdzenie czy rekord należy do użytkownika
5. Mapowanie na FavoriteDetailsResponse
6. Zwrócenie szczegółów

### POST /api/favorites:
1. Walidacja request body (snack_id)
2. Pobranie user_id z kontekstu Supabase
3. Sprawdzenie czy przekąska istnieje
4. Sprawdzenie czy nie jest już w ulubionych
5. Wstawienie nowego rekordu do user_favourites
6. Zwrócenie danych nowo utworzonego rekordu

### DELETE /api/favorites/{id}:
1. Walidacja parametru id
2. Pobranie user_id z kontekstu Supabase
3. Sprawdzenie czy rekord istnieje i należy do użytkownika
4. Usunięcie rekordu z bazy
5. Zwrócenie potwierdzenia

## 6. Względy bezpieczeństwa

### Uwierzytelnianie:
- Wszystkie endpointy wymagają aktywnej sesji Supabase
- Użycie `context.locals.supabase` dla autoryzacji
- Sprawdzenie `user` z session przed każdą operacją

### Autoryzacja:
- RLS (Row Level Security) na tabeli user_favourites
- Użytkownicy mogą dostać tylko swoje ulubione
- Walidacja ownership przed operacjami modyfikacji

### Walidacja danych:
- Zod schemas dla wszystkich wejść
- Sanityzacja parametrów URL i query
- Sprawdzenie typu i zakresu dla parametrów numerycznych

### Ochrona przed atakami:
- Rate limiting dla operacji dodawania/usuwania
- Walidacja istnienia referencyjnych rekordów
- Ochrona przed SQL injection przez ORM Supabase

## 7. Obsługa błędów

### 400 Bad Request:
- Nieprawidłowy format snack_id
- Nieprawidłowe parametry paginacji (ujemne, zbyt duże)
- Brakujące wymagane pola w request body

### 401 Unauthorized:
- Brak aktywnej sesji użytkownika
- Nieprawidłowy token autoryzacji
- Sesja wygasła

### 404 Not Found:
- Ulubiona przekąska nie istnieje
- Przekąska do dodania nie istnieje
- Próba dostępu do cudzych ulubionych

### 409 Conflict:
- Przekąska już jest w ulubionych (POST)
- Naruszenie ograniczeń unikalności

### 500 Internal Server Error:
- Błędy połączenia z bazą danych
- Nieoczekiwane błędy serwera
- Błędy mapowania danych

### Logowanie błędów:
- Wszystkie błędy 500 logowane z pełnym stack trace
- Błędy 400/404 logowane jako warning z kontekstem
- Błędy bezpieczeństwa (401) logowane jako security events

## 8. Rozważania dotyczące wydajności

### Optymalizacje bazy danych:
- Indeks na (user_id, snack_id) z klucza kompozytowego
- Dodatkowy indeks na user_id dla szybkich zapytań
- Limit maksymalny dla paginacji (np. 100 rekordów)

### Caching:
- Możliwość cache'owania listy ulubionych (krótki TTL)
- Invalidacja cache przy dodawaniu/usuwaniu

### Paginacja:
- Domyślny limit 20, maksymalny 100
- Offset-based pagination dla prostoty
- Możliwość przyszłej migracji na cursor-based

### Lazy loading:
- Lista ulubionych bez pełnych danych przekąski
- Szczegóły ładowane na żądanie

## 9. Etapy wdrożenia

### Krok 1: Stworzenie struktur danych
- Implementacja Zod schemas dla walidacji
- Definicja typów specific dla favorites API
- Stworzenie helper functions dla mapowania danych

### Krok 2: Implementacja FavoriteService
- Stworzenie `src/lib/services/favorite.service.ts`
- Implementacja metod CRUD z obsługą błędów
- Logika biznesowa dla zarządzania ulubionymi
- Testy jednostkowe dla service layer

### Krok 3: Implementacja API routes
- `src/pages/api/favorites/index.ts` (GET, POST)
- `src/pages/api/favorites/[id].ts` (GET, DELETE)
- Walidacja requestów i responses
- Proper error handling z odpowiednimi kodami

### Krok 4: Implementacja middleware
- Sprawdzenie autoryzacji w middleware
- Walidacja session dla wszystkich /api/favorites routes
- Rate limiting dla operacji modyfikacji
