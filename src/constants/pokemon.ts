import { PokemonType } from '../types/pokemon';

export const POKEMON_TYPE_KO: Record<PokemonType, string> = {
  normal: '노말',
  fire: '불꽃',
  water: '물',
  electric: '전기',
  grass: '풀',
  ice: '얼음',
  fighting: '격투',
  poison: '독',
  ground: '땅',
  flying: '비행',
  psychic: '에스퍼',
  bug: '벌레',
  rock: '바위',
  ghost: '고스트',
  dragon: '드래곤',
  dark: '악',
  steel: '강철',
  fairy: '페어리',
};

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  '노말': '#A8A77A',
  '불꽃': '#EE8130',
  '물': '#6390F0',
  '전기': '#F7D02C',
  '풀': '#7AC74C',
  '얼음': '#96D9D6',
  '격투': '#C22E28',
  '독': '#A33EA1',
  '땅': '#E2BF65',
  '비행': '#A98FF3',
  '에스퍼': '#F95587',
  '벌레': '#A6B91A',
  '바위': '#B6A136',
  '고스트': '#735797',
  '드래곤': '#6F35FC',
  '악': '#705746',
  '강철': '#B7B7CE',
  '페어리': '#D685AD',
};

export const getTypeColor = (type: string): string => {
  return POKEMON_TYPE_COLORS[type] || '#68A090';
};

export const POKEMON_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
export const POKEMON_OFFICIAL_ARTWORK_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

