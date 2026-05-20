import { User } from "@supabase/supabase-js";

export interface Puntaje {
  puntaje: number;
  uid: string|undefined;
  user_name: string;
}

export type Tabla = 'ahorcadoPuntaje' | 'mayormenorPuntaje' | 'preguntadosPuntaje' | 'nanogramaPuntaje';