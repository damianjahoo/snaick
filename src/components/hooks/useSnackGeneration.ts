import { useState, useEffect } from "react";
import type { GenerateSnackRequest, SnackDetailsResponse } from "../../types";

interface SnackGenerationState {
  isLoading: boolean;
  error: string | null;
  data: SnackDetailsResponse | null;
}

type NetworkStatus = "online" | "offline" | "reconnecting";

/**
 * Custom hook for generating snack recommendations
 * Handles the API call, state management, and error handling
 */
export function useSnackGeneration() {
  const [state, setState] = useState<SnackGenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(navigator.onLine ? "online" : "offline");
  const [retryCount, setRetryCount] = useState(0);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus("online");
      // If we were previously offline and have a pending request, retry
      if (retryCount > 0) {
        setNetworkStatus("reconnecting");
      }
    };

    const handleOffline = () => {
      setNetworkStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [retryCount]);

  /**
   * Generates a snack recommendation based on the form data
   * Includes error handling for network issues and API errors
   *
   * @param formData - The form data for generating a snack
   * @returns The generated snack recommendation
   * @throws Error if the API call fails
   */
  const generateSnack = async (formData: GenerateSnackRequest): Promise<SnackDetailsResponse> => {
    setState({ isLoading: true, error: null, data: null });

    // Handle offline state
    if (networkStatus === "offline") {
      setRetryCount((prev) => prev + 1);
      setState({
        isLoading: false,
        error: "Brak połączenia z internetem. Połącz się z siecią i spróbuj ponownie.",
        data: null,
      });
      throw new Error("Brak połączenia z internetem");
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch("/api/snacks/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different HTTP status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Nie udało się wygenerować przekąski";

        switch (response.status) {
          case 400:
            errorMessage = errorData.error || "Nieprawidłowe dane formularza";
            break;
          case 401:
            errorMessage = "Brak autoryzacji. Zaloguj się ponownie";
            break;
          case 429:
            errorMessage = "Zbyt wiele zapytań. Spróbuj ponownie za chwilę";
            break;
          case 500:
            errorMessage = "Błąd serwera. Spróbuj ponownie później";
            break;
          default:
            errorMessage = errorData.error || errorMessage;
        }

        setState({ isLoading: false, error: errorMessage, data: null });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setRetryCount(0);
      setState({ isLoading: false, error: null, data });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.name === "AbortError"
            ? "Przekroczono czas oczekiwania na odpowiedź"
            : error.message
          : "Nieznany błąd";

      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
      });

      // If aborted due to timeout and online, increment retry count
      if (error instanceof Error && error.name === "AbortError" && networkStatus === "online") {
        setRetryCount((prev) => prev + 1);
      }

      throw new Error(errorMessage);
    }
  };

  /**
   * Retry the last failed request
   */
  const retry = async (formData: GenerateSnackRequest): Promise<SnackDetailsResponse> => {
    setRetryCount((prev) => prev + 1);
    return generateSnack(formData);
  };

  return {
    ...state,
    networkStatus,
    retry,
    generateSnack,
  };
}
