import { Injectable } from '@angular/core';
import { NanogramaModel } from '../models/nanograma';

@Injectable({ providedIn: 'root' })
export class NanogramaService {
  private puzzleBase: NanogramaModel;

  constructor() {
    // Puzzle de ejemplo 5x5 (una "F" simple)
    const solution: boolean[][] = [
      [false, false, false, false, true, false, true, true, true, false],
      [false, false, false, false, false, true, true, true, false, false],
      [false, false, true, true, true, true, false, false, false, false],
      [false, true, false, false, true, true, false, false, false, false],
      [false, true, false, false, true, true, false, false, false, false],
      [false, true, true, true, true, true, true, false, false, false],
      [false, true, true, true, true, true, true, true, true, false],
      [false, true, true, true, true, true, true, true, true, false],
      [false, false, true, true, true, true, true, true, false, false],
      [false, false, false, true, true, true, true, false, false, false]
    ];

    const rows = 10, cols = 10;

    // Calcular pistas de fila
    const rowClues = this.calcularClaves(solution, rows, cols, 'row');
    // Calcular pistas de columna
    const colClues = this.calcularClaves(solution, rows, cols, 'col');

    this.puzzleBase = {
      rows,
      cols,
      rowClues,
      colClues,
      solution
    };
  }

  private calcularClaves(matriz: boolean[][], rows: number, cols: number, tipo: 'row' | 'col'): number[][] {
    const claves: number[][] = [];
    const longitud = tipo === 'row' ? rows : cols;

    for (let i = 0; i < longitud; i++) {
      const secuencia: number[] = [];
      let contador = 0;
      for (let j = 0; j < (tipo === 'row' ? cols : rows); j++) {
        const valor = tipo === 'row' ? matriz[i][j] : matriz[j][i];
        if (valor) {
          contador++;
        } else {
          if (contador > 0) {
            secuencia.push(contador);
            contador = 0;
          }
        }
      }
      if (contador > 0) secuencia.push(contador);
      if (secuencia.length === 0) secuencia.push(0);
      claves.push(secuencia);
    }
    return claves;
  }

  getNanograma(): NanogramaModel {
    // Retorna una copia para no modificar el original
    return JSON.parse(JSON.stringify(this.puzzleBase));
  }
}