"use client";

import { useState, useEffect } from "react";
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

  const goNext = () => {
    router.replace("/");
  };

  // =========================
  // 🔥 ログイン状態監視
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user);

      if (user) {
        goNext();
      }
    });

    return () => unsub();
  }, []);

  // =========================
  // EMAIL LOGIN
  // =========================
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(auth, email, password);

      alert("ログイン成功");
      goNext();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await createUserWithEmailAndPassword(auth, email, password);

      alert("登録成功");
      goNext();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN（安定版）
  // =========================
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      alert("Googleログイン成功");
      goNext();
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

      {/* LOGIN */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <button type="submit" style={styles.button} disabled={loading}>
          Log In
        </button>
      </form>

      {/* SIGNUP */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <button type="submit" style={styles.button} disabled={loading}>
          Sign Up
        </button>
      </form>

      <div style={styles.divider} />

      {/* GOOGLE */}
      <button
        onClick={handleGoogle}
        style={styles.googleButton}
        disabled={loading}
      >
        Continue with Google
      </button>

      {loading && <p style={styles.loading}>Loading...</p>}

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

  logo: {
    width: "120px",
    marginBottom: "8px",
  },

  title: {
    fontSize: "28px",
    fontWeight: 500,
    marginBottom: "8px",
  },

  input: {
    width: "280px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "16px",
    background: "white",
  },

  button: {
    width: "280px",
    padding: "14px",
    borderRadius: "999px",
    border: "none",
    background: "#222",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },

  googleButton: {
    width: "280px",
    padding: "14px",
    borderRadius: "999px",
    border: "1px solid #ddd",
    background: "white",
    fontSize: "14px",
    cursor: "pointer",
  },

  divider: {
    width: "120px",
    height: "1px",
    background: "#ddd",
    margin: "8px 0",
  },

  loading: {
    fontSize: "14px",
    opacity: 0.7,
  },

  error: {
    width: "280px",
    color: "red",
    fontSize: "13px",
    textAlign: "center" as const,
    lineHeight: 1.5,
  },
};