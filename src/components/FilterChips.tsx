import React from "react";

interface FilterChipsProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
}

export const TYPE_DEFS = [
  { name: "normal", korean: "노말", color: "#A8A77A" },
  { name: "fire", korean: "불꽃", color: "#EE8130" },
  { name: "water", korean: "물", color: "#6390F0" },
  { name: "electric", korean: "전기", color: "#F7D02C" },
  { name: "grass", korean: "풀", color: "#7AC74C" },
  { name: "ice", korean: "얼음", color: "#96D9D6" },
  { name: "fighting", korean: "격투", color: "#C22E28" },
  { name: "poison", korean: "독", color: "#A33EA1" },
  { name: "ground", korean: "땅", color: "#E2BF65" },
  { name: "flying", korean: "비행", color: "#A98FF3" },
  { name: "psychic", korean: "에스퍼", color: "#F95587" },
  { name: "bug", korean: "벌레", color: "#A6B91A" },
  { name: "rock", korean: "바위", color: "#B6A136" },
  { name: "ghost", korean: "고스트", color: "#735797" },
  { name: "dragon", korean: "드래곤", color: "#6F35FC" },
  { name: "dark", korean: "악", color: "#705746" },
  { name: "steel", korean: "강철", color: "#B7B7CE" },
  { name: "fairy", korean: "페어리", color: "#D685AD" },
];

export function FilterChips({ selectedTypes, onTypeToggle }: FilterChipsProps) {
  return (
    <div className="max-w-5xl mx-auto mb-2">
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 text-sm sm:text-base font-medium text-left">
            타입 필터
          </h3>
          {selectedTypes.length > 0 && (
            <button
              onClick={() => selectedTypes.forEach((type) => onTypeToggle(type))}
              className="text-xs sm:text-sm text-gray-500 hover:text-red-600 underline"
            >
              필터 초기화
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPE_DEFS.map((type) => {
            const isSelected = selectedTypes.includes(type.name);
            return (
              <button
                key={type.name}
                onClick={() => onTypeToggle(type.name)}
                className={`text-white px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isSelected ? "scale-110" : "opacity-50 hover:opacity-100"
                }`}
                style={{ backgroundColor: type.color }}
              >
                {type.korean}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
