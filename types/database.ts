export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PetType = 'cat' | 'dog' | 'rabbit' | 'fox' | 'bird'
export type PetState = 'happy' | 'tired' | 'focus' | 'celebrating' | 'sleeping'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          xp: number
          level: number
          pet_type: PetType
          pet_state: PetState
          focus_minutes: number
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          xp?: number
          level?: number
          pet_type?: PetType
          pet_state?: PetState
          focus_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          xp?: number
          level?: number
          pet_type?: PetType
          pet_state?: PetState
          focus_minutes?: number
          created_at?: string
        }
      }
      pillars: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'MATKUL' | 'ORGANISASI' | 'PROYEK'
          semester: number | null
          sks: number | null
          jadwal: Json | null
          metadata: Json | null
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
          metadata?: Json | null
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
          metadata?: Json | null
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
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
      custom_rewards: {
        Row: {
          id: string
          user_id: string
          title: string
          cost: number
          is_redeemed: boolean
          redeemed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          cost: number
          is_redeemed?: boolean
          redeemed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          cost?: number
          is_redeemed?: boolean
          redeemed_at?: string | null
          created_at?: string
        }
      }
      pomodoro_logs: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          duration: number
          completed: boolean
          xp_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          duration: number
          completed?: boolean
          xp_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          duration?: number
          completed?: boolean
          xp_earned?: number
          created_at?: string
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
