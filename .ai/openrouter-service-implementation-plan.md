# Implementacja usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter służy do komunikacji z API OpenRouter.ai, umożliwiając aplikacji korzystanie z różnych modeli językowych (LLM) od dostawców takich jak OpenAI, Anthropic czy Google. Usługa zapewnia ujednolicony interfejs do wysyłania zapytań, konfigurowania parametrów modeli oraz obsługi odpowiedzi strukturalnych.

## 2. Opis konstruktora

```typescript
export class OpenRouterService {
  constructor(
    private readonly config: {
      apiKey: string;
      defaultModel?: string;
      defaultParams?: ModelParameters;
      baseUrl?: string;
    }
  ) {
    // Walidacja konfiguracji
    // Inicjalizacja klienta HTTP
    // Ustawienie domyślnych parametrów
  }
}
```

## 3. Publiczne metody i pola

### 3.1. Wysyłanie zapytań czatu

```typescript
async chat({
  messages,
  model,
  responseFormat,
  parameters,
}: {
  messages: Message[];
  model?: string;
  responseFormat?: ResponseFormat;
  parameters?: ModelParameters;
}): Promise<ChatResponse>
```

Metoda do wysyłania zapytań czatu do API OpenRouter. Obsługuje zarówno pojedyncze wiadomości, jak i całe konwersacje.

### 3.2. Pobieranie dostępnych modeli

```typescript
async getAvailableModels(): Promise<Model[]>
```

Pobiera listę dostępnych modeli z API OpenRouter wraz z ich parametrami i limitami.

### 3.3. Tworzenie formatów odpowiedzi

```typescript
createJsonResponseFormat<T>(
  schemaName: string, 
  schema: JSONSchema, 
  strict: boolean = true
): ResponseFormat
```

Tworzy format odpowiedzi JSON na podstawie podanego schematu.

## 4. Prywatne metody i pola

### 4.1. Klient HTTP

```typescript
private httpClient: AxiosInstance;
```

Instancja klienta HTTP (Axios) do komunikacji z API OpenRouter.

### 4.2. Walidacja parametrów

```typescript
private validateParameters(parameters: ModelParameters): ModelParameters
```

Waliduje i normalizuje parametry modelu.

### 4.3. Budowanie wiadomości systemowej

```typescript
private buildSystemMessage(content: string): SystemMessage
```

Tworzy prawidłowo sformatowaną wiadomość systemową.

### 4.4. Obsługa odpowiedzi

```typescript
private processResponse(
  rawResponse: OpenRouterResponse, 
  responseFormat?: ResponseFormat
): ChatResponse
```

Przetwarza odpowiedź API, walidując jej format i strukturę.

### 4.5. Mechanizm ponownych prób

```typescript
private async withRetry<T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3
): Promise<T>
```

Wykonuje operację z mechanizmem ponownych prób w przypadku błędów sieciowych.

## 5. Obsługa błędów

### 5.1. Własne klasy błędów

```typescript
export class OpenRouterError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class AuthenticationError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'authentication_error', details);
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'rate_limit_error', details);
  }
}

export class ModelError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'model_error', details);
  }
}

export class NetworkError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'network_error', details);
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'validation_error', details);
  }
}

export class ContentPolicyError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'content_policy_error', details);
  }
}
```

### 5.2. Centralna obsługa błędów

Implementacja mechanizmu centralnej obsługi błędów, który kategoryzuje błędy i zapewnia odpowiednie komunikaty.

```typescript
private handleApiError(error: any): never {
  // Logika kategoryzowania i mapowania błędów API na własne klasy błędów
  if (error.response?.status === 401) {
    throw new AuthenticationError('Nieprawidłowy klucz API');
  }
  
  if (error.response?.status === 429) {
    throw new RateLimitError('Przekroczono limit zapytań');
  }
  
  // Inne przypadki...
  
  throw new NetworkError('Nieznany błąd API', error);
}
```

## 6. Kwestie bezpieczeństwa

### 6.1. Bezpieczne przechowywanie kluczy API

Klucze API powinny być przechowywane w zmiennych środowiskowych, nie w kodzie.

```typescript
// W pliku .env
OPENROUTER_API_KEY=your-api-key-here

// W kodzie
import { env } from 'astro:env';

const openRouterService = new OpenRouterService({
  apiKey: env.OPENROUTER_API_KEY
});
```

### 6.2. Sanityzacja wejścia

