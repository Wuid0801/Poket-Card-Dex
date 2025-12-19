import React, { useRef } from "react";
import PokemonDetailModal from "./PokemonDetailModal";
import { ImageWithFallback } from "./ImageWithFallback";
import { getTypeColor, POKEMON_IMAGE_BASE_URL } from "../constants/pokemon";
import { Pokemon } from "../types/pokemon";
import { overlay } from "overlay-kit";

interface PokemonCardProps {
  pokemon: Pokemon;
}

/**
 * 포켓몬 카드 컴포넌트
 * - 마우스 호버 시 3D 회전 효과 (Tilting)
 * - 마우스 움직임에 따른 광택(Glow) 효과
 */
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  // 포켓몬 ID 추출
  const pokemonId = String(pokemon.id || pokemon.url.split("/").filter(Boolean).pop() || '');

  // 직접 DOM을 조작하기 위해 useRef 사용 (렌더링 최적화)
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const FrameRef = useRef<number>(0);

  const handleCardClick = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <PokemonDetailModal pokemonId={pokemonId}  onClose={() => { close(); unmount(); }} />
    ))
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    // 요소 내에서 마우스의 상대 좌표 계산
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (FrameRef.current) {
      cancelAnimationFrame(FrameRef.current);
    }

    FrameRef.current = requestAnimationFrame(() => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 중심점 기준으로 회전 각도 계산 (최대 10도)
      // X축 이동 거리비율에 따라 Y축 회전 (좌우 기울기)
      const rotateY = ((x - centerX) / centerX) * -10;
      // Y축 이동 거리비율에 따라 X축 회전 (상하 기울기)
      const rotateX = ((y - centerY) / centerY) * 10;

      // 3D 변환 적용 (시점 perspective 추가)
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

      // 반짝임/광택 효과 계산
      // 마우스 위치를 백분율(%)로 변환하여 그라디언트 중심점으로 사용
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;


      if (glowRef.current) {
        // radial-gradient를 사용해 마우스를 따라다니는 원형 빛 효과 적용
        glowRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.4), transparent 60%)`;
        glowRef.current.style.opacity = '1';
      }

    });
  };

  const handleMouseLeave = () => {
    if (FrameRef.current) {
      cancelAnimationFrame(FrameRef.current);
      FrameRef.current = 0;
    }

    if (!cardRef.current || !glowRef.current)
      return;

    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glowRef.current.style.opacity = '0';
  };

  return (
    <>
      <div className="relative w-[220px] h-[310px] perspective-1000" style={{ perspective: "300px" }}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className="w-full h-full rounded-md transition-transform duration-100 ease-out bg-white shadow-md relative overflow-hidden transform-style-3d cursor-pointer hover:shadow-xl"
        >
          {/* 반짝임/광택 효과 오버레이 */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300 mix-blend-overlay"
          />

          <div className="flex flex-col items-center justify-center h-full relative z-0"
            style={
              pokemon.types && pokemon.types.length >= 2
                ? {
                    backgroundImage: `linear-gradient(to bottom right, ${getTypeColor(pokemon.types[0])}80, ${getTypeColor(pokemon.types[1])}80)`,
                  }
                : pokemon.types?.[0]
                ? {
                    backgroundColor: `${getTypeColor(pokemon.types[0])}80`,
                  }
                : undefined
            }
          >
            <div className="text-gray-400 font-bold self-start absolute top-2 left-2">
              #{String(pokemonId).padStart(4, '0')}
            </div>

            <div className="relative w-[140px] h-[140px] mb-4">
              <ImageWithFallback
                src={`${POKEMON_IMAGE_BASE_URL}/${pokemonId}.png`}
                alt={pokemon.koName || pokemon.name}
                className="w-full h-full drop-shadow-lg object-contain"
                fallbackSrc={`${POKEMON_IMAGE_BASE_URL}/${pokemonId}.png`}
              />
            </div>

            <div className="text-xl text-center font-bold text-gray-800">
              {pokemon.koName || pokemon.name || pokemon.enName || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

