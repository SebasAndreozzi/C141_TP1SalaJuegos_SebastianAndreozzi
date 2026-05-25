import { User } from "@supabase/supabase-js";

export interface Puntaje {
  puntaje: number;
  uid: string|undefined;
  user_name: string;
}

export interface PuntajeAhorcado extends Puntaje {
  tiempo_s: number;
  letras_seleccionadas: number;
}
export type Tabla = 'ahorcadoPuntaje' | 'mayormenorPuntaje' | 'preguntadosPuntaje' | 'nanogramaPuntaje';