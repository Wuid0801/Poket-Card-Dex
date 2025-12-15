import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getPoketDex = async (offset: number, limit: number) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export const getPoketDexKey = "getPoketDex";
const useGetPoketDex = ({
  offset = 0,
  limit = 20,
}: { offset?: number; limit?: number }) => {
  const query = useQuery({
    queryKey: [getPoketDexKey, offset, limit],
    queryFn: async () => {
      return await getPoketDex(offset, limit);
    },
    enabled: typeof offset === "number" && typeof limit === "number",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return query;
};

export const getPokemonDetailKey = "getPokemonDetail";
const useGetPokemonDetail = ({ pokemonId }: { pokemonId: string }) => {
  const query = useQuery({
    queryKey: [getPokemonDetailKey, pokemonId],
    queryFn: async () => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      return response.data;
    },
    enabled: typeof pokemonId === "string",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
  return query;
};

export default useGetPoketDex;
