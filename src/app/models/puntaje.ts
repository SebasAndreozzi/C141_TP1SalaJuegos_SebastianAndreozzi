import { User } from "@supabase/supabase-js";

export interface Puntaje {
  id?: number;
  puntaje: number;
  uid: string|undefined;
  user_name: string;
  created_at?: string;
}

export interface PuntajeAhorcado extends Puntaje {
  tiempo_s: number;
  letras_seleccionadas: number;
}
export type Tabla = 'ahorcadoPuntaje' | 'mayormenorPuntaje' | 'preguntadosPuntaje' | 'nanogramaPuntaje';