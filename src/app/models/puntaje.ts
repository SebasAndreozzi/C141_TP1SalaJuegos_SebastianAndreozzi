import { User } from "@supabase/supabase-js";

export interface Puntaje {
  id?: number;
  puntaje: number;
  uid: string|undefined;
  user_name: string;
  created_at?: string;
}

export type Tabla = 'ahorcadoPuntaje' | 'mayormenorPuntaje' | 'preguntadosPuntaje' | 'nanogramaPuntaje';