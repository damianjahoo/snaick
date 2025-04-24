import { z } from "zod";

// Define string literals for enums to use with Zod
const snackTypes = ["słodka", "słona", "lekka", "sycąca"] as const;
const locations = ["praca", "dom", "sklep", "poza domem"] as const;
const goals = ["utrzymanie", "redukcja", "przyrost"] as const;
const preferredDiets = ["standard", "wegetariańska", "wegańska", "bezglutenowa"] as const;

export const generateSnackSchema = z.object({
  meals_eaten: z.string().min(1, "Informacja o posiłkach jest wymagana"),
  snack_type: z.enum(snackTypes),
  location: z.enum(locations),
  goal: z.enum(goals),
  preferred_diet: z.enum(preferredDiets),
  dietary_restrictions: z.array(z.string()).nullable().default([]),
  caloric_limit: z.number().nullable().optional(),
});

export type GenerateSnackSchemaType = z.infer<typeof generateSnackSchema>;
