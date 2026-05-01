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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      task_list_invites: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          invited_by: string | null
          is_used: boolean | null
          list_id: number
          role: Database["public"]["Enums"]["role"] | null
          telegram_user_id: number | null
          token: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          is_used?: boolean | null
          list_id: number
          role?: Database["public"]["Enums"]["role"] | null
          telegram_user_id?: number | null
          token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          is_used?: boolean | null
          list_id?: number
          role?: Database["public"]["Enums"]["role"] | null
          telegram_user_id?: number | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_list_invites_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "task_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      task_lists: {
        Row: {
          created_at: string
          id: number
          list_color: string | null
          list_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          list_color?: string | null
          list_name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          list_color?: string | null
          list_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taskLists_userId_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          content: string
          created_at: string
          due_date: string | null
          id: string
          is_completed: boolean
          list_id: number
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          list_id: number
          title?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          list_id?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_listId_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "task_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          tg_id: number
          user_name: string
        }
        Insert: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          tg_id: number
          user_name?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          tg_id?: number
          user_name?: string
        }
        Relationships: []
      }
      users_in_list: {
        Row: {
          created_at: string
          id: number
          list_id: number | null
          role: Database["public"]["Enums"]["role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          list_id?: number | null
          role?: Database["public"]["Enums"]["role"]
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          list_id?: number | null
          role?: Database["public"]["Enums"]["role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usersInList_listId_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "task_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usersInList_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invite: { Args: { invite_token: string }; Returns: undefined }
    }
    Enums: {
      role: "owner" | "editor" | "viewer"
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
      role: ["owner", "editor", "viewer"],
    },
  },
} as const
