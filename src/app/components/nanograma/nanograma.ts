import { Component, signal , inject } from '@angular/core';
import { NanogramaModel, CeldaEstado } from '../../models/nanograma';
import { NanogramaService } from '../../services/nanograma';
import { CommonModule } from '@angular/common';
import { PuntajeService } from '../../services/puntaje';
import { AuthService } from '../../services/auth';
import { UserNamePipe } from '../../pipes/userName';
import { Puntaje, Tabla } from '../../models/puntaje';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nanograma',
  imports: [CommonModule],
  templateUrl: './nanograma.html',
  styleUrls: ['./nanograma.css']
})
export class Nanograma {
  private auth = inject(AuthService)
  private supaPuntaje = inject(PuntajeService);
  private nanogramaService= inject(NanogramaService);
  userNameFormat = new UserNamePipe();

  juegoIniciado = signal<boolean>(false);

  nanograma: NanogramaModel | null = null;
  celdas = signal<CeldaEstado[][]>([]);
  celdaEnError = signal<boolean[][]>([]);
  intentosRestantes = 5;
  gameOver = false;
  victoria = false;

  iniciarJuego(): void {
    this.juegoIniciado.set(true);
    this.iniciarNuevaPartida();
  }

  iniciarNuevaPartida(): void {
    this.nanograma = this.nanogramaService.getNanograma();
    this.intentosRestantes = 5;
    this.gameOver = false;
    this.victoria = false;
    const nuevasCeldas: CeldaEstado[][] = [];
    const nuevosErrores: boolean[][] = [];

    if (this.nanograma) {
      for (let i = 0; i < this.nanograma.rows; i++) {
        nuevasCeldas[i] = [];
        nuevosErrores[i] = [];
        for (let j = 0; j < this.nanograma.cols; j++) {
          nuevasCeldas[i][j] = 'vacia';
          nuevosErrores[i][j] = false;
        }
      }
    }

    this.celdas.set(nuevasCeldas);
    this.celdaEnError.set(nuevosErrores);
  }

  onLeftClick(row: number, col: number, event: MouseEvent): void {
    event.preventDefault();
    if (this.gameOver) return;

    const estadoAnterior = this.celdas()[row][col];
    let nuevoEstado: CeldaEstado;
    
    if (estadoAnterior === 'llena') {
      nuevoEstado = 'vacia';
    } else {
      nuevoEstado = 'llena';
    }

    this.aplicarCambio(row, col, nuevoEstado, estadoAnterior);
  }

  onRightClick(row: number, col: number, event: MouseEvent): void {
    event.preventDefault();
    if (this.gameOver) return;

    const estadoAnterior = this.celdas()[row][col];
    let nuevoEstado: CeldaEstado;
    
    if (estadoAnterior === 'cruz') {
      nuevoEstado = 'vacia';
    } else {
      nuevoEstado = 'cruz';
    }

    this.aplicarCambio(row, col, nuevoEstado, estadoAnterior);
  }

  private aplicarCambio(row: number, col: number, nuevoEstado: CeldaEstado, estadoAnterior: CeldaEstado): void {
    if (this.gameOver) return;
    if (nuevoEstado === estadoAnterior) return;

    const nuevasCeldas = this.celdas().map(fila => [...fila]);
    nuevasCeldas[row][col] = nuevoEstado;
    this.celdas.set(nuevasCeldas);

    const esCorrecto = this.esCeldaCorrecta(row, col);
    const eraCorrectoAntes = this.estadoAnteriorCorrecto(row, col, estadoAnterior);
  
    if (eraCorrectoAntes && !esCorrecto && !this.celdaEnError()[row][col]) {
      this.intentosRestantes--;
      const nuevaMatriz = this.celdaEnError().map((fila, i) =>
      i === row ? fila.map((valor, j) => j === col ? true : valor) : fila
    );
    this.celdaEnError.set(nuevaMatriz);

      if (this.intentosRestantes <= 0) {
        this.gameOver = true;
        this.victoria = false;
        this.guardarPartida();
        this.mostrarFinPartida();
      }
    }

    if (esCorrecto) {
      const nuevaMatriz = this.celdaEnError().map((fila, i) =>
      i === row ? fila.map((valor, j) => j === col ? false : valor) : fila
    );
    this.celdaEnError.set(nuevaMatriz);
    }

    if (!this.gameOver && this.verificarVictoria()) {
      this.gameOver = true;
      this.victoria = true;
      this.guardarPartida();
      this.mostrarFinPartida();
    }
  }

  private estadoAnteriorCorrecto(row: number, col: number, estado: CeldaEstado): boolean {
    if (!this.nanograma) return false;
    const solucion = this.nanograma.solution[row][col];
    if (solucion) {
      return estado === 'llena';
    } else {
      return estado !== 'llena';
    }
  }

  private esCeldaCorrecta(row: number, col: number): boolean {
    if (!this.nanograma) return false;
    const solucion = this.nanograma.solution[row][col];
    const estado = this.celdas()[row][col];
    if (solucion) {
      return estado === 'llena';
    } else {
      return estado !== 'llena';
    }
  }

  private verificarVictoria(): boolean {
    if (!this.nanograma) return false;
    for (let i = 0; i < this.nanograma.rows; i++) {
      for (let j = 0; j < this.nanograma.cols; j++) {
        if (!this.esCeldaCorrecta(i, j)) {
          return false;
        }
      }
    }
    return true;
  }

  reiniciarPartida(): void {
    this.iniciarNuevaPartida();
  }

  obtenerClaveFila(index: number): number[] {
    return this.nanograma?.rowClues?.[index] || [];
  }

  obtenerClaveColumna(index: number): number[] {
    return this.nanograma?.colClues?.[index] || [];
  }

  get rowIndices(): number[] {
    return this.nanograma ? Array(this.nanograma.rows).fill(0).map((_, i) => i) : [];
  }

  get colIndices(): number[] {
    return this.nanograma ? Array(this.nanograma.cols).fill(0).map((_, i) => i) : [];
  }

  async guardarPartida() {
  
    const table: Tabla = 'nanogramaPuntaje'

    const payload: Puntaje = {
      puntaje: this.intentosRestantes,
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
          Puntaje final: ${this.intentosRestantes}
        </div>
        <img src="https://placehold.co/200x150.png" alt="Imagen final" style="max-width: 150px;">
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