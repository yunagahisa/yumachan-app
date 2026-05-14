"use client";

import { useEffect, useState } from "react";
import { getWork } from "@/lib/getWork";
import { useParams } from "next/navigation";

export default function MyYumaPage() {
  const params = useParams();

  const yumaId = params.id as string;

  const [work, setWork] = useState<any>(null);

  useEffect(() => {
    const fetchWork = async () => {
      const data = await getWork(yumaId);
      setWork(data);
    };

    if (yumaId) {
      fetchWork();
    }
  }, [yumaId]);

  if (!work) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={styles.container}>

      {/* ブランドロゴ */}
      <img
        src="/logo.png"
        alt="brand logo"
        style={styles.logo}
      />

      {/* 作品名 */}
      <h1 style={styles.title}>
        {work.title}
      </h1>

      {/* ユマちゃん画像 */}
      <img
        src={work.imageUrl}
        alt={work.title}
        style={styles.characterImage}
      />

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    padding: "24px",
    backgroundColor: "#fffaf7",
  },

  logo: {
    width: "120px",
    opacity: 0.9,
  },

  title: {
    fontSize: "28px",
    fontWeight: "500",
    letterSpacing: "0.08em",
  },

  characterImage: {
    width: "260px",
    height: "260px",
    objectFit: "cover" as const,
    borderRadius: "24px",
    background: "#f6f1eb",
  },
};