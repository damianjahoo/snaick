import type { LoadingIndicatorProps } from "../../lib/types/snack-form.types";

export function LoadingIndicator({ message = "Ładowanie..." }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative h-12 w-12 mb-4">
        <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
      </div>
      <p className="text-center text-lg text-muted-foreground">{message}</p>
    </div>
  );
}
