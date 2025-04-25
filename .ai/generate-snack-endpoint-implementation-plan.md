# API Endpoint Implementation Plan: Generate Snack Recommendation

## 1. Przegląd punktu końcowego
Endpoint `/api/snacks/generate` służy do generowania spersonalizowanych rekomendacji przekąsek na podstawie preferencji użytkownika. Wykorzystuje model AI do tworzenia rekomendacji przekąsek.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **Struktura URL**: `/api/snacks/generate`
- **Parametry**:
  - **Wymagane**:
    - `meals_eaten` (string): Informacje o posiłkach spożytych przez użytkownika
    - `snack_type` (enum): Typ przekąski ("słodka" | "słona" | "lekka" | "sycąca")
    - `location` (enum): Lokalizacja spożycia ("praca" | "dom" | "sklep" | "poza domem")
    - `goal` (enum): Cel dietetyczny ("utrzymanie" | "redukcja" | "przyrost")
    - `preferred_diet` (enum): Preferowana dieta ("standard" | "wegetariańska" | "wegańska" | "bezglutenowa")
    - `dietary_restrictions` (string[] | null): Lista ograniczeń dietetycznych
  - **Opcjonalne**:
    - `caloric_limit` (number | null): Ograniczenie kaloryczne dla przekąski

- **Request Body**:
```typescript
{
  "meals_eaten": string,
  "snack_type": SnackType,
  "location": Location,
  "goal": Goal,
  "preferred_diet": PreferredDiet,
  "dietary_restrictions": string[] | null,
  "caloric_limit": number | null
}
```

## 3. Wykorzystywane typy
- `GenerateSnackRequest`: Model żądania do generowania rekomendacji przekąski
- `SnackDetailsResponse`: Model odpowiedzi zawierający szczegóły wygenerowanej przekąski
- `SnackType`, `Location`, `Goal`, `PreferredDiet`: Typy wyliczeniowe z bazy danych
- `Snack`: Reprezentacja encji przekąski w bazie danych

## 4. Szczegóły odpowiedzi
- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:
```typescript
{
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
```

- **Kody błędów**:
  - 400 Bad Request - Nieprawidłowy format preferencji
  - 401 Unauthorized - Użytkownik nie jest uwierzytelniony
  - 500 Internal Server Error - Błąd generowania przez model AI

## 5. Przepływ danych
1. Endpoint odbiera żądanie POST z parametrami preferencji.
2. Dane wejściowe są walidowane przy użyciu schematu Zod.
3. Serwis SnackService przekształca preferencje w prompt dla modelu AI.
4. Serwis wykonuje żądanie do Openrouter.ai, aby wygenerować rekomendację przekąski.
5. Odpowiedź modelu AI jest przetwarzana i formatowana.
6. Wygenerowana przekąska jest zapisywana w tabeli `snacks` w bazie danych.
7. Szczegóły przekąski są zwracane jako odpowiedź API.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Wymagane uwierzytelnienie użytkownika (poprzez middleware Supabase)
- **Walidacja danych**: Wszystkie dane wejściowe są walidowane za pomocą Zod
- **Filtrowanie treści**: Upewnij się, że generowane treści nie zawierają szkodliwych lub nieodpowiednich treści
- **Limitowanie żądań**: Wprowadź limity częstotliwości żądań, aby zapobiec nadużyciom
- **Bezpieczna komunikacja z AI**: Użyj bezpiecznego połączenia HTTPS z usługą Openrouter.ai
- **Sanityzacja danych wyjściowych**: Upewnij się, że odpowiedź modelu AI jest bezpieczna przed zwróceniem do klienta

## 7. Obsługa błędów
- **Walidacja danych wejściowych**:
  - Brak wymaganych pól → 400 Bad Request z informacją o brakujących polach
  - Nieprawidłowe typy danych → 400 Bad Request z informacją o nieprawidłowym typie
  - Nieprawidłowe wartości enum → 400 Bad Request z informacją o dozwolonych wartościach
- **Błędy uwierzytelniania**:
  - Brak tokenu uwierzytelniającego → 401 Unauthorized
  - Wygasły token → 401 Unauthorized z informacją o ponownym logowaniu
