export interface Card {
  valor: number;
  palo: Palo;
  imagen: string;
}

type Palo = 'B' | 'C' | 'E' | 'O';