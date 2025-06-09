# Plan implementacji widoku Lista Ulubionych Przekąsek

## 1. Przegląd
Widok Lista Ulubionych Przekąsek umożliwia użytkownikom przeglądanie, wyświetlanie szczegółów i usuwanie zapisanych przez nich ulubionych przekąsek. Widok składa się z responsywnej siatki kart przekąsek z paginacją, modalu ze szczegółami zawierającego wykres wartości odżywczych oraz systemu potwierdzenia usuwania z powiadomieniami toast.

## 2. Routing widoku
**Ścieżka:** `/favorites`
**Typ:** Chroniona strona wymagająca autoryzacji użytkownika
**Przekierowanie:** Nieautoryzowani użytkownicy przekierowywani do `/login`

## 3. Struktura komponentów
```
FavoritesPage (Astro component)
├── PageHeader
├── FavoritesList (React component)
│   ├── FavoriteCard (React component - multiple)
│   └── Pagination (React component)
├── FavoriteDetailsModal (React component)
│   ├── ModalHeader
│   ├── SnackDetails
│   ├── NutritionChart (React component)
│   └── ActionButtons
├── ConfirmDialog (React component)
├── ToastContainer (React component)
└── EmptyState (React component)
```

## 4. Szczegóły komponentów

### FavoritesPage
- **Opis komponentu:** Główny kontener strony zawierający layout i orkiestrujący wszystkie podkomponenty
- **Główne elementy:** Header aplikacji, tytuł sekcji, kontener na listę, komponenty modalne
- **Obsługiwane interakcje:** Inicjalizacja ładowania danych, zarządzanie stanem globalnym
- **Obsługiwana walidacja:** Sprawdzenie autoryzacji użytkownika
- **Typy:** `FavoritesPageViewModel`, `User` z middleware
- **Propsy:** user: User (z middleware Astro)

### FavoritesList  
- **Opis komponentu:** Kontener zarządzający listą ulubionych przekąsek z paginacją i stanami ładowania
- **Główne elementy:** Grid container, FavoriteCard components, Pagination component, loading spinner
- **Obsługiwane interakcje:** Ładowanie danych, nawigacja paginacji, obsługa stanów pustej listy
- **Obsługiwana walidacja:** Walidacja parametrów paginacji (page >= 1, limit 1-100)
- **Typy:** `FavoritesPageViewModel`, `PaginationMeta`, `FavoriteListItemResponse[]`
- **Propsy:** userId: string

### FavoriteCard
- **Opis komponentu:** Karta pojedynczej ulubionej przekąski z podstawowymi informacjami i akcjami
- **Główne elementy:** Card container, title, description, kcal badge, action buttons (view details, remove)
- **Obsługiwane interakcje:** Kliknięcie karty (otwarcie szczegółów), kliknięcie usuń (dialog potwierdzenia)
- **Obsługiwana walidacja:** Sprawdzenie czy przekąska należy do użytkownika
- **Typy:** `FavoriteListItemResponse`, `ModalViewModel`, `ConfirmDialogViewModel`
- **Propsy:** favorite: FavoriteListItemResponse, onViewDetails: (id: number) => void, onRemove: (favorite: FavoriteListItemResponse) => void

### FavoriteDetailsModal
- **Opis komponentu:** Modal wyświetlający pełne szczegóły przekąski z wykresem wartości odżywczych
- **Główne elementy:** Modal container, close button, snack details, NutritionChart, action buttons
- **Obsługiwane interakcje:** Zamknięcie modalu (ESC, kliknięcie tła, X), usuwanie z ulubionych
- **Obsługiwana walidacja:** Sprawdzenie czy modal ma załadowane dane
- **Typy:** `ModalViewModel`, `FavoriteDetailsResponse`, `SnackDetailsResponse`
- **Propsy:** isOpen: boolean, favoriteDetails: FavoriteDetailsResponse | null, loading: boolean, onClose: () => void, onRemove: (favorite: FavoriteDetailsResponse) => void

### NutritionChart
- **Opis komponentu:** Wykres kołowy wartości odżywczych z tooltipami i legendą
- **Główne elementy:** Canvas element (Chart.js), legend, tooltips z wartościami
- **Obsługiwane interakcje:** Hover tooltips, kliknięcie segmentów
- **Obsługiwana walidacja:** Sprawdzenie czy dane odżywcze są kompletne i > 0
- **Typy:** `NutritionData`, `ChartConfiguration`
- **Propsy:** kcal: number, protein: number, fat: number, carbohydrates: number, fibre: number

