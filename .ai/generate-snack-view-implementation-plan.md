# Plan implementacji widoku formularza generowania przekąsek

## 1. Przegląd
Widok generowania przekąsek to kluczowy element aplikacji SnAIck, umożliwiający użytkownikom wprowadzenie swoich preferencji żywieniowych poprzez wieloetapowy formularz. Na podstawie wprowadzonych danych system generuje spersonalizowaną propozycję przekąski dopasowaną do indywidualnych potrzeb, preferencji i ograniczeń użytkownika.

## 2. Routing widoku
Ścieżka: `/generate`

## 3. Struktura komponentów
```
GenerateSnackPage (Komponent Astro + React)
├── SnackFormProgress
├── FormStep
│   ├── FormStepMeals
│   ├── FormStepSnackType
│   ├── FormStepLocation
│   ├── FormStepGoal
│   ├── FormStepPreferredDiet
│   ├── FormStepDietaryRestrictions
│   └── FormStepCaloricLimit
├── LoadingIndicator
└── SnackRecommendation
```

## 4. Szczegóły komponentów
### GenerateSnackPage
- Opis komponentu: Główny komponent strony, zarządzający stanem formularza wieloetapowego i renderujący odpowiedni krok lub wynik generowania przekąski
- Główne elementy: Kontener z tytułem strony, komponenty kroków formularza, wskaźnik postępu, wskaźnik ładowania, komponent wyniku
- Obsługiwane interakcje: Nawigacja między krokami, wysłanie formularza, odrzucenie propozycji i wygenerowanie nowej
- Obsługiwana walidacja: Walidacja całego formularza przed wysłaniem zgodnie z wymaganiami API
- Typy: FormState, FormAction
- Propsy: Brak (komponent najwyższego poziomu)

### SnackFormProgress
- Opis komponentu: Wyświetla wskaźnik postępu w formularzu w formie kropek lub pasków
- Główne elementy: Kontener z elementami wskazującymi postęp (kropki/paski)
- Obsługiwane interakcje: Opcjonalnie - nawigacja po kliknięciu na element postępu
- Obsługiwana walidacja: Brak
- Typy: ProgressProps
- Propsy: currentStep, totalSteps, onStepClick

### FormStep
- Opis komponentu: Bazowy komponent dla wszystkich kroków formularza
- Główne elementy: Nagłówek kroku, treść kroku, przyciski nawigacyjne (wstecz/dalej/pomiń)
- Obsługiwane interakcje: Przejście do następnego/poprzedniego kroku, pominięcie kroku
- Obsługiwana walidacja: Brak (realizowana przez komponenty potomne)
- Typy: StepProps
- Propsy: title, isOptional, canNext, onNext, onPrev, onSkip, children

### FormStepMeals
- Opis komponentu: Pierwszy krok formularza - wprowadzenie informacji o spożytych posiłkach
- Główne elementy: Textarea do wprowadzenia opisu spożytych posiłków
- Obsługiwane interakcje: Wprowadzanie tekstu, przejście do następnego kroku
- Obsługiwana walidacja: Niepuste pole tekstowe
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev

### FormStepSnackType
- Opis komponentu: Drugi krok formularza - wybór typu przekąski
- Główne elementy: Grupa radio buttonów z opcjami (słodka, słona, lekka, sycąca)
- Obsługiwane interakcje: Wybór opcji, przejście do następnego/poprzedniego kroku
- Obsługiwana walidacja: Wybrana jedna opcja
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev

### FormStepLocation
- Opis komponentu: Trzeci krok formularza - wybór lokalizacji
- Główne elementy: Grupa radio buttonów z opcjami (praca, dom, sklep, poza domem)
- Obsługiwane interakcje: Wybór opcji, przejście do następnego/poprzedniego kroku
- Obsługiwana walidacja: Wybrana jedna opcja
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev

### FormStepGoal
- Opis komponentu: Czwarty krok formularza - wybór celu dietetycznego
- Główne elementy: Grupa radio buttonów z opcjami (utrzymanie, redukcja, przyrost)
- Obsługiwane interakcje: Wybór opcji, przejście do następnego/poprzedniego kroku
- Obsługiwana walidacja: Wybrana jedna opcja
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev

### FormStepPreferredDiet
- Opis komponentu: Piąty krok formularza - wybór preferowanej diety
- Główne elementy: Grupa radio buttonów z opcjami (standard, wegetariańska, wegańska, bezglutenowa)
- Obsługiwane interakcje: Wybór opcji, przejście do następnego/poprzedniego kroku
- Obsługiwana walidacja: Wybrana jedna opcja
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev

