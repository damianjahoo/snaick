/**
 * Maps HTTP response status and error data to user-friendly error messages
 */
export function mapFavoritesError(status: number, errorData: { error?: string; message?: string }): string {
  if (status === 409) {
    return "Ta przekąska już znajduje się w Twoich ulubionych";
  }

  if (status === 404) {
    return "Nie znaleziono przekąski";
  }

  if (status === 401) {
    return "Musisz być zalogowany, aby dodać przekąskę do ulubionych";
  }

  // Handle RLS (Row Level Security) errors
  if (errorData.message && errorData.message.includes("row-level security policy")) {
    return "Problem z uwierzytelnieniem. Spróbuj się wylogować i zalogować ponownie.";
  }

  // Generic error fallback
  return errorData.error || "Nie udało się zapisać przekąski do ulubionych";
}

/**
 * Creates the request payload for adding a snack to favorites
 */
export function createFavoritesPayload(snackId: string | number): string {
  return JSON.stringify({ snack_id: snackId });
}

/**
 * Creates the fetch options for the favorites API request
 */
export function createFavoritesRequestOptions(payload: string): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    credentials: "include" as RequestCredentials,
  };
}
