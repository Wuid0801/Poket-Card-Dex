export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface Pokemon {
  id: string | number;
  name?: string;
  enName?: string;
  koName?: string;
  url: string;
  types: string[];
  image?: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  koGenus: string;
  koFlavor: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