Implementacja walidacji i sanityzacji wejścia przed wysłaniem do API.

```typescript
private sanitizeUserInput(input: string): string {
  // Usunięcie potencjalnie niebezpiecznych elementów
  return input.trim();
}
```

### 6.3. Kontrola kosztów

Implementacja mechanizmu kontroli kosztów, aby uniknąć nieoczekiwanych opłat.

```typescript
private async checkBudget(model: string, estimatedTokens: number): Promise<void> {
  // Sprawdzenie, czy żądanie mieści się w budżecie
  // Rzucenie wyjątku, jeśli przekracza limit
}
```

## 7. Plan wdrożenia krok po kroku

### 7.1. Edycja plików serwisu

Dodaj do pliku `src/types.ts` definicje typów:

```typescript
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SystemMessage extends Message {
  role: 'system';
}

export interface UserMessage extends Message {
  role: 'user';
}

export interface AssistantMessage extends Message {
  role: 'assistant';
}

export interface ModelParameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

export interface ResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: JSONSchema;
  };
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  tokenLimit: number;
  // Inne właściwości modelu
}

export interface ChatResponse {
  content: string;
  model: string;
  parsedJson?: any;
  // Metadane odpowiedzi
}

export type JSONSchema = {
  type: string;
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  [key: string]: any;
};
```

Rozszerz plik serwisu `src/lib/services/ai.service.ts`:

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  Message, SystemMessage, UserMessage, 
  ModelParameters, ResponseFormat, 
  ChatResponse, Model, JSONSchema 
} from './types';
import { 
  OpenRouterError, AuthenticationError, 
  RateLimitError, ModelError, NetworkError,
  ValidationError, ContentPolicyError 
} from './errors';

export class OpenRouterService {
  private httpClient: AxiosInstance;
  private defaultModel: string;
  private defaultParams: ModelParameters;
  
  constructor(config: {
    apiKey: string;
    defaultModel?: string;
    defaultParams?: ModelParameters;
    baseUrl?: string;
  }) {
    if (!config.apiKey) {
      throw new AuthenticationError('Klucz API jest wymagany');
    }
    
    this.defaultModel = config.defaultModel || 'anthropic/claude-3-sonnet-20240229';
    this.defaultParams = config.defaultParams || {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9
    };
    
    this.httpClient = axios.create({
      baseURL: config.baseUrl || 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com',
        'X-Title': 'Your Application Name'
      }
    });
  }
  
  public async chat({
    messages,
    model,
    responseFormat,
    parameters,
  }: {
    messages: Message[];
    model?: string;
    responseFormat?: ResponseFormat;
    parameters?: ModelParameters;
  }): Promise<ChatResponse> {
    const modelToUse = model || this.defaultModel;
    const paramsToUse = { ...this.defaultParams, ...parameters };
    
    try {
      return await this.withRetry(async () => {
        const response = await this.httpClient.post('/chat/completions', {
          model: modelToUse,
          messages,
          ...(responseFormat && { response_format: responseFormat }),
          ...paramsToUse
        });
        
        return this.processResponse(response.data, responseFormat);
      });
    } catch (error) {
      return this.handleApiError(error);
    }
  }
  
  public async getAvailableModels(): Promise<Model[]> {
    try {
      const response = await this.httpClient.get('/models');
      return response.data.data.map((model: any) => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        tokenLimit: model.context_length,
        // mapowanie innych właściwości
      }));
    } catch (error) {
      return this.handleApiError(error);
    }
  }
  
  public createJsonResponseFormat<T>(
    schemaName: string, 
    schema: JSONSchema, 
    strict: boolean = true
  ): ResponseFormat {
    return {
      type: 'json_schema',
      json_schema: {
        name: schemaName,
        strict,
        schema
      }
    };
  }
  
  private validateParameters(parameters: ModelParameters): ModelParameters {
    // Walidacja parametrów modelu
    if (parameters.temperature !== undefined && 
        (parameters.temperature < 0 || parameters.temperature > 1)) {
      throw new ValidationError('Parametr temperature musi być między 0 a 1');
    }
    
    // Inne walidacje...
    
    return parameters;
  }
  
  private buildSystemMessage(content: string): SystemMessage {
    return { role: 'system', content };
  }
  
  private processResponse(
    rawResponse: any, 
    responseFormat?: ResponseFormat
  ): ChatResponse {
    const choice = rawResponse.choices?.[0];
    if (!choice) {
      throw new ModelError('Brak odpowiedzi od modelu');
    }
    
    const content = choice.message?.content || '';
    const model = rawResponse.model;
    
    let parsedJson: any = undefined;
    
    if (responseFormat?.type === 'json_schema' && content) {
      try {
        parsedJson = JSON.parse(content);
        // Tutaj można dodać walidację względem schematu
      } catch (error) {
        throw new ValidationError('Nie można sparsować odpowiedzi JSON', {
          content,
          error
        });
      }
    }
    
    return {
      content,
      model,
      parsedJson
    };
  }
  
  private async withRetry<T>(
    operation: () => Promise<T>, 
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Nie ponawiaj prób dla pewnych rodzajów błędów
        if (error instanceof AuthenticationError ||
            error instanceof ValidationError ||
            error instanceof ContentPolicyError) {
          throw error;
        }
        
        // Exponential backoff
        const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw lastError;
  }
  
  private handleApiError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data as any;
      
      if (status === 401) {
        throw new AuthenticationError('Nieprawidłowy klucz API', data);
      }
      
      if (status === 429) {
        throw new RateLimitError('Przekroczono limit zapytań', data);
      }
      
      if (status === 404) {
        throw new ModelError('Model nie istnieje lub nie jest dostępny', data);
      }
      
      if (status === 400) {
        throw new ValidationError(data?.error?.message || 'Nieprawidłowe żądanie', data);
      }
      
      if (status === 403) {
        if (data?.error?.code === 'content_policy_violation') {
          throw new ContentPolicyError('Naruszenie zasad treści', data);
        }
        throw new AuthenticationError('Brak uprawnień', data);
      }
      
      throw new NetworkError(`Błąd API (${status})`, {
        status,
        data
      });
    }
    
    throw new NetworkError('Nieznany błąd', error);
  }
}
```

Utwórz plik błędów `src/lib/openrouter/errors.ts`:

```typescript
export class OpenRouterError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class AuthenticationError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'authentication_error', details);
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'rate_limit_error', details);
  }
}

