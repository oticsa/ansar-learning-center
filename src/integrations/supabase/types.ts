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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      assignment_responses: {
        Row: {
          assignment_id: string
          attachment_url: string | null
          audio_feedback_url: string | null
          feedback: string | null
          grade: number | null
          graded_at: string | null
          graded_by: string | null
          id: string
          response_text: string
          student_id: string
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          attachment_url?: string | null
          audio_feedback_url?: string | null
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          response_text?: string
          student_id: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          attachment_url?: string | null
          audio_feedback_url?: string | null
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          response_text?: string
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_responses_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          classroom_id: string | null
          created_at: string
          created_by: string
          description: string
          document_url: string | null
          due_date: string | null
          id: string
          student_id: string | null
          title: string
        }
        Insert: {
          classroom_id?: string | null
          created_at?: string
          created_by: string
          description?: string
          document_url?: string | null
          due_date?: string | null
          id?: string
          student_id?: string | null
          title: string
        }
        Update: {
          classroom_id?: string | null
          created_at?: string
          created_by?: string
          description?: string
          document_url?: string | null
          due_date?: string | null
          id?: string
          student_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      book_categories: {
        Row: {
          created_at: string
          emoji: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          emoji?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      book_chapters: {
        Row: {
          book_id: string
          chapter_number: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          book_id: string
          chapter_number?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          category_id: string | null
          cover_url: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string
          external_url: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string
          external_url?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string
          external_url?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "book_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          emoji: string
          icon_url: string | null
          id: string
          name: string
          section_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          emoji?: string
          icon_url?: string | null
          id?: string
          name: string
          section_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          emoji?: string
          icon_url?: string | null
          id?: string
          name?: string
          section_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "talk_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_questions: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          question_text: string
          sort_order: number
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          question_text: string
          sort_order?: number
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          question_text?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapter_questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "book_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_bans: {
        Row: {
          banned_at: string
          banned_by: string
          id: string
          reason: string | null
          room_id: string
          student_id: string
        }
        Insert: {
          banned_at?: string
          banned_by: string
          id?: string
          reason?: string | null
          room_id: string
          student_id: string
        }
        Update: {
          banned_at?: string
          banned_by?: string
          id?: string
          reason?: string | null
          room_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_bans_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          image_approved: boolean
          image_url: string | null
          message_text: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_approved?: boolean
          image_url?: string | null
          message_text?: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_approved?: boolean
          image_url?: string | null
          message_text?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          close_time: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          name: string
          open_days: number[] | null
          open_time: string | null
          schedule_type: string
        }
        Insert: {
          close_time?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          name: string
          open_days?: number[] | null
          open_time?: string | null
          schedule_type?: string
        }
        Update: {
          close_time?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          name?: string
          open_days?: number[] | null
          open_time?: string | null
          schedule_type?: string
        }
        Relationships: []
      }
      classroom_members: {
        Row: {
          added_at: string
          classroom_id: string
          id: string
          student_id: string
        }
        Insert: {
          added_at?: string
          classroom_id: string
          id?: string
          student_id: string
        }
        Update: {
          added_at?: string
          classroom_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_members_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      coach_feedback: {
        Row: {
          audio_url: string | null
          coach_id: string
          created_at: string
          feedback: string
          grade: number | null
          id: string
          submission_id: string
        }
        Insert: {
          audio_url?: string | null
          coach_id: string
          created_at?: string
          feedback?: string
          grade?: number | null
          id?: string
          submission_id: string
        }
        Update: {
          audio_url?: string | null
          coach_id?: string
          created_at?: string
          feedback?: string
          grade?: number | null
          id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "student_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          id: string
          subject: string
          template_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string
          id?: string
          subject?: string
          template_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          id?: string
          subject?: string
          template_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      learning_links: {
        Row: {
          created_at: string
          created_by: string
          id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          nickname: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          username: string | null
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          email: string
          full_name?: string
          id: string
          is_active?: boolean
          nickname?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          username?: string | null
        }
        Update: {
          avatar_url?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          nickname?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          username?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string
          created_at: string
          hint_text: string | null
          id: string
          image_url: string | null
          lesson_content: string | null
          lesson_image_url: string | null
          question_text: string
          sort_order: number
        }
        Insert: {
          category_id: string
          created_at?: string
          hint_text?: string | null
          id?: string
          image_url?: string | null
          lesson_content?: string | null
          lesson_image_url?: string | null
          question_text: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          hint_text?: string | null
          id?: string
          image_url?: string | null
          lesson_content?: string | null
          lesson_image_url?: string | null
          question_text?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          recipient_email: string
          recipient_type: string
          student_email: string
          student_name: string
          subject: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_email: string
          recipient_type?: string
          student_email: string
          student_name?: string
          subject?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_email?: string
          recipient_type?: string
          student_email?: string
          student_name?: string
          subject?: string
        }
        Relationships: []
      }
      section_config: {
        Row: {
          description: string
          id: string
          section_key: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          description?: string
          id?: string
          section_key: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          section_key?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_chapter_answers: {
        Row: {
          ai_feedback: string | null
          ai_grade: number | null
          answer_text: string
          coach_feedback: string | null
          coach_grade: number | null
          coach_id: string | null
          id: string
          question_id: string
          student_id: string
          submitted_at: string
        }
        Insert: {
          ai_feedback?: string | null
          ai_grade?: number | null
          answer_text?: string
          coach_feedback?: string | null
          coach_grade?: number | null
          coach_id?: string | null
          id?: string
          question_id: string
          student_id: string
          submitted_at?: string
        }
        Update: {
          ai_feedback?: string | null
          ai_grade?: number | null
          answer_text?: string
          coach_feedback?: string | null
          coach_grade?: number | null
          coach_id?: string | null
          id?: string
          question_id?: string
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_chapter_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "chapter_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          note_text: string
          student_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          note_text?: string
          student_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          note_text?: string
          student_id?: string
        }
        Relationships: []
      }
      student_section_assignments: {
        Row: {
          assigned_at: string
          id: string
          section_id: string
          student_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          section_id: string
          student_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          section_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_section_assignments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "talk_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      student_submissions: {
        Row: {
          audio_url: string | null
          category_id: string
          id: string
          question_index: number
          question_text: string
          response_text: string | null
          student_id: string
          submitted_at: string
        }
        Insert: {
          audio_url?: string | null
          category_id: string
          id?: string
          question_index: number
          question_text: string
          response_text?: string | null
          student_id: string
          submitted_at?: string
        }
        Update: {
          audio_url?: string | null
          category_id?: string
          id?: string
          question_index?: number
          question_text?: string
          response_text?: string | null
          student_id?: string
          submitted_at?: string
        }
        Relationships: []
      }
      talk_sections: {
        Row: {
          created_at: string
          description: string
          emoji: string
          id: string
          image_url: string | null
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          avatar_url: string
          full_name: string
          last_seen: string
          user_id: string
        }
        Insert: {
          avatar_url?: string
          full_name?: string
          last_seen?: string
          user_id: string
        }
        Update: {
          avatar_url?: string
          full_name?: string
          last_seen?: string
          user_id?: string
        }
        Relationships: []
      }
      writer_essays: {
        Row: {
          band_estimate: string | null
          content: string
          created_at: string
          id: string
          review: string | null
          task_type: string
          topic: string
          updated_at: string
          user_id: string
          word_count: number
        }
        Insert: {
          band_estimate?: string | null
          content?: string
          created_at?: string
          id?: string
          review?: string | null
          task_type?: string
          topic?: string
          updated_at?: string
          user_id: string
          word_count?: number
        }
        Update: {
          band_estimate?: string | null
          content?: string
          created_at?: string
          id?: string
          review?: string | null
          task_type?: string
          topic?: string
          updated_at?: string
          user_id?: string
          word_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "student"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "coach", "student"],
    },
  },
} as const
