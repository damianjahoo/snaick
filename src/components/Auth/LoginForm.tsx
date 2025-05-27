import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { loginSchema } from "../../lib/validation/auth.schema";
import type { LoginInput } from "../../lib/validation/auth.schema";

interface LoginFormProps {
  className?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
    const result = loginSchema.safeParse(formData);

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({ general: data.message || "Nieprawidłowy email lub hasło" });
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
          setErrors({ general: data.message || "Wystąpił błąd podczas logowania" });
        }
        return;
      }

      // Success - redirect to main app
      window.location.href = "/generate";
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Wystąpił błąd połączenia. Spróbuj ponownie." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`bg-white/5 backdrop-blur-lg border border-white/10 text-white ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-transparent bg-clip-text">
          Logowanie
        </CardTitle>
        <CardDescription className="text-blue-100/70 text-center">Zaloguj się do swojego konta</CardDescription>
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
            />
            {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-blue-100">
                Hasło
              </label>
              <a href="/reset-password" className="text-xs text-blue-200 hover:text-blue-300 transition-colors">
                Zapomniałeś hasła?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-300/30 focus-visible:border-blue-200/50"
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-300 text-sm">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-200 text-black hover:bg-blue-300 focus-visible:ring-blue-300/30"
            disabled={isLoading}
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-blue-100/70">Nie masz jeszcze konta?</span>
          <a href="/register" className="ml-1 text-blue-200 hover:text-blue-300 transition-colors">
            Zarejestruj się
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
