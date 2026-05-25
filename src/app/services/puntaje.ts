import { Injectable } from "@angular/core";
import { inject } from "@angular/core";
import { SupabaseService } from "./supabase";
import { Puntaje } from "../models/puntaje";

@Injectable({ providedIn: "root" })

export class PuntajeService {
  private supabase = inject(SupabaseService);

  async guardarPuntaje(table: string, payload: Puntaje): Promise<void>{
    
    const { error } = await this.supabase.getClient().from(table).insert(payload);

    if(error){
        console.log(error)
    }

  }
}