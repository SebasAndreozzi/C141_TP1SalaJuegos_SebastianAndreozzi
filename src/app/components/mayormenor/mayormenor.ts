import { Component, inject, signal } from '@angular/core';
import { Card } from '../../models/card';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { MAZO } from '../../data/mazo';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  templateUrl: './mayormenor.html',
  styleUrls: ['./mayormenor.css']
})

export class MayorMenor {

  private supabase = inject(SupabaseService)
  private auth = inject(AuthService)

  juegoIniciado = signal<boolean>(false);
  juegoFinalizado = signal<boolean>(false);

  mazo: Card[] = MAZO;
  cartaActual!: Card;
  indice = 0;
  puntos = 0;

  iniciarJuego() {
    
    this.mezclarMazo();
    this.indice = 0;
    this.puntos = 0;
    this.cartaActual = this.mazo[0];
    this.juegoIniciado.set(true);
    this.juegoFinalizado.set(false);
  }

  mezclarMazo() {

    this.mazo.sort(() => Math.random() - 0.5);
  }

  adivinar(eleccion: string) {

    const siguiente = this.mazo[this.indice + 1];

    if (!siguiente) {

      this.juegoFinalizado.set(true);

      return;
    }

    const acerto = (eleccion === 'mayor' && siguiente.valor > this.cartaActual.valor) || (eleccion === 'menor'&& siguiente.valor < this.cartaActual.valor) || (eleccion === 'igual' && siguiente.valor === this.cartaActual.valor);

    if (acerto) {
      this.puntos++;

    }

    this.indice++;
    this.cartaActual = siguiente;
  }

  async cargarResultado() {

    await this.supabase.getClient()
      .from('partidas')
      .insert({

        user_id: this.auth.user()?.id,

        puntos: this.puntos

      });

  }

}