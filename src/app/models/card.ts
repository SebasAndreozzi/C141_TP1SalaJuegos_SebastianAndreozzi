export interface Card {
  valor: number;
  palo: Palo;
  imagen: string;
}

export type Palo = 'C' | 'D' | 'H' | 'S';