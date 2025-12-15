import { useState } from "react";
import useGetPoketDex from "../hooks/useGetPoket";
import Card from "./card";

const poketDexTemplate = () => {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const {
    data: poketDexData,
    isLoading,
    isError,
  } = useGetPoketDex({ offset, limit });

  const nextPage = () => setOffset((prev) => prev + limit);
  const previousPage = () => setOffset((prev) => Math.max(prev - limit, 0));

  const results = poketDexData?.results ?? [];

  if (isError) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <div>
        <button onClick={previousPage} disabled={offset === 0}>
          Previous
        </button>
        <button onClick={nextPage}>Next</button>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && results.length === 0 && (
        <div>포켓몬 데이터가 없습니다.</div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {results.map((pokemon: any) => (
            <Card key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};
export default poketDexTemplate;
