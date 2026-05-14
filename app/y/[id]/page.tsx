"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { saveYuma } from "@/lib/saveYuma";
import { getWork } from "@/lib/getWork";
import { useRouter, useParams } from "next/navigation";

export default function YumaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  const handleSave = async () => {
    if (!user) {
      router.push(`/login?redirect=/y/${yumaId}`);
      return;
    }

    await saveYuma(user.uid, yumaId);

    alert("ユマちゃんをコレクションに追加した！");
  };

  if (loading) {
  return <div>Auth Loading...</div>;
}

if (!work) {
  return <div>Work Loading...</div>;
}

  return (
    <div style={styles.container}>

      {/* ブランドロゴ */}
      <img
        src="/logo.png"
        alt="brand logo"
        style={styles.logo}
      />

      {/* Firestoreから取得した作品名 */}
      <h1 style={styles.title}>
        {work.title}
      </h1>

      {/* Firestoreから取得した画像 */}
      <img
        src={work.imageUrl}
        alt={work.title}
        style={styles.characterImage}
      />

      {/* 保存ボタン */}
      <button style={styles.button} onClick={handleSave}>
        {user
          ? "コレクションに追加する"
          : "ログインして保存"}
      </button>

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

  button: {
    padding: "14px 24px",
    borderRadius: "999px",
    border: "none",
    background: "#222",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
};