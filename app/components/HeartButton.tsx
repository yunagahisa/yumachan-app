"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { toggleFavorite } from "@/lib/toggleFavorite";

export default function HeartButton({
  initialFavorite,
  yumaId,
  style,
}: {
  initialFavorite: boolean;
  yumaId: string;
  style?: React.CSSProperties;
}) {
  const [favorite, setFavorite] =
    useState(initialFavorite);

  useEffect(() => {
    setFavorite(initialFavorite);
  }, [initialFavorite]);

  return (
    <button
      style={{
        ...style,
        border: "none",
        background: "transparent",
        padding: 0,
      }}
      onClick={() => {
        const user =
          auth.currentUser;

        if (!user) return;

        const next =
          !favorite;

        setFavorite(next);

        toggleFavorite(
          user.uid,
          yumaId,
          next
        ).catch(() => {
          setFavorite(!next);
        });
      }}
    >
      <svg
  width="28"
  height="28"
  viewBox="0 0 24 24"
  fill={
    favorite
      ? "#333333"
      : "transparent"
  }
  stroke="#333333"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>
    </button>
  );
}