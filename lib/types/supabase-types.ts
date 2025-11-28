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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      pembelian: {
        Row: {
          created_at: string
          id: string
          jumlah_total: number
          staff_id: string
          staff_name: string
          tanggal: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jumlah_total?: number
          staff_id: string
          staff_name: string
          tanggal?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jumlah_total?: number
          staff_id?: string
          staff_name?: string
          tanggal?: string
          updated_at?: string
        }
        Relationships: []
      }
      pembelian_detail: {
        Row: {
          created_at: string
          harga_beli: number
          id: string
          jumlah_total: number
          kode_stock: string
          nama: string
          pembelian_id: string
          qty: number
          satuan_utama: string | null
          updated_at: string
          variasi: Json | null
        }
        Insert: {
          created_at?: string
          harga_beli: number
          id?: string
          jumlah_total: number
          kode_stock: string
          nama: string
          pembelian_id: string
          qty: number
          satuan_utama?: string | null
          updated_at?: string
          variasi?: Json | null
        }
        Update: {
          created_at?: string
          harga_beli?: number
          id?: string
          jumlah_total?: number
          kode_stock?: string
          nama?: string
          pembelian_id?: string
          qty?: number
          satuan_utama?: string | null
          updated_at?: string
          variasi?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pembelian_detail_pembelian_id_fkey"
            columns: ["pembelian_id"]
            isOneToOne: false
            referencedRelation: "pembelian"
            referencedColumns: ["id"]
          },
        ]
      }
      pengeluaran: {
        Row: {
          created_at: string
          id: string
          jumlah_total: number
          keterangan: string | null
          staff_id: string
          staff_name: string
          tanggal: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jumlah_total?: number
          keterangan?: string | null
          staff_id: string
          staff_name: string
          tanggal?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jumlah_total?: number
          keterangan?: string | null
          staff_id?: string
          staff_name?: string
          tanggal?: string
          updated_at?: string
        }
        Relationships: []
      }
      pengeluaran_detail: {
        Row: {
          created_at: string
          id: string
          jumlah_total: number
          kategori: Database["public"]["Enums"]["pengeluaran_kategori"]
          keterangan: string | null
          pengeluaran_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jumlah_total: number
          kategori: Database["public"]["Enums"]["pengeluaran_kategori"]
          keterangan?: string | null
          pengeluaran_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jumlah_total?: number
          kategori?: Database["public"]["Enums"]["pengeluaran_kategori"]
          keterangan?: string | null
          pengeluaran_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pengeluaran_detail_pengeluaran_id_fkey"
            columns: ["pengeluaran_id"]
            isOneToOne: false
            referencedRelation: "pengeluaran"
            referencedColumns: ["id"]
          },
        ]
      }
      penjualan: {
        Row: {
          created_at: string
          id: string
          jumlah_total: number
          keterangan: string | null
          staff_id: string
          staff_name: string
          tanggal: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jumlah_total?: number
          keterangan?: string | null
          staff_id: string
          staff_name: string
          tanggal?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jumlah_total?: number
          keterangan?: string | null
          staff_id?: string
          staff_name?: string
          tanggal?: string
          updated_at?: string
        }
        Relationships: []
      }
      penjualan_detail: {
        Row: {
          created_at: string
          harga_jual: number
          id: string
          jumlah_total: number
          kode_stock: string
          nama: string
          penjualan_id: string
          qty: number
          satuan_utama: string | null
          updated_at: string
          variasi: Json | null
        }
        Insert: {
          created_at?: string
          harga_jual: number
          id?: string
          jumlah_total: number
          kode_stock: string
          nama: string
          penjualan_id: string
          qty: number
          satuan_utama?: string | null
          updated_at?: string
          variasi?: Json | null
        }
        Update: {
          created_at?: string
          harga_jual?: number
          id?: string
          jumlah_total?: number
          kode_stock?: string
          nama?: string
          penjualan_id?: string
          qty?: number
          satuan_utama?: string | null
          updated_at?: string
          variasi?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "penjualan_detail_penjualan_id_fkey"
            columns: ["penjualan_id"]
            isOneToOne: false
            referencedRelation: "penjualan"
            referencedColumns: ["id"]
          },
        ]
      }
      stock: {
        Row: {
          created_at: string
          harga_beli: number
          harga_jual: number
          id: string
          jumlah_stok: number
          kategori: string
          keterangan: string | null
          kode: string
          lokasi: Database["public"]["Enums"]["lokasi_type"]
          nama: string
          satuan_utama: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          harga_beli?: number
          harga_jual?: number
          id?: string
          jumlah_stok?: number
          kategori: string
          keterangan?: string | null
          kode: string
          lokasi?: Database["public"]["Enums"]["lokasi_type"]
          nama: string
          satuan_utama?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          harga_beli?: number
          harga_jual?: number
          id?: string
          jumlah_stok?: number
          kategori?: string
          keterangan?: string | null
          kode?: string
          lokasi?: Database["public"]["Enums"]["lokasi_type"]
          nama?: string
          satuan_utama?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stock_logs: {
        Row: {
          created_at: string
          id: string
          keluar: number
          keterangan: string | null
          masuk: number
          nama_stock: string | null
          reference_id: string | null
          reference_table: string | null
          staff_id: string | null
          staff_name: string | null
          stock_id: string
          stok_akhir: number
          tanggal: string
          tipe_pergerakan: Database["public"]["Enums"]["tipe_pergerakan_stok"]
        }
        Insert: {
          created_at?: string
          id?: string
          keluar?: number
          keterangan?: string | null
          masuk?: number
          nama_stock?: string | null
          reference_id?: string | null
          reference_table?: string | null
          staff_id?: string | null
          staff_name?: string | null
          stock_id: string
          stok_akhir: number
          tanggal?: string
          tipe_pergerakan: Database["public"]["Enums"]["tipe_pergerakan_stok"]
        }
        Update: {
          created_at?: string
          id?: string
          keluar?: number
          keterangan?: string | null
          masuk?: number
          nama_stock?: string | null
          reference_id?: string | null
          reference_table?: string | null
          staff_id?: string | null
          staff_name?: string | null
          stock_id?: string
          stok_akhir?: number
          tanggal?: string
          tipe_pergerakan?: Database["public"]["Enums"]["tipe_pergerakan_stok"]
        }
        Relationships: []
      }
      tim_penjualan_harian: {
        Row: {
          created_at: string
          id: string
          rekan: string
          staff_id: string
          staff_name: string
          updated_at: string
        }
        Insert: {
          created_at: string
          id?: string
          rekan: string
          staff_id: string
          staff_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          rekan?: string
          staff_id?: string
          staff_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      variasi_harga_barang: {
        Row: {
          created_at: string
          harga_jual: number
          id: string
          min_qty: number
          satuan: string
          stock_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          harga_jual: number
          id?: string
          min_qty?: number
          satuan: string
          stock_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          harga_jual?: number
          id?: string
          min_qty?: number
          satuan?: string
          stock_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "variasi_harga_barang_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stock"
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
      lokasi_type: "TOKO" | "TRUK"
      pengeluaran_kategori: "PARKIR" | "BENSIN" | "LAINNYA"
      tipe_pergerakan_stok:
        | "PENJUALAN"
        | "PEMBELIAN"
        | "MANUAL_MASUK"
        | "MANUAL_KELUAR"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      lokasi_type: ["TOKO", "TRUK"],
      pengeluaran_kategori: ["PARKIR", "BENSIN", "LAINNYA"],
      tipe_pergerakan_stok: [
        "PENJUALAN",
        "PEMBELIAN",
        "MANUAL_MASUK",
        "MANUAL_KELUAR",
      ],
    },
  },
} as const
