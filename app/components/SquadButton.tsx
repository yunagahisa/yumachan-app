"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { toggleSquad } from "@/lib/toggleSquad";

export default function SquadButton({
  initialInSquad,
  yumaId,
  style,
  onSquadChange,
}: {
  initialInSquad:boolean;
  yumaId:string;
  style?:React.CSSProperties;
  onSquadChange?:(
    yumaId:string,
    next:boolean
  )=>void;
}) {
  const [inSquad, setInSquad] =
    useState(initialInSquad);

  useEffect(() => {
    setInSquad(initialInSquad);
  }, [initialInSquad]);

  return (
    <button
      style={style}
      onClick={() => {

        const user =
          auth.currentUser;

        if (!user) return;

        const next =
          !inSquad;

        setInSquad(next);

        toggleSquad(
  user.uid,
  yumaId,
  inSquad
)
.then(()=>{

  onSquadChange?.(
    yumaId,
    next
  );

})
.catch(()=>{

  setInSquad(!next);

});
      }}
    >

      {!inSquad && (

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333333"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            marginRight: "0px",
            flexShrink: 0,
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="9"
          />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>

      )}

      <span>

        {inSquad
          ? "Remove from Squad"
          : "Add to Squad"}

      </span>

    </button>
  );
}