- **Błędy serwisu AI**:
  - Timeout komunikacji z modelem AI → 500 Internal Server Error z informacją o ponownej próbie
  - Nieprawidłowa odpowiedź modelu AI → 500 Internal Server Error z informacją o niepowodzeniu generowania
- **Błędy bazy danych**:
  - Niepowodzenie zapisu do bazy danych → 500 Internal Server Error

## 8. Rozważania dotyczące wydajności
- **Buforowanie**: Rozważ buforowanie podobnych żądań, aby uniknąć wielokrotnego generowania podobnych przekąsek
- **Optymalizacja promptów**: Projektuj efektywne prompty dla modelu AI, aby uzyskać odpowiednie odpowiedzi
- **Asynchroniczne przetwarzanie**: Rozważ asynchroniczne generowanie rekomendacji dla złożonych żądań
- **Monitorowanie**: Monitoruj czasy odpowiedzi i koszty API modelu AI
- **Limity czasowe**: Ustaw rozsądne limity czasowe dla żądań do modelu AI

## 9. Etapy wdrożenia

1. **Utworzenie struktury katalogów**:
   ```
   src/
   ├── lib/
   │   └── services/
   │       ├── snack.service.ts       # Serwis do generowania i zarządzania przekąskami
   │       └── ai.service.ts          # Serwis do komunikacji z Openrouter.ai
   └── pages/
       └── api/
           └── snacks/
               └── generate.ts        # Endpoint API
   ```

2. **Implementacja schematu walidacji (src/lib/validation/snack.schema.ts)**:
   ```typescript
   import { z } from 'zod';
   import { SnackType, Location, Goal, PreferredDiet } from '../../../types';

   export const generateSnackSchema = z.object({
     meals_eaten: z.string().min(1, "Informacja o posiłkach jest wymagana"),
     snack_type: z.enum([...Object.values(SnackType)] as [string, ...string[]]),
     location: z.enum([...Object.values(Location)] as [string, ...string[]]),
     goal: z.enum([...Object.values(Goal)] as [string, ...string[]]),
     preferred_diet: z.enum([...Object.values(PreferredDiet)] as [string, ...string[]]),
     dietary_restrictions: z.array(z.string()),
     caloric_limit: z.number().nullable().optional()
   });
   ```

