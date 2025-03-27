export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availability: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          is_recurring: boolean | null
          start_time: string
          teacher_id: string
        }
        Insert: {
          day_of_week: number
          end_time: string
          id?: string
          is_recurring?: boolean | null
          start_time: string
          teacher_id: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          start_time?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          amount: number
          created_at: string
          end_time: string
          id: string
          lesson_type: string
          meeting_url: string | null
          notes: string | null
          start_time: string
          status: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_time: string
          id?: string
          lesson_type: string
          meeting_url?: string | null
          notes?: string | null
          start_time: string
          status?: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_time?: string
          id?: string
          lesson_type?: string
          meeting_url?: string | null
          notes?: string | null
          start_time?: string
          status?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_goals: {
        Row: {
          completed: boolean
          created_at: string
          current_value: number
          description: string | null
          id: string
          target_value: number
          title: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_value?: number
          description?: string | null
          id?: string
          target_value: number
          title: string
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_value?: number
          description?: string | null
          id?: string
          target_value?: number
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_method_id: string | null
          payment_type: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          payment_type: string
          status: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          payment_type?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_default: boolean | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          is_default?: boolean | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_default?: boolean | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string
          id: string
          is_verified: boolean | null
          language_level: string | null
          last_name: string
          native_language: string | null
          role: Database["public"]["Enums"]["user_role"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name: string
          id: string
          is_verified?: boolean | null
          language_level?: string | null
          last_name: string
          native_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string
          id?: string
          is_verified?: boolean | null
          language_level?: string | null
          last_name?: string
          native_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          student_id: string
          teacher_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          student_id: string
          teacher_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          student_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          currency: string
          end_date: string
          id: string
          payment_history_id: string | null
          plan_name: string
          price: number
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          currency?: string
          end_date: string
          id?: string
          payment_history_id?: string | null
          plan_name: string
          price: number
          start_date?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          currency?: string
          end_date?: string
          id?: string
          payment_history_id?: string | null
          plan_name?: string
          price?: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_payment_history_id_fkey"
            columns: ["payment_history_id"]
            isOneToOne: false
            referencedRelation: "payment_history"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          commission_rate: number | null
          education: string | null
          hourly_rate: number
          id: string
          introduction_video_url: string | null
          is_approved: boolean | null
          teaching_style: string | null
          years_experience: number | null
        }
        Insert: {
          commission_rate?: number | null
          education?: string | null
          hourly_rate?: number
          id: string
          introduction_video_url?: string | null
          is_approved?: boolean | null
          teaching_style?: string | null
          years_experience?: number | null
        }
        Update: {
          commission_rate?: number | null
          education?: string | null
          hourly_rate?: number
          id?: string
          introduction_video_url?: string | null
          is_approved?: boolean | null
          teaching_style?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          status: string
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      get_lesson_types: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
        }[]
      }
      get_teacher_rating: {
        Args: {
          teacher_id: string
        }
        Returns: {
          avg_rating: number
          total_reviews: number
        }[]
      }
    }
    Enums: {
      user_role: "student" | "teacher" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