### FormStepDietaryRestrictions
- Opis komponentu: Szósty krok formularza - wprowadzenie wykluczeń żywieniowych
- Główne elementy: Pole tekstowe z tagami lub lista checkboxów z popularnymi alergenami
- Obsługiwane interakcje: Dodawanie/usuwanie tagów, przejście do następnego/poprzedniego kroku, pominięcie kroku
- Obsługiwana walidacja: Brak (krok opcjonalny)
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev, onSkip

### FormStepCaloricLimit
- Opis komponentu: Siódmy krok formularza - wprowadzenie limitu kalorycznego
- Główne elementy: Pole numeryczne do wprowadzenia limitu kalorii
- Obsługiwane interakcje: Wprowadzanie liczby, przejście do następnego/poprzedniego kroku, pominięcie kroku
- Obsługiwana walidacja: Wartość musi być liczbą dodatnią
- Typy: StepProps
- Propsy: state, dispatch, onNext, onPrev, onSkip

### LoadingIndicator
- Opis komponentu: Wyświetla animację ładowania podczas generowania propozycji
- Główne elementy: Animowany wskaźnik, komunikat o ładowaniu
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: LoadingIndicatorProps
- Propsy: message

### SnackRecommendation
- Opis komponentu: Wyświetla wygenerowaną propozycję przekąski
- Główne elementy: Tytuł, opis, lista składników, instrukcje przygotowania, wartości odżywcze, przyciski akcji
- Obsługiwane interakcje: Odrzucenie propozycji i wygenerowanie nowej, zapisanie do ulubionych
- Obsługiwana walidacja: Brak
- Typy: SnackRecommendationProps
- Propsy: recommendation, onGenerateNew, onSaveToFavorites, isLoading

## 5. Typy
### FormState
```typescript
interface FormState {
  currentStep: number;
  totalSteps: number;
  meals_eaten: string;
  snack_type: SnackType | null;
  location: Location | null;
  goal: Goal | null;
  preferred_diet: PreferredDiet | null;
  dietary_restrictions: string[];
  caloric_limit: number | null;
  isLoading: boolean;
  recommendation: SnackDetailsResponse | null;
  error: string | null;
}
```

### FormAction
```typescript
type FormAction = 
  | { type: 'SET_MEALS', payload: string }
  | { type: 'SET_SNACK_TYPE', payload: SnackType }
  | { type: 'SET_LOCATION', payload: Location }
  | { type: 'SET_GOAL', payload: Goal }
  | { type: 'SET_PREFERRED_DIET', payload: PreferredDiet }
  | { type: 'SET_DIETARY_RESTRICTIONS', payload: string[] }
  | { type: 'SET_CALORIC_LIMIT', payload: number | null }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SKIP_STEP' }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_RECOMMENDATION', payload: SnackDetailsResponse }
  | { type: 'CLEAR_RECOMMENDATION' }
  | { type: 'SET_ERROR', payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_FORM' }
```

### StepProps
```typescript
interface StepProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
}
```

### ProgressProps
```typescript
interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}
```

### LoadingIndicatorProps
```typescript
interface LoadingIndicatorProps {
  message?: string;
}
```

### SnackRecommendationProps
```typescript
interface SnackRecommendationProps {
  recommendation: SnackDetailsResponse;
  onGenerateNew: () => void;
  onSaveToFavorites: () => void;
  isLoading: boolean;
}
```

## 6. Zarządzanie stanem
Stan formularza będzie zarządzany za pomocą hooka `useReducer` w komponencie najwyższego poziomu `GenerateSnackPage`. Pozwoli to na centralne zarządzanie stanem i łatwą nawigację między krokami. Dodatkowo, można użyć `localStorage` do tymczasowego zapisania stanu formularza, aby użytkownik mógł wrócić do wypełniania w późniejszym czasie.

### Niestandardowy hook useSnackGeneration
```typescript
function useSnackGeneration() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: string | null;
    data: SnackDetailsResponse | null;
  }>({
    isLoading: false,
    error: null,
    data: null,
  });

  const generateSnack = async (formData: GenerateSnackRequest) => {
    setState({ isLoading: true, error: null, data: null });
    try {
      const response = await fetch('/api/snacks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się wygenerować przekąski');
      }
      
      const data = await response.json();
      setState({ isLoading: false, error: null, data });
      return data;
    } catch (error) {
      setState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Nieznany błąd', 
        data: null 
      });
      throw error;
    }
  };

  return {
    ...state,
    generateSnack,
  };
}
```

## 7. Integracja API
Integracja z API będzie realizowana poprzez wysłanie żądania POST do endpointu `/api/snacks/generate` po wypełnieniu formularza. Żądanie będzie zgodne z interfejsem `GenerateSnackRequest`, a odpowiedź będzie zgodna z interfejsem `SnackDetailsResponse`.

