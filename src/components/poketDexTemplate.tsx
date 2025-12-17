import { useEffect, useState, useMemo } from "react";
import Card from "./card";
import pokemonData from "../assets/json/pokeDB.json";

interface PokemonWithKo {
  id: string;
  enName: string;
  koName: string;
  url: string;
  types: string[];
}

const PoketDexTemplate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 20;

  // 검색어에 따른 필터링
  const filteredResults = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return (pokemonData as PokemonWithKo[]).filter((pokemon) => {

      // 소문자로 관리
      return (
        pokemon.enName.toLowerCase().includes(searchLower) ||
        pokemon.koName.includes(searchLower)
      );
    });
  }, [searchTerm]);

  // 페이지네이션 처리
  const offset = page * itemsPerPage;
  const paginatedResults = filteredResults.slice(offset, offset + itemsPerPage);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const previousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-100 p-4 rounded-lg">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="이름 검색 (예: pikachu, 피카츄)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={previousPage}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-600">
            {filteredResults.length > 0 ? `${page + 1} / ${totalPages}` : "0 / 0"}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          '{searchTerm}'에 대한 검색 결과가 없습니다.
        </div>
      )}

      {paginatedResults.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center">
          {paginatedResults.map((pokemon) => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};
export default PoketDexTemplate;
