import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PokemonType, PokemonDetail, PokemonListResponse } from "../types/pokemon";
import { POKEMON_TYPE_KO } from "../constants/pokemon";

export type { PokemonType, PokemonDetail, PokemonListResponse } from "../types/pokemon";

// API 응답 데이터 타입 (Raw API Interfaces)
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
