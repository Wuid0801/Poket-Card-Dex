import useGetPokemonDetail from "../hooks/useGetPoket";

const Card = ({ pokemon }: { pokemon: any }) => {
  const pokemonId = pokemon.url.split("/").filter(Boolean).pop();

  const { data: pokemonData } = useGetPokemonDetail(pokemonId);
  console.log(pokemonData);

  
  return (
    <div className="w-[220px] h-[310px] border border-gray-300 rounded-md p-4">
      <div className="flex flex-col items-center justify-center">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
          alt={pokemon.name}
          className="w-[100px] h-[100px]"
        />
        <div className="text-sm text-center font-bold">{pokemon.name}</div>
      </div>
    </div>
  );
};

export default Card;
