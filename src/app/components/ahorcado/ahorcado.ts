import { Component } from '@angular/core';
import { PALABRAS, ABC } from '../../data/palabras';

@Component({
  selector: 'app-ahorcado',
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado {

  palabras: string[] = PALABRAS;

  abecedario: string[] = ABC.split('');

  palabraSecreta: string = '';

  letrasElegidas: string[] = [];

  intentosRestantes: number = 6;

  juegoTerminado = false;

  gano = false;

  //inicioPartida = 0;

  ngOnInit() {

    const indice = Math.floor(
      Math.random() * this.palabras.length
    );

    this.palabraSecreta = this.palabras[indice];

    this.letrasElegidas = [];

    this.intentosRestantes = 6;

    this.juegoTerminado = false;

    this.gano = false;

    //this.inicioPartida = Date.now();

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

    this.juegoTerminado = true;

    this.gano = true;

    //this.guardarPartida();

  }

  if (this.intentosRestantes <= 0) {

      this.juegoTerminado = true;

      this.gano = false;

      //this.guardarPartida();

    }

  }
/*
  async guardarPartida() {

  const tiempoFinal = Math.floor(

    (Date.now() - this.inicioPartida)
    / 1000

  );

  await this.supabase
    .getClient()
    .from('partidas_ahorcado')
    .insert({

      user_id: this.auth.user()?.id,

      gano: this.gano,

      tiempo: tiempoFinal,

      letras_seleccionadas:
        this.letrasElegidas.length

    });

}*/

}
