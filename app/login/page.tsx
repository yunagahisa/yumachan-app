"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // =========================
  // ログイン状態監視（唯一の正解）
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user);

      if (user) {
        router.replace("/");
      }
    });

    return () => unsub();
  }, [router]);

  // =========================
  // redirect復帰処理（iPad用必須）
  // =========================
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result?.user) {
          router.replace("/");
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkRedirect();
  }, []);

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

      // 🔥 iPadも含めて全部redirectに統一
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Googleログイン失敗");
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