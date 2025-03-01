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
      car_availability: {
        Row: {
          car_id: number | null
          created_at: string
          end_date: string
          id: number
          start_date: string
          status: string
        }
        Insert: {
          car_id?: number | null
          created_at?: string
          end_date: string
          id?: number
          start_date: string
          status: string
        }
        Update: {
          car_id?: number | null
          created_at?: string
          end_date?: string
          id?: number
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_availability_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      car_brands: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      car_images: {
        Row: {
          car_id: number | null
          created_at: string
          id: number
          image_url: string
        }
        Insert: {
          car_id?: number | null
          created_at?: string
          id?: number
          image_url: string
        }
        Update: {
          car_id?: number | null
          created_at?: string
          id?: number
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          acceleration: string | null
          brand: string
          city: Database["public"]["Enums"]["moroccan_city"]
          created_at: string
          daily_rate: number
          description: string
          engine: string | null
          featured: boolean | null
          id: number
          location: string | null
          name: string
          phone_number: string | null
          power: string | null
          transmission: string | null
          user_id: string | null
        }
        Insert: {
          acceleration?: string | null
          brand: string
          city: Database["public"]["Enums"]["moroccan_city"]
          created_at?: string
          daily_rate: number
          description: string
          engine?: string | null
          featured?: boolean | null
          id?: number
          location?: string | null
          name: string
          phone_number?: string | null
          power?: string | null
          transmission?: string | null
          user_id?: string | null
        }
        Update: {
          acceleration?: string | null
          brand?: string
          city?: Database["public"]["Enums"]["moroccan_city"]
          created_at?: string
          daily_rate?: number
          description?: string
          engine?: string | null
          featured?: boolean | null
          id?: number
          location?: string | null
          name?: string
          phone_number?: string | null
          power?: string | null
          transmission?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_banned: boolean | null
          is_scammer: boolean | null
          location: string | null
          name: string
          phone_number: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_banned?: boolean | null
          is_scammer?: boolean | null
          location?: string | null
          name: string
          phone_number?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_banned?: boolean | null
          is_scammer?: boolean | null
          location?: string | null
          name?: string
          phone_number?: string | null
          user_type?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          car_id: number | null
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          seller_id: string | null
          transaction_type: string | null
          user_id: string | null
        }
        Insert: {
          car_id?: number | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          seller_id?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          car_id?: number | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          seller_id?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          car_id: number | null
          created_at: string
          end_date: string | null
          id: string
          order_id: string | null
          owner_id: string | null
          renter_id: string | null
          start_date: string | null
          status: string | null
          total_amount: number | null
        }
        Insert: {
          car_id?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          order_id?: string | null
          owner_id?: string | null
          renter_id?: string | null
          start_date?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          car_id?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          order_id?: string | null
          owner_id?: string | null
          renter_id?: string | null
          start_date?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      moroccan_city: "Casablanca" | "FES" | "RABAT" | "AGADIR" | "MARRAKECH"
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
