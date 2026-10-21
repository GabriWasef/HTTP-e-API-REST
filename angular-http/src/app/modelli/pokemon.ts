export interface TipoPokemon {
  name: string;
  url: string;
}

export interface ListaTipi {
  count: number;
  next: string | null;
  previous: string | null;
  results: TipoPokemon[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // in decimetri
  weight: number; // in ettogrammi
  sprites: {
    front_default: string | null;
  };
}
