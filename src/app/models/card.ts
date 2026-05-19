export interface Card {
  valor: number;
  palo: Palo;
  imagen: string;
}

type Palo = 'C' | 'D' | 'H' | 'S';