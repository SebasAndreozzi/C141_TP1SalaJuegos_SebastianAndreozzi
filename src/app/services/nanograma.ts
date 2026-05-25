import { Injectable } from '@angular/core';
import { NanogramaModel } from '../models/nanograma';
import { NANO } from '../data/nanograma';

@Injectable({ providedIn: 'root' })
export class NanogramaService {
  private nanogramaBase: NanogramaModel;

  constructor() {

    const rowClues = this.calcularClaves(NANO.solution, NANO.rows, NANO.cols, 'row');
  
    const colClues = this.calcularClaves(NANO.solution, NANO.rows, NANO.cols, 'col');

    this.nanogramaBase = {
      rows: NANO.rows,
      cols: NANO.cols,
      rowClues,
      colClues,
      solution: NANO.solution
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
    
    return this.nanogramaBase;
  }
}