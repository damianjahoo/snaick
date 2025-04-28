/**
 * Base class for OpenRouter errors
 */
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "authentication_error", details);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "rate_limit_error", details);
  }
}

/**
 * Error thrown when there's an issue with the model
 */
export class ModelError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "model_error", details);
  }
}

/**
 * Error thrown when there's a network issue
 */
export class NetworkError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "network_error", details);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "validation_error", details);
  }
}

/**
 * Error thrown when content policy is violated
 */
export class ContentPolicyError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "content_policy_error", details);
  }
}
