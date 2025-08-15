export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          is_correct: boolean | null
          question_id: string
          student_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          student_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          category: string
          created_at: string
          duration: number
          end_time: string | null
          id: string
          is_active: boolean
          start_time: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          duration?: number
          end_time?: string | null
          id?: string
          is_active?: boolean
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          duration?: number
          end_time?: string | null
          id?: string
          is_active?: boolean
          start_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          correct_option: string
          created_at: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          updated_at: string
        }
        Insert: {
          category: string
          correct_option: string
          created_at?: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          updated_at?: string
        }
        Update: {
          category?: string
          correct_option?: string
          created_at?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      scores: {
        Row: {
          created_at: string
          exam_id: string
          id: string
          is_published: boolean
          percentage: number
          score: number
          student_id: string
          total_questions: number
        }
        Insert: {
          created_at?: string
          exam_id: string
          id?: string
          is_published?: boolean
          percentage?: number
          score?: number
          student_id: string
          total_questions?: number
        }
        Update: {
          created_at?: string
          exam_id?: string
          id?: string
          is_published?: boolean
          percentage?: number
          score?: number
          student_id?: string
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "scores_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          category: string
          class: string
          created_at: string
          exam_code: string
          id: string
          is_submitted: boolean
          name: string
          started_at: string | null
          violations: number
        }
        Insert: {
          category: string
          class: string
          created_at?: string
          exam_code: string
          id?: string
          is_submitted?: boolean
          name: string
          started_at?: string | null
          violations?: number
        }
        Update: {
          category?: string
          class?: string
          created_at?: string
          exam_code?: string
          id?: string
          is_submitted?: boolean
          name?: string
          started_at?: string | null
          violations?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