3. **Implementacja serwisu AI (src/lib/services/ai.service.ts)**:
   ```typescript
   import { GenerateSnackRequest } from '../../../types';

   export class AIService {
     private apiKey = import.meta.env.OPENROUTER_API_KEY;
     private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

     async generateSnackRecommendation(preferences: GenerateSnackRequest) {
       try {
         const prompt = this.buildPrompt(preferences);
         const response = await fetch(this.apiUrl, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${this.apiKey}`
           },
           body: JSON.stringify({
             model: 'anthropic/claude-3-haiku',
             messages: [{ role: 'user', content: prompt }],
             response_format: { type: 'json_object' }
           })
         });

         if (!response.ok) {
           throw new Error(`AI service error: ${response.status}`);
         }

         const data = await response.json();
         return this.parseAIResponse(data);
       } catch (error) {
         console.error('Error generating snack recommendation:', error);
         throw new Error('Failed to generate snack recommendation');
       }
     }

     private buildPrompt(preferences: GenerateSnackRequest): string {
       return `Generate a snack recommendation based on the following preferences:
         - Meals eaten today: ${preferences.meals_eaten}
         - Snack type: ${preferences.snack_type}
         - Location: ${preferences.location}
         - Dietary goal: ${preferences.goal}
         - Preferred diet: ${preferences.preferred_diet}
         - Dietary restrictions: ${preferences.dietary_restrictions.join(', ')}
         ${preferences.caloric_limit ? `- Caloric limit: ${preferences.caloric_limit} kcal` : ''}

         Respond with a JSON object that includes:
         - title: The name of the snack
         - description: A brief description
         - ingredients: List of ingredients
         - instructions: How to prepare the snack
         - nutritional info: kcal, protein (g), fat (g), carbohydrates (g), fibre (g)
       `;
     }

     private parseAIResponse(response: any) {
       const content = response.choices[0].message.content;
       return typeof content === 'string' ? JSON.parse(content) : content;
     }
   }
   ```

4. **Implementacja serwisu przekąsek (src/lib/services/snack.service.ts)**:
   ```typescript
   import { AIService } from './ai.service';
   import { SupabaseClient } from '@supabase/supabase-js';
   import { GenerateSnackRequest, Snack, SnackDetailsResponse } from '../../../types';

   export class SnackService {
     private aiService: AIService;

     constructor(private supabase: SupabaseClient) {
       this.aiService = new AIService();
     }

     async generateSnackRecommendation(preferences: GenerateSnackRequest): Promise<SnackDetailsResponse> {
       // Generate recommendation using AI
       const aiResponse = await this.aiService.generateSnackRecommendation(preferences);
       
       // Format the snack data
       const snackData: Omit<Snack, 'id' | 'created_at'> = {
         title: aiResponse.title,
         description: aiResponse.description || '',
         ingredients: aiResponse.ingredients || '',
         instructions: aiResponse.instructions || '',
         snack_type: preferences.snack_type,
         location: preferences.location,
         goal: preferences.goal,
         preferred_diet: preferences.preferred_diet,
         kcal: aiResponse.kcal || 0,
         protein: aiResponse.protein || 0,
         fat: aiResponse.fat || 0,
         carbohydrates: aiResponse.carbohydrates || 0,
         fibre: aiResponse.fibre || 0
       };
       
       // Save to database
       const { data, error } = await this.supabase
         .from('snacks')
         .insert(snackData)
         .select()
         .single();
         
       if (error) {
         console.error('Error saving snack to database:', error);
         throw new Error('Failed to save snack recommendation');
       }
       
       // Format database response as API response
       return {
         id: data.id,
         title: data.title,
         description: data.description || '',
         ingredients: data.ingredients || '',
         instructions: data.instructions || '',
         snack_type: data.snack_type,
         location: data.location,
         goal: data.goal,
         preferred_diet: data.preferred_diet,
         kcal: data.kcal,
         protein: data.protein,
         fat: data.fat,
         carbohydrates: data.carbohydrates,
         fibre: data.fibre,
         created_at: data.created_at
       };
     }
   }
   ```

5. **Implementacja endpointu API (src/pages/api/snacks/generate.ts)**:
   ```typescript
   import { APIRoute } from 'astro';
   import { generateSnackSchema } from '../../../lib/validation/snack.schema';
   import { SnackService } from '../../../lib/services/snack.service';
   import { GenerateSnackRequest } from '../../../types';

   export const prerender = false;

   export const POST: APIRoute = async ({ request, locals }) => {
     try {
       // Check authentication
       const supabase = locals.supabase;
       const { data: { session } } = await supabase.auth.getSession();
       
       if (!session) {
         return new Response(
           JSON.stringify({ error: 'Unauthorized' }),
           { status: 401, headers: { 'Content-Type': 'application/json' } }
         );
       }
       
       // Parse and validate request body
       const requestBody = await request.json();
       const validationResult = generateSnackSchema.safeParse(requestBody);
       
       if (!validationResult.success) {
         return new Response(
           JSON.stringify({ 
             error: 'Invalid request data', 
             details: validationResult.error.format() 
           }),
           { status: 400, headers: { 'Content-Type': 'application/json' } }
         );
       }
       
       // Generate snack recommendation
       const snackService = new SnackService(supabase);
       const snackRecommendation = await snackService.generateSnackRecommendation(
         validationResult.data as GenerateSnackRequest
       );
       
       // Return the recommendation
       return new Response(
         JSON.stringify(snackRecommendation),
         { status: 200, headers: { 'Content-Type': 'application/json' } }
       );
       
     } catch (error) {
       console.error('Error in snack generation endpoint:', error);
       
       return new Response(
         JSON.stringify({ 
           error: 'Internal server error', 
           message: error instanceof Error ? error.message : 'Unknown error' 
         }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
   };
   ```

6. **Dokumentacja**:
   - Zaktualizuj dokumentację API
   - Dodaj przykłady żądań i odpowiedzi
   - Zaktualizuj typedoc dla nowych serwisów i typów

7. **Wdrożenie**:
   - Przegląd kodu