"use client";

import { useState, useEffect } from "react";

import { auth } from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Firebaseログイン監視
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, (user) => {

        // ログイン済みならHOMEへ
        if (user) {

          router.replace("/");
        }

        setLoading(false);
      });

    return () => unsubscribe();

  }, []);

  const handleLogin = async () => {

    try {

      setError("");

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.replace("/");

    } catch (err: any) {

      console.error(err);

      setError(err.message);
    }
  };

  const handleSignup = async () => {

    try {

      setError("");

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.replace("/");

    } catch (err: any) {

      console.error(err);

      setError(err.message);
    }
  };

  const handleGoogle = async () => {

    try {

      setError("");

      const provider =
        new GoogleAuthProvider();

      // iPad判定
      const isIPad =
        /iPad|Macintosh/.test(
          navigator.userAgent
        ) &&
        "ontouchend" in document;

      // iPad → redirect
      if (isIPad) {

        await signInWithRedirect(
          auth,
          provider
        );

      } else {

        // PC/Mac → popup
        await signInWithPopup(
          auth,
          provider
        );

        router.replace("/");
      }

    } catch (err: any) {

      console.error(err);

      setError(err.message);
    }
  };

  // Firebase判定待ち
  if (loading) {

    return (
      <div style={styles.loadingWrap}>
        Loading...
      </div>
    );
  }

  return (

    <div style={styles.container}>

      <img
        src="/logo.png"
        alt="logo"
        style={styles.logo}
      />

      <h1 style={styles.title}>
        Login / Sign Up
      </h1>

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      {/* LOGIN */}
      <button
        style={styles.button}
        onClick={handleLogin}
      >
        Log In
      </button>

      {/* SIGNUP */}
      <button
        style={styles.button}
        onClick={handleSignup}
      >
        Sign Up
      </button>

      <div style={styles.divider} />

      {/* GOOGLE */}
      <button
        style={styles.googleButton}
        onClick={handleGoogle}
      >
        Continue with Google
      </button>

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

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

  loadingWrap: {
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

  error: {
    width: "280px",
    color: "red",
    fontSize: "13px",
    textAlign: "center" as const,
    lineHeight: 1.5,
  },
};