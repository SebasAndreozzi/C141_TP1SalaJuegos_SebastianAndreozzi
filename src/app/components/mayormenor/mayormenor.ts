import { Component, inject, signal } from '@angular/core';
import { Card } from '../../models/card';
import { PuntajeService } from '../../services/puntaje';
import { AuthService } from '../../services/auth';
import { MAZO } from '../../data/mazo';
import { Puntaje, Tabla } from '../../models/puntaje';
import { UserNamePipe } from '../../pipes/userName';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  templateUrl: './mayormenor.html',
  styleUrls: ['./mayormenor.css']
})

export class MayorMenor {

  private supaPuntaje = inject(PuntajeService);
  private auth = inject(AuthService)
  userNameFormat = new UserNamePipe();

  juegoIniciado = signal<boolean>(false);
  juegoFinalizado = signal<boolean>(false);

  mazo: Card[] = MAZO;
  cartaActual!: Card;
  indice!:number;
  puntaje!:number;

  iniciarJuego() {
    
    this.mezclarMazo();
    this.indice = 0;
    this.puntaje = 0;
    this.cartaActual = this.mazo[0];
    this.juegoIniciado.set(true);
    this.juegoFinalizado.set(false);
  }

  mezclarMazo() {

    this.mazo.sort(() => Math.random() - 0.5);
  }

  async adivinar(eleccion: string) {

    const siguiente = this.mazo[this.indice + 1];

    if (!siguiente) {

      this.juegoFinalizado.set(true);
      await this.guardarPartida();

      return;
    }

    const acierto = (eleccion === 'mayor' && siguiente.valor > this.cartaActual.valor) || (eleccion === 'menor'&& siguiente.valor < this.cartaActual.valor);

    if (acierto) {
      this.puntaje++;

    }

    this.indice++;
    this.cartaActual = siguiente;
  }

  async guardarPartida() {

    const table: Tabla = 'mayormenorPuntaje'
  
    const payload: Puntaje = {
      puntaje: this.puntaje,
      uid: this.auth.user()?.id,
      user_name: this.userNameFormat.transform(this.auth.userEmail())
    }

    await this.supaPuntaje.guardarPuntaje(table, payload);

  }

}