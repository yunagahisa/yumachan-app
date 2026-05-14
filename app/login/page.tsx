"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const goNext = () => {
    router.replace("/");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(auth, email, password);

      goNext();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "ログイン失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await createUserWithEmailAndPassword(auth, email, password);

      goNext();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "登録失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="logo" style={styles.logo} />

      <h1 style={styles.title}>Login</h1>

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

      <button
        style={styles.button}
        onClick={handleLogin}
        disabled={loading}
      >
        Log In
      </button>

      <button
        style={styles.button}
        onClick={handleSignup}
        disabled={loading}
      >
        Sign Up
      </button>

      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
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
  },
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
    backgroundColor: "#222",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
  loading: {
    fontSize: "14px",
    opacity: 0.7,
  },
  error: {
    width: "280px",
    color: "red",
    fontSize: "13px",
    textAlign: "center",
  },
};