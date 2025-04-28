import type { AISnackResponse } from "../services/ai.service";

/**
 * Extracts and parses JSON from a text response that may contain additional content
 *
 * @param text The full response text from OpenRouter
 * @returns The parsed JSON object or null if no valid JSON found
 */
export function extractJsonFromText(text: string): Record<string, unknown> | null {
  try {
    // First try: Direct JSON parse if the entire text is JSON
    try {
      return JSON.parse(text);
    } catch {
      // Not a direct JSON string, continue with extraction
    }

    // Second try: Look for JSON in code blocks (```json {...} ```)
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch {
        // Invalid JSON in code block, continue
      }
    }

    // Third try: Find any JSON-like structure in the text
    const jsonPatterns = [
      // Match anything between curly braces that might be JSON
      /\{[\s\S]*?\}/g,
    ];

    for (const pattern of jsonPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        try {
          const parsed = JSON.parse(match[0]);
          // If we get here, it's valid JSON
          return parsed;
        } catch {
          // Not valid JSON, try next match
          continue;
        }
      }
    }

    // No valid JSON found
    return null;
  } catch {
    // Any unexpected errors during extraction
    return null;
  }
}

/**
 * Maps OpenRouter text response to the structured AISnackResponse format
 *
 * @param responseText The full text response from OpenRouter
 * @returns Structured AISnackResponse object
 */
export function mapOpenRouterToSnackResponse(responseText: string): AISnackResponse {
  // Extract JSON from the response text
  const parsed = extractJsonFromText(responseText);

  if (!parsed) {
    throw new Error("Could not extract valid JSON from the AI response");
  }

  // Convert to the expected format
  const snackResponse: AISnackResponse = {
    title: String(parsed.title || ""),
    description: String(parsed.description || ""),
    ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients.join("\n") : String(parsed.ingredients || ""),
    instructions: Array.isArray(parsed.instructions)
      ? parsed.instructions.join("\n")
      : String(parsed.instructions || ""),
    kcal: Number(parsed.kcal || 0),
    protein: Number(parsed.protein || 0),
    fat: Number(parsed.fat || 0),
    carbohydrates: Number(parsed.carbohydrates || 0),
    fibre: Number(parsed.fibre || 0),
  };

  return snackResponse;
}
