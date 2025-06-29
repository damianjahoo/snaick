import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { registerSchema } from "../../lib/validation/auth.schema";
import type { RegisterInput } from "../../lib/validation/auth.schema";

interface SignupFormProps {
  className?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<RegisterInput>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof FormErrors;
        newErrors[field] = error.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: data.message || "Użytkownik z tym adresem email już istnieje" });
        } else if (response.status === 400) {
          if (data.errors) {
            const newErrors: FormErrors = {};
            data.errors.forEach((error: { path: string[]; message: string }) => {
              const field = error.path[0] as keyof FormErrors;
              newErrors[field] = error.message;
            });
            setErrors(newErrors);
          } else {
            setErrors({ general: data.message || "Błąd walidacji danych" });
          }
        } else {
          setErrors({ general: data.message || "Wystąpił błąd podczas rejestracji" });
        }
        return;
      }

      // Success - show confirmation message
      setIsSuccess(true);
    } catch {
      setErrors({ general: "Wystąpił błąd połączenia. Spróbuj ponownie." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className={`bg-white/5 backdrop-blur-lg border border-white/10 text-white ${className || ""}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 text-transparent bg-clip-text">
            Rejestracja zakończona!
          </CardTitle>
          <CardDescription className="text-blue-100/70 text-center">Sprawdź swoją skrzynkę pocztową</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-green-500/10 border border-green-500/20 text-green-200 text-sm text-center">
            <p className="mb-2">
              <strong>Konto zostało utworzone pomyślnie!</strong>
            </p>
            <p>
              Wysłaliśmy link aktywacyjny na Twój adres email. Kliknij w link, aby potwierdzić swoje konto i móc się
              zalogować.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-center text-sm">
            <span className="text-blue-100/70">Masz już konto?</span>
            <a href="/login" className="ml-1 text-blue-200 hover:text-blue-300 transition-colors">
              Zaloguj się
            </a>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/5 backdrop-blur-lg border border-white/10 text-white ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-transparent bg-clip-text">
          Rejestracja
        </CardTitle>
        <CardDescription className="text-blue-100/70 text-center">
          Utwórz konto i zacznij korzystać z SnAIck
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-blue-100">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="twoj@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-300/30 focus-visible:border-blue-200/50"
              disabled={isLoading}
              required
            />
            {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-blue-100">
              Hasło
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 znaków"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-300/30 focus-visible:border-blue-200/50"
              disabled={isLoading}
              required
            />
            {errors.password && <p className="text-red-300 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100">
              Potwierdź hasło
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Powtórz hasło"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-300/30 focus-visible:border-blue-200/50"
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && <p className="text-red-300 text-sm">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-200 text-black hover:bg-blue-300 focus-visible:ring-blue-300/30"
            disabled={isLoading}
          >
            {isLoading ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-center text-sm">
          <span className="text-blue-100/70">Masz już konto?</span>
          <a href="/login" className="ml-1 text-blue-200 hover:text-blue-300 transition-colors">
            Zaloguj się
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