### Pagination
- **Opis komponentu:** Komponent nawigacji paginacji z informacjami o aktualnej stronie
- **Główne elementy:** Previous/Next buttons, page info, page numbers (dla małych zestawów)
- **Obsługiwane interakcje:** Kliknięcie Previous/Next, kliknięcie numeru strony
- **Obsługiwana walidacja:** Sprawdzenie czy page > 1 dla Previous, czy has_more dla Next
- **Typy:** `PaginationMeta`, `PaginationState`
- **Propsy:** meta: PaginationMeta, onPageChange: (page: number) => void

### ConfirmDialog
- **Opis komponentu:** Dialog potwierdzenia usunięcia przekąski z ulubionych
- **Główne elementy:** Dialog container, title, message, confirm/cancel buttons
- **Obsługiwane interakcje:** Potwierdzenie (usunięcie), anulowanie, zamknięcie (ESC)
- **Obsługiwana walidacja:** Sprawdzenie czy jest przekąska do usunięcia
- **Typy:** `ConfirmDialogViewModel`, `FavoriteListItemResponse`
- **Propsy:** isOpen: boolean, favoriteToDelete: FavoriteListItemResponse | null, onConfirm: () => void, onCancel: () => void

### EmptyState
- **Opis komponentu:** Komponent wyświetlany gdy użytkownik nie ma ulubionych przekąsek
- **Główne elementy:** Icon, message, CTA button (link do generatora)
- **Obsługiwane interakcje:** Kliknięcie CTA (przekierowanie do /generate)
- **Obsługiwana walidacja:** Brak
- **Typy:** Brak
- **Propsy:** Brak

## 5. Typy

### ViewModels
```typescript
interface FavoritesPageViewModel {
  favorites: FavoriteListItemResponse[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
}

interface ModalViewModel {
  isOpen: boolean;
  selectedFavoriteId: number | null;
  favoriteDetails: FavoriteDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

interface ConfirmDialogViewModel {
  isOpen: boolean;
  favoriteToDelete: FavoriteListItemResponse | null;
  loading: boolean;
}

interface ToastViewModel {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  id: string;
}

interface PaginationState {
  currentPage: number;
  loading: boolean;
}

interface NutritionData {
  kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
}
```

### API Types (już istniejące)
- `FavoriteListResponse` - odpowiedź API z listą ulubionych
- `FavoriteDetailsResponse` - odpowiedź API ze szczegółami ulubionej
- `RemoveFavoriteResponse` - odpowiedź API po usunięciu
- `PaginationMeta` - metadata paginacji

## 6. Zarządzanie stanem

### Custom Hooks

**useFavorites(userId: string)**
```typescript
interface UseFavoritesReturn {
  favorites: FavoriteListItemResponse[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  currentPage: number;
  loadPage: (page: number) => Promise<void>;
  removeFavorite: (favoriteId: number) => Promise<void>;
  refreshList: () => Promise<void>;
}
```

**useFavoriteDetails()**
```typescript
interface UseFavoriteDetailsReturn {
  favoriteDetails: FavoriteDetailsResponse | null;
  loading: boolean;
  error: string | null;
  loadDetails: (favoriteId: number) => Promise<void>;
  clearDetails: () => void;
}
```

**useModal()**
```typescript
interface UseModalReturn {
  isOpen: boolean;
  openModal: (favoriteId: number) => void;
  closeModal: () => void;
}
```

**useToast()**
```typescript
interface UseToastReturn {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: (id: string) => void;
  toasts: ToastViewModel[];
}
```

## 7. Integracja API

### GET /api/favorites
- **Żądanie:** Query params: page (number), limit (number, default 6)
- **Odpowiedź:** `FavoriteListResponse`
- **Użycie:** Ładowanie listy ulubionych z paginacją
- **Error handling:** 401 → redirect login, 500 → error message

### GET /api/favorites/[id]  
- **Żądanie:** Path param: id (number - composite ID)
- **Odpowiedź:** `FavoriteDetailsResponse`
- **Użycie:** Ładowanie szczegółów dla modalu
- **Error handling:** 404 → close modal + toast error, 401 → redirect login

### DELETE /api/favorites/[id]
- **Żądanie:** Path param: id (number - composite ID)  
- **Odpowiedź:** `RemoveFavoriteResponse`
- **Użycie:** Usuwanie przekąski z ulubionych
- **Error handling:** 404 → refresh list, 401 → redirect login

## 8. Interakcje użytkownika

