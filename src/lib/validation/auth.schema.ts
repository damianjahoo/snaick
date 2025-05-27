import { z } from "zod";

/**
 * Schema for user registration
 */
export const registerSchema = z
  .object({
    email: z.string().min(1, "Email jest wymagany").email("Nieprawidłowy format email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę i jedną cyfrę"
      ),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

/**
 * Schema for user login
 */
export const loginSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Nieprawidłowy format email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

/**
 * Schema for password reset request
 */
export const passwordResetRequestSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Nieprawidłowy format email"),
});

/**
 * Schema for password reset confirmation
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, "Token jest wymagany"),
  newPassword: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę i jedną cyfrę"
    ),
});

// Export types inferred from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
