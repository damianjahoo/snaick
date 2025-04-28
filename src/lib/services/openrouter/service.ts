import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import type {
  Message,
  SystemMessage,
  ModelParameters,
  ResponseFormat,
  ChatResponse,
  Model,
  JSONSchema,
} from "../../../types";
import {
  AuthenticationError,
  RateLimitError,
  ModelError,
  NetworkError,
  ValidationError,
  ContentPolicyError,
} from "./errors";

/**
 * Service for interacting with OpenRouter API
 */
export class OpenRouterService {
  private httpClient: AxiosInstance;
  private defaultModel: string;
  private defaultParams: ModelParameters;

  /**
   * Creates a new instance of OpenRouterService
   */
  constructor(config: { apiKey: string; defaultModel?: string; defaultParams?: ModelParameters; baseUrl?: string }) {
    if (!config.apiKey) {
      throw new AuthenticationError("API key is required");
    }

    this.defaultModel = config.defaultModel || "anthropic/claude-3-sonnet-20240229";
    this.defaultParams = config.defaultParams || {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
    };

    this.httpClient = axios.create({
      baseURL: config.baseUrl || "https://openrouter.ai/api/v1",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://your-domain.com",
        "X-Title": "Your Application Name",
      },
    });
  }

  /**
   * Sends a chat completion request to the OpenRouter API
   */
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
        const response = await this.httpClient.post("/chat/completions", {
          model: modelToUse,
          messages,
          ...(responseFormat && { response_format: responseFormat }),
          ...paramsToUse,
        });

        return this.processResponse(response.data, responseFormat);
      });
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  /**
   * Retrieves available models from the OpenRouter API
   */
  public async getAvailableModels(): Promise<Model[]> {
    try {
      const response = await this.httpClient.get("/models");
      return response.data.data.map((modelData: Record<string, unknown>) => ({
        id: modelData.id as string,
        name: modelData.name as string,
        provider: modelData.provider as string,
        tokenLimit: modelData.context_length as number,
        // Other properties mapping
      }));
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  /**
   * Creates a JSON response format specification
   */
  public createJsonResponseFormat(schemaName: string, schema: JSONSchema, strict = true): ResponseFormat {
    return {
      type: "json_schema",
      json_schema: {
        name: schemaName,
        strict,
        schema,
      },
    };
  }

  /**
   * Checks if the current model supports structured output (JSON schema)
   *
   * @returns boolean indicating if the model supports structured output
   */
  public isModelCapableOfStructuredOutput(): boolean {
    // List of models known to support structured output
    const modelsWithStructuredOutput = [
      "anthropic/claude-3-opus-20240229",
      "anthropic/claude-3-sonnet-20240229",
      "anthropic/claude-3-haiku-20240307",
      "openai/gpt-4-turbo",
      "openai/gpt-4",
      "openai/gpt-3.5-turbo",
      "google/gemini-pro",
      "google/gemini-1.5-pro",
      "meta-llama/llama-3-70b-instruct",
      "meta-llama/llama-3-8b-instruct",
      "mistral/mistral-large",
      "mistral/mistral-medium",
      "mistral/mistral-small",
    ];

    // Check if the current model is in the list of supported models
    return modelsWithStructuredOutput.includes(this.defaultModel);
  }

  /**
   * Validates model parameters
   */
  private validateParameters(parameters: ModelParameters): ModelParameters {
    if (parameters.temperature !== undefined && (parameters.temperature < 0 || parameters.temperature > 1)) {
      throw new ValidationError("Temperature must be between 0 and 1");
    }

    // Other validations can be added here

    return parameters;
  }

  /**
   * Creates a properly formatted system message
   */
  private buildSystemMessage(content: string): SystemMessage {
    return { role: "system", content };
  }

  /**
   * Processes the API response and extracts relevant data
   */
  private processResponse(rawResponse: unknown, responseFormat?: ResponseFormat): ChatResponse {
    const response = rawResponse as { choices?: { message?: { content?: string } }[]; model?: string };
    const choice = response.choices?.[0];
    if (!choice) {
      throw new ModelError("No response received from the model");
    }

    const content = choice.message?.content || "";
    const model = response.model || "";

    let parsedJson: unknown = undefined;

    if (responseFormat?.type === "json_schema" && content) {
      try {
        parsedJson = JSON.parse(content);
        // Schema validation could be added here
      } catch (error) {
        throw new ValidationError("Failed to parse JSON response", {
          content,
          error,
        });
      }
    }

    return {
      content,
      model,
      parsedJson,
    };
  }

  /**
   * Executes an operation with retry mechanism for transient errors
   */
  private async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry for certain error types
        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          error instanceof ContentPolicyError
        ) {
          throw error;
        }

        // Exponential backoff
        const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
  }

  /**
   * Handles API errors and maps them to appropriate error types
   */
  private handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data as Record<string, unknown>;

      if (status === 401) {
        throw new AuthenticationError("Invalid API key", data);
      }

      if (status === 429) {
        throw new RateLimitError("Rate limit exceeded", data);
      }

      if (status === 404) {
        throw new ModelError("Model does not exist or is not available", data);
      }

      if (status === 400) {
        const errorMessage =
          typeof data?.error === "object" &&
          data.error !== null &&
          "message" in data.error &&
          typeof data.error.message === "string"
            ? data.error.message
            : "Invalid request";
        throw new ValidationError(errorMessage, data);
      }

      if (status === 403) {
        if (
          typeof data?.error === "object" &&
          data.error !== null &&
          "code" in data.error &&
          data.error.code === "content_policy_violation"
        ) {
          throw new ContentPolicyError("Content policy violation", data);
        }
        throw new AuthenticationError("Insufficient permissions", data);
      }

      throw new NetworkError(`API error (${status})`, {
        status,
        data,
      });
    }

    throw new NetworkError("Unknown error", error);
  }
}