### Główne przepływy:
1. **Przeglądanie listy:**
   - Użytkownik wchodzi na /favorites
   - System ładuje pierwszą stronę (6 elementów)
   - Wyświetlenie kart z podstawowymi informacjami

2. **Wyświetlenie szczegółów:**
   - Kliknięcie na kartę przekąski
   - Otwarcie modalu z loading spinner
   - Ładowanie szczegółów przez API
   - Wyświetlenie danych + wykres wartości odżywczych

3. **Usuwanie z ulubionych:**
   - Kliknięcie przycisku "Usuń" (z karty lub modalu)
   - Otwarcie dialogu potwierdzenia
   - Potwierdzenie → API call → success toast → odświeżenie listy
   - Anulowanie → zamknięcie dialogu

4. **Nawigacja paginacji:**
   - Kliknięcie Previous/Next
   - Loading state na liście
   - Ładowanie nowej strony
   - Aktualizacja URL z parametrem page

## 9. Warunki i walidacja

### Warunki dostępu:
- Użytkownik musi być zalogowany (middleware Astro)
- Przekąski mogą być dostępne tylko dla ich właściciela

### Walidacja UI:
- **FavoritesList:** Sprawdzenie czy lista nie jest pusta
- **Pagination:** Walidacja czy Previous/Next są dostępne
- **FavoriteCard:** Sprawdzenie czy dane są kompletne
- **Modal:** Walidacja czy załadowano szczegóły przed wyświetleniem
- **NutritionChart:** Sprawdzenie czy wartości odżywcze > 0

### Walidacja API:
- Parametry paginacji: page >= 1, limit 1-100  
- ID ulubionej: musi być liczbą > 0
- Autoryzacja: token w cookies/headers

## 10. Obsługa błędów

### Scenariusze błędów:
1. **401 Unauthorized:** Przekierowanie do /login przez middleware
2. **404 Favorite not found:** Toast error + odświeżenie listy (może została usunięta)
3. **Network error:** Retry button + error message
4. **Pusta lista:** Wyświetlenie EmptyState z linkiem do /generate
5. **Błąd ładowania szczegółów:** Error state w modalu z retry
6. **Błąd usuwania:** Toast error bez modyfikacji listy

### Strategie obsługi:
- **Graceful degradation:** Wyświetlenie częściowych danych jeśli możliwe
- **Retry mechanisms:** Automatyczne ponowienie dla błędów network
- **User feedback:** Toast notifications dla wszystkich akcji
- **Optimistic updates:** UI feedback przed potwierdzeniem API

## 11. Kroki implementacji

1. **Przygotowanie typów i interfejsów**
   - Dodanie ViewModels do types.ts
   - Przygotowanie interfejsów dla hooks

2. **Implementacja custom hooks**
   - useFavorites() - zarządzanie listą z API
   - useFavoriteDetails() - ładowanie szczegółów
   - useModal() - stan modalu
   - useToast() - system powiadomień

3. **Komponent FavoritesPage (Astro)**
   - Layout strony z autoryzacją
   - Hydration React komponentów
   - Przekazanie user data z middleware

4. **Implementacja FavoritesList**
   - Grid layout z Tailwind
   - Integracja z useFavorites hook
   - Loading i error states

5. **Implementacja FavoriteCard**  
   - Design karty z Shadcn/ui
   - Responsywny layout
   - Event handlers dla akcji

6. **Implementacja Pagination**
   - Shadcn/ui Pagination component
   - Logika Previous/Next
   - Integracja z URL params

7. **Implementacja FavoriteDetailsModal**
   - Shadcn/ui Dialog component
   - Layout szczegółów przekąski
   - Keyboard navigation (ESC)

8. **Implementacja NutritionChart**
   - Integracja Chart.js z React
   - Responsywny wykres kołowy
   - Tooltips i accessibility

9. **Implementacja ConfirmDialog**
   - Shadcn/ui AlertDialog
   - Confirm/Cancel actions
   - Loading state podczas usuwania

10. **Implementacja EmptyState**
    - Ilustracja + tekst
    - CTA button do /generate
    - Responsive design

11. **Implementacja ToastContainer**
    - Shadcn/ui Toast components
    - Positioning i animations
    - Multiple toasts support

12. **Testy i debugging**
    - Test wszystkich user flows
    - Sprawdzenie responsywności
    - Testy accessibility
    - Error scenarios testing

13. **Optymalizacja i polish**
    - Performance optimizations
    - Animations i transitions
    - Loading skeletons
    - Final UX improvements 