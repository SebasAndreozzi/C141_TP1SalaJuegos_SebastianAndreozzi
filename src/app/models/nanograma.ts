export interface NanogramaModel {
  rows: number;
  cols: number;
  rowClues?: number[][];
  colClues?: number[][];
  solution: boolean[][];
}

export type CeldaEstado = 'vacia' | 'llena' | 'cruz';