"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔥 初期ロード判定（iPadバグ対策の核心）
  const initialized = useRef(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user);

      // ❗初回は無視（iPadの勝手復元対策）
      if (!initialized.current) {
        initialized.current = true;
        return;
      }

      if (user) {
        router.replace("/");
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(auth, email, password);

      router.replace("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "エラー");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await createUserWithEmailAndPassword(auth, email, password);

      router.replace("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "エラー");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      router.replace("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Googleログイン失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="logo" style={styles.logo} />

      <h1 style={styles.title}>Login / Sign Up</h1>

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <button style={styles.button} disabled={loading}>Log In</button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
        <button style={styles.button} disabled={loading}>Sign Up</button>
      </form>

      <button
        onClick={handleGoogle}
        style={styles.googleButton}
        disabled={loading}
      >
        Continue with Google
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#fffaf7",
  },
  logo: { width: "120px", marginBottom: "8px" },
  title: { fontSize: "28px", fontWeight: 500 },
  input: {
    width: "280px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    width: "280px",
    padding: "14px",
    borderRadius: "999px",
    border: "none",
    background: "#222",
    color: "white",
  },
  googleButton: {
    width: "280px",
    padding: "14px",
    borderRadius: "999px",
    border: "1px solid #ddd",
    background: "white",
  },
  error: {
    color: "red",
    width: "280px",
    textAlign: "center" as const,
  },
};