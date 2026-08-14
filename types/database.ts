export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pillars: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'MATKUL' | 'ORGANISASI' | 'PROYEK'
          semester: number | null
          sks: number | null
          jadwal: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'MATKUL' | 'ORGANISASI' | 'PROYEK'
          semester?: number | null
          sks?: number | null
          jadwal?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'MATKUL' | 'ORGANISASI' | 'PROYEK'
          semester?: number | null
          sks?: number | null
          jadwal?: Json | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          pillar_id: string | null
          title: string
          description: string | null
          category: string | null
          status: 'TO_DO' | 'DOING' | 'DONE'
          due_date: string | null
          is_ai_generated: boolean
          created_at: string
        }
        Insert: {
          id?: string
          pillar_id?: string | null
          title: string
          description?: string | null
          category?: string | null
          status?: 'TO_DO' | 'DOING' | 'DONE'
          due_date?: string | null
          is_ai_generated?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          pillar_id?: string | null
          title?: string
          description?: string | null
          category?: string | null
          status?: 'TO_DO' | 'DOING' | 'DONE'
          due_date?: string | null
          is_ai_generated?: boolean
          created_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          is_completed: boolean
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          is_completed?: boolean
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          is_completed?: boolean
        }
      }
      events: {
        Row: {
          id: string
          pillar_id: string
          title: string
          start_time: string
          end_time: string
        }
        Insert: {
          id?: string
          pillar_id: string
          title: string
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
          pillar_id?: string
          title?: string
          start_time?: string
          end_time?: string
        }
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
  }
}