### Przykład integracji
```typescript
const handleSubmit = async () => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    // Przygotowanie danych formularza
    const formData: GenerateSnackRequest = {
      meals_eaten: state.meals_eaten,
      snack_type: state.snack_type!,
      location: state.location!,
      goal: state.goal!,
      preferred_diet: state.preferred_diet!,
      dietary_restrictions: state.dietary_restrictions,
      caloric_limit: state.caloric_limit,
    };
    
    // Wywołanie API
    const recommendation = await snackGeneration.generateSnack(formData);
    
    // Aktualizacja stanu
    dispatch({ type: 'SET_RECOMMENDATION', payload: recommendation });
  } catch (error) {
    dispatch({ 
      type: 'SET_ERROR', 
      payload: error instanceof Error ? error.message : 'Nieznany błąd'
    });
  }
};
```

## 8. Interakcje użytkownika
### Nawigacja po formularzu
- Kliknięcie przycisku "Dalej" sprawdza walidację bieżącego kroku i przenosi do następnego
- Kliknięcie przycisku "Wstecz" przenosi do poprzedniego kroku bez walidacji
- Kliknięcie przycisku "Pomiń" przenosi do następnego kroku bez walidacji (tylko dla opcjonalnych kroków)
- Kliknięcie na element wskaźnika postępu może przenieść do wybranego kroku (opcjonalnie)

### Wypełnianie formularza
- Wprowadzanie tekstu w polu opisu posiłków
- Wybór opcji w krokach z radio buttonami
- Dodawanie/usuwanie tagów w polu wykluczeń żywieniowych
- Wprowadzanie liczby w polu limitu kalorycznego

### Generowanie propozycji
- Kliknięcie przycisku "Znajdź mi przekąskę" na ostatnim kroku wysyła formularz
- Podczas generowania wyświetlany jest wskaźnik ładowania
- Po wygenerowaniu wyświetlana jest propozycja przekąski

### Interakcje z propozycją
- Kliknięcie przycisku "Następna" odrzuca bieżącą propozycję i generuje nową
- Kliknięcie przycisku "Zapisz" dodaje propozycję do ulubionych

## 9. Warunki i walidacja
### Ogólne zasady walidacji
- Każdy wymagany krok musi być prawidłowo wypełniony przed przejściem do następnego
- Przed wysłaniem formularza sprawdzana jest kompletność i poprawność wszystkich danych

### Walidacja poszczególnych kroków
1. **FormStepMeals:**
   - Pole meals_eaten nie może być puste
   - Minimalna długość: 3 znaki

2. **FormStepSnackType:**
   - Musi być wybrana jedna z opcji SnackType

3. **FormStepLocation:**
   - Musi być wybrana jedna z opcji Location

4. **FormStepGoal:**
   - Musi być wybrana jedna z opcji Goal

5. **FormStepPreferredDiet:**
   - Musi być wybrana jedna z opcji PreferredDiet

6. **FormStepDietaryRestrictions:**
   - Krok opcjonalny, brak walidacji

7. **FormStepCaloricLimit:**
   - Krok opcjonalny, ale jeśli wprowadzono wartość:
     - Musi być liczbą
     - Musi być większa od 0
     - Musi być mniejsza niż 2000 (rozsądny limit dla przekąski)

## 10. Obsługa błędów
### Błędy walidacji formularza
- Wyświetlanie komunikatów o błędach pod odpowiednimi polami formularza
- Blokowanie przejścia do następnego kroku, jeśli walidacja nie przejdzie

### Błędy podczas generowania propozycji
- Wyświetlanie powiadomienia z informacją o błędzie
- Możliwość ponowienia próby lub powrotu do formularza
- Obsługa różnych kodów błędów HTTP (400, 401, 500)

### Błędy połączenia
- Wykrywanie problemów z połączeniem internetowym
- Wyświetlanie odpowiednich komunikatów
- Automatyczne ponowienie próby po przywróceniu połączenia

## 11. Kroki implementacji
1. Utworzenie struktury podstawowych komponentów w katalogu `src/components`
2. Implementacja typów i interfejsów w oddzielnym pliku `src/lib/types/snack-form.types.ts`
3. Stworzenie niestandardowego hooka `useSnackGeneration` w `src/lib/hooks/useSnackGeneration.ts`
4. Implementacja poszczególnych komponentów kroków formularza z podstawową walidacją
5. Implementacja komponentu wskaźnika postępu
6. Implementacja komponentu rekomendacji przekąski
7. Integracja wszystkich komponentów w głównym komponencie strony
8. Dodanie obsługi błędów i stanów ładowania
10. Implementacja zapisywania stanu formularza w localStorage
11. Optymalizacja UX i dostępności (obsługa klawiatury, komunikaty dla czytników ekranu)
12. Dodanie animacji przejść między krokami dla lepszego doświadczenia użytkownika 