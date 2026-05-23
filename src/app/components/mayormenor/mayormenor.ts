import { Component, inject, signal } from '@angular/core';
import { Card } from '../../models/card';
import { PuntajeService } from '../../services/puntaje';
import { AuthService } from '../../services/auth';
import { MAZO } from '../../data/mazo';
import { Puntaje, Tabla } from '../../models/puntaje';
import { UserNamePipe } from '../../pipes/userName';
import Swal from 'sweetalert2'

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
  animando = signal<boolean>(false);

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
      this.mostrarFinPartida();


      return;
    }

    const acierto = (eleccion === 'mayor' && siguiente.valor > this.cartaActual.valor) || (eleccion === 'menor'&& siguiente.valor < this.cartaActual.valor);

    if (acierto) {
      this.puntaje++;

    }

    this.indice++;
    this.cartaActual = siguiente;
    this.animando.set(true);
  
    setTimeout(() => {
      this.animando.set(false);
    }, 300);
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

  mostrarFinPartida() {
    Swal.fire({
      title: 'Partida terminada',
      html: `
        <div style="font-size: 1.2rem; margin-bottom: 1rem;">
          Puntaje final: ${this.puntaje}
        </div>
        <img src="assets/cartas/inicio.png" alt="Imagen final" style="max-width: 150px;">
      `,
      showCancelButton: true,
      confirmButtonText: 'Reiniciar',
      cancelButtonText: 'Volver al inicio',
      reverseButtons: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#fc3130'
    }).then((result) => {
      if (result.isConfirmed) {
        this.iniciarJuego();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.juegoIniciado.set(false);
      }
    });
  }

}