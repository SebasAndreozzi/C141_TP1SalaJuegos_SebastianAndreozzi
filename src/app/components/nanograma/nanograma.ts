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
  celdas: CeldaEstado[][] = [];
  intentosRestantes = 5;
  gameOver = false;
  victoria = false;

  // Almacenar si una celda ya causó un error (para no descontar múltiples veces)
  private celdaEnError: boolean[][] = [];

  iniciarJuego(): void {
    this.juegoIniciado.set(true);
    this.iniciarNuevaPartida();
  }

  iniciarNuevaPartida(): void {
    this.nanograma = this.nanogramaService.getNanograma();
    this.intentosRestantes = 5;
    this.gameOver = false;
    this.victoria = false;
    this.celdas = [];
    this.celdaEnError = [];

    if (this.nanograma) {
      for (let i = 0; i < this.nanograma.rows; i++) {
        this.celdas[i] = [];
        this.celdaEnError[i] = [];
        for (let j = 0; j < this.nanograma.cols; j++) {
          this.celdas[i][j] = 'vacia';
          this.celdaEnError[i][j] = false;
        }
      }
    }

    console.log(this.celdas)
  }

  onLeftClick(row: number, col: number, event: MouseEvent): void {
    event.preventDefault();
    if (this.gameOver) return;

    const estadoAnterior = this.celdas[row][col];
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

    const estadoAnterior = this.celdas[row][col];
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

    this.celdas[row][col] = nuevoEstado;

    const esCorrecto = this.esCeldaCorrecta(row, col);
    const eraCorrectoAntes = this.estadoAnteriorCorrecto(row, col, estadoAnterior);
  
    if (eraCorrectoAntes && !esCorrecto && !this.celdaEnError[row][col]) {
      this.intentosRestantes--;
      this.celdaEnError[row][col] = true;
      if (this.intentosRestantes <= 0) {
        this.gameOver = true;
        this.victoria = false;
        this.guardarPartida();
      }
    }

    if (esCorrecto) {
      this.celdaEnError[row][col] = false;
    }

    if (!this.gameOver && this.verificarVictoria()) {
      this.gameOver = true;
      this.victoria = true;
      this.guardarPartida();
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
    const estado = this.celdas[row][col];
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
}