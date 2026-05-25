import { Injectable, signal } from "@angular/core";
import { inject } from "@angular/core";
import { SupabaseService } from "./supabase";
import { Puntaje } from "../models/puntaje";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: "root" })

export class PuntajeService {
  private supabase = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);

  puntajeAhorcado = signal<Puntaje[]>([]);
  puntajeMayorMenor = signal<Puntaje[]>([]);
  puntajePreguntados = signal<Puntaje[]>([]);
  puntajeNanograma = signal<Puntaje[]>([]);

  constructor() {

    if (isPlatformBrowser(this.platformId)) {
        this.listenRealTimeScore('ahorcadoPuntaje');
        this.listenRealTimeScore('mayormenorPuntaje');
        this.listenRealTimeScore('preguntadosPuntaje');
        this.listenRealTimeScore('nanogramaPuntaje');
      }
  }

  async guardarPuntaje(table: string, payload: Puntaje): Promise<void>{
    
    const { error } = await this.supabase.getClient().from(table).insert(payload);

    if(error){
        console.log(error)
    }

  }

   async cargarPuntajes(){
    this.puntajeAhorcado.set(await this.obtenerPuntajes('ahorcadoPuntaje'));
    this.puntajeMayorMenor.set(await this.obtenerPuntajes('mayormenorPuntaje'));
    this.puntajePreguntados.set(await this.obtenerPuntajes('preguntadosPuntaje'));
    this.puntajeNanograma.set(await this.obtenerPuntajes('nanogramaPuntaje'));
  }

  async obtenerPuntajes(table: string): Promise<Puntaje[]>{
    const { data, error } = await this.supabase.getClient().from(table).select('*').order('puntaje', { ascending: false });
    if(error){
        console.log(error)
    }
    return data as Puntaje[];
  }

  listenRealTimeScore(table: string) {

    this.supabase.getClient()
      .channel(`puntaje-${table}`)
      .on(
        'postgres_changes', {event: 'INSERT', schema: 'public', table: table},
        async (payload) => { await this.cargarPuntajes();}
      )
      .subscribe();
  }

}