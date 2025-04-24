export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      snacks: {
        Row: {
          carbohydrates: number;
          created_at: string;
          description: string | null;
          fat: number;
          fibre: number;
          goal: Database["public"]["Enums"]["goal_enum"];
          id: number;
          ingredients: string | null;
          instructions: string | null;
          kcal: number;
          location: Database["public"]["Enums"]["location_enum"];
          preferred_diet: Database["public"]["Enums"]["preferred_diet_enum"];
          protein: number;
          snack_type: Database["public"]["Enums"]["snack_type_enum"];
          title: string;
        };
        Insert: {
          carbohydrates: number;
          created_at?: string;
          description?: string | null;
          fat: number;
          fibre: number;
          goal: Database["public"]["Enums"]["goal_enum"];
          id?: number;
          ingredients?: string | null;
          instructions?: string | null;
          kcal: number;
          location: Database["public"]["Enums"]["location_enum"];
          preferred_diet: Database["public"]["Enums"]["preferred_diet_enum"];
          protein: number;
          snack_type: Database["public"]["Enums"]["snack_type_enum"];
          title: string;
        };
        Update: {
          carbohydrates?: number;
          created_at?: string;
          description?: string | null;
          fat?: number;
          fibre?: number;
          goal?: Database["public"]["Enums"]["goal_enum"];
          id?: number;
          ingredients?: string | null;
          instructions?: string | null;
          kcal?: number;
          location?: Database["public"]["Enums"]["location_enum"];
          preferred_diet?: Database["public"]["Enums"]["preferred_diet_enum"];
          protein?: number;
          snack_type?: Database["public"]["Enums"]["snack_type_enum"];
          title?: string;
        };
        Relationships: [];
      };
      user_favourites: {
        Row: {
          added_at: string;
          snack_id: number;
          user_id: string;
        };
        Insert: {
          added_at?: string;
          snack_id: number;
          user_id: string;
        };
        Update: {
          added_at?: string;
          snack_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favourites_snack_id_fkey";
            columns: ["snack_id"];
            isOneToOne: false;
            referencedRelation: "snacks";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      goal_enum: "utrzymanie" | "redukcja" | "przyrost";
      location_enum: "praca" | "dom" | "sklep" | "poza domem";
      preferred_diet_enum: "standard" | "wegetariańska" | "wegańska" | "bezglutenowa";
      snack_type_enum: "słodka" | "słona" | "lekka" | "sycąca";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      goal_enum: ["utrzymanie", "redukcja", "przyrost"],
      location_enum: ["praca", "dom", "sklep", "poza domem"],
      preferred_diet_enum: ["standard", "wegetariańska", "wegańska", "bezglutenowa"],
      snack_type_enum: ["słodka", "słona", "lekka", "sycąca"],
    },
  },
} as const;
