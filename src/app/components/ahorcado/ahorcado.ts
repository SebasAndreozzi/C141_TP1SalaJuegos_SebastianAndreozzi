import { Component, signal, inject } from '@angular/core';
import { PALABRAS, ABC } from '../../data/palabras';
import { PuntajeService } from '../../services/puntaje';
import { Puntaje, Tabla } from '../../models/puntaje';
import { AuthService } from '../../services/auth';
import { UserNamePipe } from '../../pipes/userName';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado {

  private auth = inject(AuthService)
  private supaPuntaje = inject(PuntajeService);
  userNameFormat = new UserNamePipe();

  palabras: string[] = PALABRAS;

  abecedario: string[] = ABC.split('');

  palabraSecreta!: string;

  letrasElegidas!: string[];

  intentosRestantes!: number;

  juegoIniciado = signal<boolean>(false);

  rondaTerminada = signal<boolean>(false);

  gano = signal<boolean>(false);

  inicioPartida!: number;

  puntaje!: number;

  iniciarJuego() {

    this.juegoIniciado.set(true);

    const indice = Math.floor(
      Math.random() * this.palabras.length
    );

    this.palabraSecreta = this.palabras[indice];

    this.letrasElegidas = [];

    this.intentosRestantes = 6;

    this.rondaTerminada.set(false);

    this.gano.set(false);

    this.inicioPartida = Date.now();

  }

  mostrarPalabra(): string[] {

    return this.palabraSecreta.split('').map(letra => this.letrasElegidas.includes(letra) ? letra : '_');

  }

  seleccionarLetra(letra: string) {

    this.letrasElegidas.push(letra);

    if (!this.palabraSecreta.includes(letra)) {
      this.intentosRestantes--;

    }
    this.verificarEstado();

  }

  verificarEstado() {

  const gano = this.palabraSecreta.split('').every(letra => this.letrasElegidas.includes(letra));

  if (gano) {

    this.rondaTerminada.set(true);

    this.gano.set(true);

    this.guardarPartida();

  }

  if (this.intentosRestantes <= 0) {

      this.rondaTerminada.set(true);

      this.gano.set(false);

      this.guardarPartida();

    }

  }

  async guardarPartida() {

    const tiempoFinal = Math.floor( (Date.now() - this.inicioPartida) / 1000 );

    this.puntaje = Math.floor((this.intentosRestantes / tiempoFinal) * 100);

    const table: Tabla = 'ahorcadoPuntaje'

    const payload: Puntaje = {
      puntaje: this.puntaje,
      uid: this.auth.user()?.id,
      user_name: this.userNameFormat.transform(this.auth.userEmail())
    }

    await this.supaPuntaje.guardarPuntaje(table, payload);
    this.mostrarFinPartida();
      
  }

  mostrarFinPartida() {
      Swal.fire({
        title: (this.gano() ? 'Ganaste :D' : 'Perdiste :('),
        html: `
          <div style="font-size: 1.2rem; margin-bottom: 1rem;">
            Puntaje final: ${this.puntaje}
          </div>
          <img src="assets/ahorcado/${(this.gano() ? 'victoria' : '6')}.png" alt="Imagen final" style="max-width: 150px;">
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