export class ModelError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'model_error', details);
  }
}

export class NetworkError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'network_error', details);
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'validation_error', details);
  }
}

export class ContentPolicyError extends OpenRouterError {
  constructor(message: string, details?: any) {
    super(message, 'content_policy_error', details);
  }
}
```

### 7.2. Dodanie zależności

Dodaj wymagane zależności do projektu:

```bash
npm install axios
```

### 7.4. Przykład użycia

Przykład użycia w komponencie React (`src/components/AIChat.tsx`):

```tsx
import { useState } from 'react';
import { OpenRouterService } from '../lib/openrouter';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      const openRouter = new OpenRouterService({
        apiKey: import.meta.env.OPENROUTER_API_KEY
      });
      
      // Definiowanie schematu odpowiedzi
      const responseFormat = openRouter.createJsonResponseFormat(
        'chatResponse',
        {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            sources: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['answer']
        }
      );
      
      const result = await openRouter.chat({
        messages: [
          { role: 'system', content: 'Jesteś pomocnym asystentem, który udziela zwięzłych odpowiedzi.' },
          { role: 'user', content: input }
        ],
        responseFormat,
        parameters: {
          temperature: 0.7,
          max_tokens: 500
        }
      });
      
      if (result.parsedJson) {
        setResponse(result.parsedJson.answer);
      } else {
        setResponse(result.content);
      }
    } catch (error: any) {
      setResponse(`Błąd: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zadaj pytanie..."
          className="min-h-24"
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Wysyłanie...' : 'Wyślij'}
        </Button>
      </form>
      
      {response && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">Odpowiedź:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

Przykład użycia w endpoincie API (`src/pages/api/chat.ts`):

```typescript
import type { APIRoute } from 'astro';
import { OpenRouterService } from '../../lib/openrouter';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Brak wiadomości' }),
        { status: 400 }
      );
    }
    
    const openRouter = new OpenRouterService({
      apiKey: import.meta.env.OPENROUTER_API_KEY
    });
    
    const result = await openRouter.chat({
      messages: [
        { role: 'system', content: 'Jesteś pomocnym asystentem, który udziela zwięzłych odpowiedzi.' },
        { role: 'user', content: message }
      ]
    });
    
    return new Response(
      JSON.stringify({ 
        content: result.content,
        model: result.model
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Błąd API czatu:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Wystąpił błąd podczas przetwarzania żądania' 
      }),
      { status: 500 }
    );
  }
};
```
