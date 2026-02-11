// Types générés manuellement à partir de schema.sql
// À remplacer par `npx supabase gen types typescript` quand le projet est connecté

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
      profiles: {
        Row: {
          id: string
          full_name: string
          preferred_language: Database["public"]["Enums"]["language"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          preferred_language?: Database["public"]["Enums"]["language"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          preferred_language?: Database["public"]["Enums"]["language"]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          id: string
          name: string
          website: string | null
          region: Database["public"]["Enums"]["region"]
          plan: Database["public"]["Enums"]["plan_tier"]
          language: Database["public"]["Enums"]["language"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          website?: string | null
          region: Database["public"]["Enums"]["region"]
          plan?: Database["public"]["Enums"]["plan_tier"]
          language?: Database["public"]["Enums"]["language"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          website?: string | null
          region?: Database["public"]["Enums"]["region"]
          plan?: Database["public"]["Enums"]["plan_tier"]
          language?: Database["public"]["Enums"]["language"]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: Database["public"]["Enums"]["org_role"]
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: Database["public"]["Enums"]["org_role"]
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          id: string
          organization_id: string
          name: string
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          url?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          id: string
          site_id: string
          status: Database["public"]["Enums"]["audit_status"]
          score: number | null
          critical_count: number
          major_count: number
          minor_count: number
          pages_scanned: number
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          status?: Database["public"]["Enums"]["audit_status"]
          score?: number | null
          critical_count?: number
          major_count?: number
          minor_count?: number
          pages_scanned?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          status?: Database["public"]["Enums"]["audit_status"]
          score?: number | null
          critical_count?: number
          major_count?: number
          minor_count?: number
          pages_scanned?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          id: string
          audit_id: string
          url: string
          title: string | null
          status_code: number | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          url: string
          title?: string | null
          status_code?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          url?: string
          title?: string | null
          status_code?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      violations: {
        Row: {
          id: string
          audit_id: string
          page_id: string
          axe_rule_id: string
          wcag_criterion: string
          en_clause: string
          impact: Database["public"]["Enums"]["violation_impact"]
          description_fr: string
          description_nl: string
          recommendation_fr: string
          recommendation_nl: string
          html_snippet: string | null
          css_selector: string | null
          status: Database["public"]["Enums"]["violation_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          page_id: string
          axe_rule_id: string
          wcag_criterion: string
          en_clause: string
          impact: Database["public"]["Enums"]["violation_impact"]
          description_fr: string
          description_nl: string
          recommendation_fr?: string
          recommendation_nl?: string
          html_snippet?: string | null
          css_selector?: string | null
          status?: Database["public"]["Enums"]["violation_status"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          page_id?: string
          axe_rule_id?: string
          wcag_criterion?: string
          en_clause?: string
          impact?: Database["public"]["Enums"]["violation_impact"]
          description_fr?: string
          description_nl?: string
          recommendation_fr?: string
          recommendation_nl?: string
          html_snippet?: string | null
          css_selector?: string | null
          status?: Database["public"]["Enums"]["violation_status"]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "violations_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      declarations: {
        Row: {
          id: string
          site_id: string
          audit_id: string | null
          version: number
          status: Database["public"]["Enums"]["declaration_status"]
          language: Database["public"]["Enums"]["language"]
          conformity_level: Database["public"]["Enums"]["conformity_level"]
          content_html: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          audit_id?: string | null
          version?: number
          status?: Database["public"]["Enums"]["declaration_status"]
          language?: Database["public"]["Enums"]["language"]
          conformity_level?: Database["public"]["Enums"]["conformity_level"]
          content_html?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          audit_id?: string | null
          version?: number
          status?: Database["public"]["Enums"]["declaration_status"]
          language?: Database["public"]["Enums"]["language"]
          conformity_level?: Database["public"]["Enums"]["conformity_level"]
          content_html?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "declarations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "declarations_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_org_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      create_organization: {
        Args: {
          org_name: string
          org_website?: string
          org_region?: Database["public"]["Enums"]["region"]
          org_plan?: Database["public"]["Enums"]["plan_tier"]
          org_language?: Database["public"]["Enums"]["language"]
        }
        Returns: string
      }
    }
    Enums: {
      region: "wallonie" | "bruxelles" | "flandre"
      plan_tier: "starter" | "pro" | "enterprise"
      language: "fr" | "nl"
      audit_status: "pending" | "running" | "completed" | "failed"
      violation_impact: "critical" | "major" | "minor"
      violation_status: "new" | "in_progress" | "fixed" | "ignored"
      declaration_status: "draft" | "published"
      conformity_level: "full" | "partial" | "non_compliant"
      org_role: "owner" | "admin" | "member"
    }
    CompositeTypes: Record<string, never>
  }
}

// Helpers pour accéder aux types plus facilement
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
