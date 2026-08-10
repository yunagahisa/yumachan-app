"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  src: string;
};

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function ParticleSystem() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let id = 0;

    const particleImages = [
      "/particles/star.svg",
      "/particles/circle.svg",
      "/particles/moon.svg",
      "/particles/triangle.svg",
    ];

    const handleClick = (e: MouseEvent) => {
      const rippleId = id++;

setRipples(prev => [
  ...prev,
  {
    id: rippleId,
    x: e.clientX,
    y: e.clientY,
  },
]);

setTimeout(() => {
  setRipples(prev =>
    prev.filter(r => r.id !== rippleId)
  );
}, 900);

      const newParticles: Particle[] = [];
      const radius = 35;

      for (let i = 0; i < 10; i++) {

        const angle = Math.random() * Math.PI * 2;
        const distance = radius * (0.3 + Math.random() * 0.7);
        
        const speed = 25 + Math.random() * 15;

        newParticles.push({
          id: id++,

          x: e.clientX +
             Math.cos(angle) * distance,

          y: e.clientY +
             Math.sin(angle) * distance,

          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 8 + Math.random() * 11,
          rotation: Math.random() * 360,

          src:
            particleImages[
              Math.floor(
                Math.random() * particleImages.length
              )
            ],
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.some((n) => n.id === p.id))
        );
      }, 900);
    };

    window.addEventListener("pointerdown", handleClick);

    return () =>
      window.removeEventListener("pointerdown", handleClick);
  }, []);

  return (
    <>
      {ripples.map((r) => (
  <div
    key={r.id}
    style={{
      position: "fixed",
      left: r.x,
      top: r.y,

      transform: "translate(-50%, -50%)",
      animation: "ripple 900ms cubic-bezier(.22,.8,.36,1) forwards",
      pointerEvents: "none",
      zIndex: 9998,

      width: 80,
      height: 80,

      borderRadius: "999px",
      border: "4px solid rgba(255,245,190,0.6)",
      filter: "blur(0.5px)",
      background: `
      radial-gradient(
        circle,
      rgba(255,255,255,0) 58%,
      rgba(255,245,190,0.75) 70%,
      rgba(255,255,255,0) 82%
)
`,

    }}
  />
))}

      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,

            pointerEvents: "none",
            zIndex: 9999,

            // ← この色を変えるだけで全パーティクルの色が変わる
            backgroundColor: "#F6E86F",
            filter: "drop-shadow(0 0 3px rgba(255,255,255,.9)) drop-shadow(0 0 8px rgba(255,245,210,.8))",

            WebkitMask: `url(${p.src}) center / contain no-repeat`,
            mask: `url(${p.src}) center / contain no-repeat`,

            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            animation: "particle-float 900ms ease-out forwards",

            ["--dx" as any]: `${p.dx}px`,
            ["--dy" as any]: `${p.dy}px`,
        }}
      />
    ))}

      <style jsx global>{`
        @keyframes ripple{

0%{

transform:
translate(-50%,-50%)
scale(.75);

opacity:.45;

}

40%{

opacity:.28;

}

100%{

transform:
translate(-50%,-50%)
scale(1.05);

opacity:0;

}

}

        @keyframes particle-float {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }

          20% {
            transform: translate(
                calc(-50% + var(--dx) * 0.2),
                calc(-50% + var(--dy) * 0.2)
              )
              scale(1.2);
          }

          100% {
            transform: translate(
                calc(-50% + var(--dx)),
                calc(-50% + var(--dy))
              )
              scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}