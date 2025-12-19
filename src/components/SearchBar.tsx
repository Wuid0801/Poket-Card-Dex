import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "이름 검색 (예: pikachu, 피카츄, 025)",
}) => {
  return (
    <div className="w-full sm:w-auto">
      <div className="relative flex items-center w-full sm:w-80 rounded-full bg-white shadow-sm border border-gray-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all">
        <svg
          aria-hidden="true"
          className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
      </div>
    </div>
  );
};
