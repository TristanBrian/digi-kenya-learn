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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_terms: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_current: boolean | null
          name: string
          start_date: string
          year: number
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_current?: boolean | null
          name: string
          start_date: string
          year: number
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_current?: boolean | null
          name?: string
          start_date?: string
          year?: number
        }
        Relationships: []
      }
      admissions: {
        Row: {
          admission_ref: string
          child_dob: string | null
          child_first_name: string
          child_gender: string | null
          child_last_name: string
          created_at: string
          grade_applying_for: string
          id: string
          notes: string | null
          parent_address: string | null
          parent_email: string | null
          parent_name: string
          parent_phone: string
          previous_school: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admission_ref: string
          child_dob?: string | null
          child_first_name: string
          child_gender?: string | null
          child_last_name: string
          created_at?: string
          grade_applying_for: string
          id?: string
          notes?: string | null
          parent_address?: string | null
          parent_email?: string | null
          parent_name: string
          parent_phone: string
          previous_school?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admission_ref?: string
          child_dob?: string | null
          child_first_name?: string
          child_gender?: string | null
          child_last_name?: string
          created_at?: string
          grade_applying_for?: string
          id?: string
          notes?: string | null
          parent_address?: string | null
          parent_email?: string | null
          parent_name?: string
          parent_phone?: string
          previous_school?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          priority: string | null
          published: boolean | null
          target_audience: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: string | null
          published?: boolean | null
          target_audience?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: string | null
          published?: boolean | null
          target_audience?: string | null
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string
          preferred_contact: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone: string
          preferred_contact?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string
          preferred_contact?: string | null
          status?: string | null
        }
        Relationships: []
      }
      exam_registrations: {
        Row: {
          exam_id: string
          id: string
          registered_at: string
          status: string
          student_id: string
        }
        Insert: {
          exam_id: string
          id?: string
          registered_at?: string
          status?: string
          student_id: string
        }
        Update: {
          exam_id?: string
          id?: string
          registered_at?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_registrations_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exam_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedules: {
        Row: {
          created_at: string
          end_time: string
          exam_date: string
          grade_level: string
          id: string
          max_registrations: number | null
          registration_open: boolean | null
          start_time: string
          subject_id: string | null
          term_id: string | null
          title: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          end_time: string
          exam_date: string
          grade_level: string
          id?: string
          max_registrations?: number | null
          registration_open?: boolean | null
          start_time: string
          subject_id?: string | null
          term_id?: string | null
          title: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string
          exam_date?: string
          grade_level?: string
          id?: string
          max_registrations?: number | null
          registration_open?: boolean | null
          start_time?: string
          subject_id?: string | null
          term_id?: string | null
          title?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_schedules_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_categories: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          grade_level: string | null
          id: string
          name: string
          term_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          grade_level?: string | null
          id?: string
          name: string
          term_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          grade_level?: string | null
          id?: string
          name?: string
          term_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_categories_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string
          fee_record_id: string
          id: string
          notes: string | null
          paid_by: string | null
          payment_method: string
          receipt_number: string | null
          student_id: string
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          fee_record_id: string
          id?: string
          notes?: string | null
          paid_by?: string | null
          payment_method: string
          receipt_number?: string | null
          student_id: string
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          fee_record_id?: string
          id?: string
          notes?: string | null
          paid_by?: string | null
          payment_method?: string
          receipt_number?: string | null
          student_id?: string
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_fee_record_id_fkey"
            columns: ["fee_record_id"]
            isOneToOne: false
            referencedRelation: "fee_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_records: {
        Row: {
          amount_paid: number
          balance: number | null
          created_at: string
          due_date: string | null
          id: string
          status: string | null
          student_id: string
          term_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          balance?: number | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: string | null
          student_id: string
          term_id: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          balance?: number | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: string | null
          student_id?: string
          term_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_records_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          featured: boolean | null
          id: string
          image_url: string
          school_id: string | null
          title: string
        }
        Insert: {
          caption?: string | null
          category?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url: string
          school_id?: string | null
          title: string
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string
          school_id?: string | null
          title?: string
        }
        Relationships: []
      }
      news_events: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          event_date: string | null
          event_location: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean | null
          school_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          event_date?: string | null
          event_location?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          school_id?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          event_date?: string | null
          event_location?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          school_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          admission_ref: string | null
          amount: number
          created_at: string
          id: string
          mpesa_receipt: string | null
          mpesa_transaction_id: string | null
          payer_email: string | null
          payer_phone: string
          payment_method: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admission_ref?: string | null
          amount: number
          created_at?: string
          id?: string
          mpesa_receipt?: string | null
          mpesa_transaction_id?: string | null
          payer_email?: string | null
          payer_phone: string
          payment_method?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admission_ref?: string | null
          amount?: number
          created_at?: string
          id?: string
          mpesa_receipt?: string | null
          mpesa_transaction_id?: string | null
          payer_email?: string | null
          payer_phone?: string
          payment_method?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          created_at: string
          grade: string | null
          id: string
          remarks: string | null
          score: number
          student_id: string
          subject_id: string
          teacher_id: string | null
          term_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade?: string | null
          id?: string
          remarks?: string | null
          score: number
          student_id: string
          subject_id: string
          teacher_id?: string | null
          term_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade?: string | null
          id?: string
          remarks?: string | null
          score?: number
          student_id?: string
          subject_id?: string
          teacher_id?: string | null
          term_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          admission_number: string
          created_at: string
          date_of_birth: string | null
          enrollment_date: string | null
          first_name: string
          gender: string | null
          grade: string
          id: string
          last_name: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          status: string | null
          stream: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          admission_number: string
          created_at?: string
          date_of_birth?: string | null
          enrollment_date?: string | null
          first_name: string
          gender?: string | null
          grade: string
          id?: string
          last_name: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          status?: string | null
          stream?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          admission_number?: string
          created_at?: string
          date_of_birth?: string | null
          enrollment_date?: string | null
          first_name?: string
          gender?: string | null
          grade?: string
          id?: string
          last_name?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          status?: string | null
          stream?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          grade_level: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          grade_level?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          grade_level?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          created_at: string
          day_of_week: string
          end_time: string
          grade_level: string
          id: string
          lecturer_name: string | null
          room: string | null
          start_time: string
          subject_id: string | null
          term_id: string | null
        }
        Insert: {
          created_at?: string
          day_of_week: string
          end_time: string
          grade_level: string
          id?: string
          lecturer_name?: string | null
          room?: string | null
          start_time: string
          subject_id?: string | null
          term_id?: string | null
        }
        Update: {
          created_at?: string
          day_of_week?: string
          end_time?: string
          grade_level?: string
          id?: string
          lecturer_name?: string | null
          room?: string | null
          start_time?: string
          subject_id?: string | null
          term_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_entries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_student_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student" | "parent" | "teacher"
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
    Enums: {
      app_role: ["admin", "student", "parent", "teacher"],
    },
  },
} as const
