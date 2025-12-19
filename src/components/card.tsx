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
 * - 홀로그래픽 효과 (대각선 그라디언트 + SVG 노이즈)
 */
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  // 포켓몬 ID 추출
  const pokemonId = String(
    pokemon.id || pokemon.url.split("/").filter(Boolean).pop() || ""
  );

  // 직접 DOM을 조작하기 위해 useRef 사용 (렌더링 최적화)
  const cardRef = useRef<HTMLDivElement>(null);
  const holographicRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const FrameRef = useRef<number>(0);

  const handleCardClick = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <PokemonDetailModal
        pokemonId={pokemonId}
        onClose={() => {
          close();
          unmount();
        }}
      />
    ));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !holographicRef.current) return;

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

      // 홀로그래픽 효과 계산
      // 마우스 위치를 백분율(%)로 변환하여 그라디언트 위치 조정
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      if (holographicRef.current) {
        // 여러 대각선 그라디언트 레이어를 조합하여 홀로그래픽 효과 생성
        const bgPos1 = `${percentX * 0.5}% ${percentY * 0.5}%`;
        const bgPos2 = `${100 - percentX * 0.5}% ${100 - percentY * 0.5}%`;
        const bgPos3 = `${percentX * 0.3}% ${100 - percentY * 0.3}%`;

        holographicRef.current.style.background = `
          linear-gradient(105deg,
            transparent 40%,
            rgba(255, 100, 200, 0.6) 48%,
            rgba(100, 200, 255, 0.6) 50%,
            rgba(200, 255, 100, 0.6) 52%,
            transparent 60%
          ),
          linear-gradient(75deg,
            transparent 40%,
            rgba(255, 150, 100, 0.6) 48%,
            rgba(255, 220, 100, 0.6) 50%,
            rgba(100, 255, 180, 0.6) 52%,
            transparent 60%
          ),
          linear-gradient(135deg,
            transparent 40%,
            rgba(150, 100, 255, 0.6) 48%,
            rgba(100, 220, 255, 0.6) 50%,
            rgba(255, 150, 220, 0.6) 52%,
            transparent 60%
          )
        `;
        holographicRef.current.style.backgroundSize =
          "200% 200%, 200% 200%, 200% 200%";
        holographicRef.current.style.backgroundPosition = `${bgPos1}, ${bgPos2}, ${bgPos3}`;
        holographicRef.current.style.opacity = "1";
      }
    });
  };

  const handleMouseLeave = () => {
    if (FrameRef.current) {
      cancelAnimationFrame(FrameRef.current);
      FrameRef.current = 0;
    }

    if (!cardRef.current || !holographicRef.current) return;

    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    holographicRef.current.style.opacity = "0";
  };

  return (
    <>
      <div
        className="relative w-[220px] h-[310px] hover:z-10 perspective-1000"
        style={{ perspective: "300px" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className="w-full h-full rounded-md transition-transform duration-100 ease-out bg-white shadow-md relative overflow-hidden transform-style-3d cursor-pointer hover:shadow-xl"
        >
          {/* 홀로그래픽 효과 오버레이 */}
          <div
            ref={holographicRef}
            className="absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300"
            style={{ mixBlendMode: "screen" }}
          />

          {/* SVG 노이즈 효과 */}
          <div
            ref={noiseRef}
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.15]"
            style={{ mixBlendMode: "overlay" }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <filter id={`noise-${pokemonId}`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="4"
                  stitchTiles="stitch"
                />
              </filter>
              <rect
                width="100%"
                height="100%"
                filter={`url(#noise-${pokemonId})`}
                opacity="0.4"
              />
            </svg>
          </div>

          <div
            className="flex flex-col items-center justify-center h-full relative z-0"
            style={
              pokemon.types && pokemon.types.length >= 2
                ? {
                    backgroundImage: `linear-gradient(to bottom right, ${getTypeColor(
                      pokemon.types[0]
                    )}80, ${getTypeColor(pokemon.types[1])}80)`,
                  }
                : pokemon.types?.[0]
                ? {
                    backgroundColor: `${getTypeColor(pokemon.types[0])}80`,
                  }
                : undefined
            }
          >
            <div className="text-gray-400 font-bold self-start absolute top-2 left-2">
              #{String(pokemonId).padStart(4, "0")}
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
              {pokemon.koName || pokemon.name || pokemon.enName || "Unknown"}
            </div>

            <div className="flex gap-2 mb-6">
              {pokemon.types.map((type: string) => (
                <span
                  key={type}
                  className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm text-white"
                  style={{
                    border: `1px solid white`, // We would need a helper for colors, but for now fallback to gray or implement simple specific colors if possible.
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
