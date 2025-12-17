import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 1. 타입 & 상수 정의 (Types & Constants)
export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export const POKEMON_TYPE_KO: Record<PokemonType, string> = {
  normal: '노말', fire: '불꽃', water: '물', electric: '전기', grass: '풀', ice: '얼음',
  fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레',
  rock: '바위', ghost: '고스트', dragon: '드래곤', dark: '악', steel: '강철', fairy: '페어리',
};

export const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '노말': '#A8A77A', '불꽃': '#EE8130', '물': '#6390F0', '전기': '#F7D02C',
    '풀': '#7AC74C', '얼음': '#96D9D6', '격투': '#C22E28', '독': '#A33EA1',
    '땅': '#E2BF65', '비행': '#A98FF3', '에스퍼': '#F95587', '벌레': '#A6B91A',
    '바위': '#B6A136', '고스트': '#735797', '드래곤': '#6F35FC', '악': '#705746',
    '강철': '#B7B7CE', '페어리': '#D685AD',
  };
  return colors[type] || '#68A090';
};

// 2. API 응답 데이터 타입 (Raw API Interfaces)
interface ApiLanguage {
  name: string;
  url: string;
}

interface ApiName {
  name: string;
  language: ApiLanguage;
}

interface ApiGenus {
  genus: string;
  language: ApiLanguage;
}

interface ApiFlavorText {
  flavor_text: string;
  language: ApiLanguage;
}

interface PokemonSpeciesApi {
  id: number;
  names: ApiName[];
  genera: ApiGenus[];
  flavor_text_entries: ApiFlavorText[];
}

interface ApiType {
  slot: number;
  type: {
    name: PokemonType;
    url: string;
  };
}

interface PokemonInfoApi {
  types: ApiType[];
}

// 3. 앱에서 사용할 가공된 데이터 타입 (Application Interfaces)
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

const getPoketDex = async (offset: number, limit: number): Promise<PokemonListResponse> => {
  const response = await axios.get<PokemonListResponse>(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export const getPoketDexKey = "getPoketDex";
export const useGetPoketDex = ({
  offset = 0,
  limit = 20,
}: { offset?: number; limit?: number }) => {
  return useQuery({
    queryKey: [getPoketDexKey, offset, limit],
    queryFn: () => getPoketDex(offset, limit),
    enabled: typeof offset === "number" && typeof limit === "number",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const getPokemonDetailKey = "getPokemonDetail";
export const useGetPokemonDetail = (pokemonId: string) => {
  return useQuery({
    queryKey: [getPokemonDetailKey, pokemonId],
    queryFn: async (): Promise<{ pokemon: PokemonDetail }> => {
      // 포켓몬 종 정보 조회 (한글 이름, 설명 등)
      const speciesRes = await axios.get<PokemonSpeciesApi>(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
      );

      const name = speciesRes.data.names.find(n => n.language.name === "ko")?.name ?? speciesRes.data.names[0].name;
      const koGenus = speciesRes.data.genera.find(g => g.language.name === 'ko')?.genus ?? '';

      // 줄바꿈 문자 제거 및 정리
      const koFlavor = speciesRes.data.flavor_text_entries
        .find(f => f.language.name === 'ko')
        ?.flavor_text
        ?.replace(/[\n\f]/g, ' ') ?? '';

      // 포켓몬 개체 정보 조회 (타입 등)
      const infoRes = await axios.get<PokemonInfoApi>(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );

      const types = infoRes.data.types.map(t => t.type.name);
      const koById = types.map(t => POKEMON_TYPE_KO[t] || t);

      return {
        pokemon: {
          id: speciesRes.data.id,
          name,
          types: koById,
          koGenus,
          koFlavor
        }
      };
    },
    enabled: typeof pokemonId === "string" && pokemonId.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false
  });
};
