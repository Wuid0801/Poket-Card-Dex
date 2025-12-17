import React, { useEffect, useState } from 'react';
import { getTypeColor, useGetPokemonDetail } from '../hooks/useGetPoket';

interface Props {
    pokemonId: number | string;
    onClose: () => void;
}

const PokemonDetailModal = ({ pokemonId, onClose }: Props) => {
    const { data, isLoading, isError } = useGetPokemonDetail(String(pokemonId));
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // 스크롤바 너비 계산으로 움찔하는 현상 제어
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    if (!pokemonId) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div
                className={`bg-white rounded-2xl p-6 w-[90%] max-w-lg relative z-10 transition-all duration-300 transform shadow-2xl ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500">포켓몬 정보를 불러오는 중...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-10">
                        <p className="text-red-500 mb-2">정보를 불러오는데 실패했습니다.</p>
                        <button onClick={handleClose} className="text-blue-500 underline">닫기</button>
                    </div>
                ) : data && data.pokemon ? (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-sm font-bold text-gray-400 tracking-wider">
                                #{String(data.pokemon.id).padStart(4, '0')}
                            </span>
                            <h2 className="text-3xl font-extrabold text-gray-800 capitalize mt-1">
                                {data.pokemon.name}
                            </h2>
                            <div className="text-sm text-blue-600 font-medium mt-1">
                                {data.pokemon.koGenus}
                            </div>
                        </div>

                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-75 group-hover:scale-95 transition-transform duration-500"></div>
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.pokemon.id}.png`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.pokemon.id}.png`;
                                }}
                                alt={data.pokemon.name}
                                className="w-48 h-48 relative z-10 drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        <div className="flex gap-2 mb-6">
                            {data.pokemon.types.map((type: string) => (
                                <span
                                    key={type}
                                    className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm text-white bg-gray-700"
                                    style={{
                                        backgroundColor: getTypeColor(type) // We would need a helper for colors, but for now fallback to gray or implement simple specific colors if possible.
                                    }}
                                >
                                    {type}
                                </span>
                            ))}
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 w-full text-center border border-gray-100 shadow-inner">
                            <p className="text-gray-700 leading-relaxed break-keep text-sm">
                                {data.pokemon.koFlavor}
                            </p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};


export default PokemonDetailModal;