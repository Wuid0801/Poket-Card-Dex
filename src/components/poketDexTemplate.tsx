import { useEffect, useState, useMemo } from "react";
import { PokemonCard } from "./card";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { Pokemon } from "../types/pokemon";
import pokemonData from "../assets/json/pokeDB.json";

const PoketDexTemplate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 20;

  // 검색어에 따른 필터링
  const filteredResults = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return (pokemonData as Pokemon[]).filter((pokemon) => {
      return (
        pokemon.name?.toLowerCase().includes(searchLower) ||
        pokemon.enName?.toLowerCase().includes(searchLower) ||
        pokemon.koName?.includes(searchLower) ||
        pokemon.id.toString().includes(searchLower)
      );
    });
  }, [searchTerm]);

  // 페이지네이션 처리
  const offset = page * itemsPerPage;
  const paginatedResults = filteredResults.slice(offset, offset + itemsPerPage);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-100 p-4 rounded-lg">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {filteredResults.length > 0 && (
          <div className="text-sm font-medium text-gray-600">
            총 {filteredResults.length}마리의 포켓몬
          </div>
        )}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          {searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '포켓몬 데이터가 없습니다.'}
        </div>
      )}

      {paginatedResults.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
            {paginatedResults.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
export default PoketDexTemplate;
