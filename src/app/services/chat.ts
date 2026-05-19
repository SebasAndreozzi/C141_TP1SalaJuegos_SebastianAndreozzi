import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { SupabaseService } from "./supabase";
import { isPlatformBrowser } from '@angular/common';
import { Message } from '../models/message';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private supabase = inject(SupabaseService)
  private platformId = inject(PLATFORM_ID);
  // Usamos un Signal para que el HTML se actualice automáticamente
  public mensajes = signal<Message[]>([]);

  constructor() {
    this.loadInitialMessages();

     if (isPlatformBrowser(this.platformId)) {
        this.listenRealTimeMessages();
    }
  }

  async loadInitialMessages() {
    const { data } = await this.supabase.getClient()
      .from('mensajes')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) this.mensajes.set(data as Message[]);
  }

  listenRealTimeMessages() {
    this.supabase.getClient()
      .channel('sala-publica')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, 
      async (payload) => {
        this.loadInitialMessages(); 
      })
      .subscribe();
  }

    async sendMessage(contenido: string, user_id: string, user_name: string) {

        await this.supabase.getClient().from('mensajes').insert({
            contenido,
            uid: user_id,
            user_name
        });
    }
}