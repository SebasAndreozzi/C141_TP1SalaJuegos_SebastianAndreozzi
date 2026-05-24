export interface NanogramaModel {
  rows: number;
  cols: number;
  rowClues: number[][];
  colClues: number[][];
  solution: boolean[][];  // true = celda rellena, false = vacía
}

export type CeldaEstado = 'vacia' | 'llena' | 'cruz';