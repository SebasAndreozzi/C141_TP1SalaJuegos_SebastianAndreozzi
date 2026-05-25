import { Component, inject, signal } from '@angular/core';
import { Pregunta } from '../../models/pregunta';
import { PreguntadosService } from '../../services/preguntados';
import { PuntajeService } from '../../services/puntaje';
import { AuthService } from '../../services/auth';
import { Puntaje, Tabla } from '../../models/puntaje';
import { UserNamePipe } from '../../pipes/userName';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntados',
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados {

  private auth = inject(AuthService);
  private supaPuntaje = inject(PuntajeService);
  private preguntadosService = inject(PreguntadosService);
  userNameFormat = new UserNamePipe();

  juegoIniciado = signal<boolean>(false);
  loading = signal<boolean>(false);

  preguntas: Pregunta[] = [];

  preguntaActual = signal<Pregunta>({} as Pregunta);

  opciones: string[] = [];

  indicePregunta = signal<number>(0);

  puntaje = signal<number>(0);

  juegoTerminado = signal<boolean>(false);

  async iniciarJuego() {

    this.indicePregunta.set(0);

    this.puntaje.set(0);

    this.juegoTerminado.set(false);

    this.loading.set(true);

    await this.preguntadosService.loadPreguntas().then(() => {
      console.log(this.preguntadosService.preguntas);

      this.preguntas = this.preguntadosService.preguntas;

      if (this.preguntas.length > 0) {

        this.cargarPregunta();
      }

      this.juegoIniciado.set(true);
      this.loading.set(false);

    });
    
  }

  cargarPregunta() {

    this.preguntaActual.set(this.preguntas[this.indicePregunta()]);

    const pregunta = this.preguntaActual();

    if (!pregunta) {
      return;}

    this.opciones = [
      this.limpiarTexto(pregunta.respuesta_correcta),
      this.limpiarTexto(pregunta.respuestas_incorrectas[0]),
      ...pregunta.respuestas_incorrectas.slice(1).map((o) => this.limpiarTexto(o))
    ];

    this.mezclarOpciones();

  }

  mezclarOpciones() {
    this.opciones.sort( () => Math.random() - 0.5 );

  }

  responder(opcion: string) {

    if (opcion === this.preguntaActual().respuesta_correcta) {
      this.puntaje.update((val) => val + 1);

    }

    this.indicePregunta.update((val) => val + 1);

    if (this.indicePregunta() >= this.preguntas.length) {

      this.finalizarJuego();

      return;
    }

    this.cargarPregunta();

  }

  async finalizarJuego() {

    this.juegoTerminado.set(true);
    await this.guardarPartida();
    this.mostrarFinPartida();

  }

  async guardarPartida() {

    const table: Tabla = 'preguntadosPuntaje'
  
    const payload: Puntaje = {
      puntaje: this.puntaje(),
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
            Puntaje final: ${this.puntaje()}
          </div>
          <img src="/assets/preguntados/fin.png" alt="Imagen final" style="max-width: 150px;">
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

  limpiarTexto(texto: string): string {

    const txt = document.createElement('textarea');

    txt.innerHTML = texto;

    return txt.value;

  }

}
