"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
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

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      goNext();

    } catch (err: any) {

      console.error(err);

      if (
        err.code === "auth/invalid-credential"
      ) {
        setError("Email or Password is incorrect");
      } else {
        setError(err?.message || "Login failed");
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <img
        src="/munii(2).png"
        alt="logo"
        style={styles.logo}
      />

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

      <button
        style={styles.button}
        onClick={handleLogin}
        disabled={loading}
      >
        Log In
      </button>

      {/* signup area */}
      <div style={styles.signupArea}>

        <p style={styles.text}>
          Don't have an account?
        </p>

        <Link
          href="/signup"
          style={styles.signupLink}
        >
          Sign Up.
        </Link>

      </div>

      {loading && (
        <p style={styles.loading}>
          Loading...
        </p>
      )}

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {

  container: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#ffffff",
  },

  logo: {
    width: "90px",
    marginBottom: "32px",
  },

  input: {
    width: "320px",
    padding: "9px 14px",
    borderRadius: "6px",
    border: "1px solid #EAEAEA",
    fontSize: "12px",
    fontWeight:"500",
    color: "#111",
    outline: "none",
    marginTop:"-7px",
    background:"#FAFAFA",
  },

  button: {
    width: "320px",
    padding: "12px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#222",
    color: "white",
    fontSize: "12px",
    cursor: "pointer",
    marginTop: "8px",
  },

  signupArea: {
    marginTop: "72px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },

  text: {
    fontSize: "12px",
    fontWeight:"500",
    color: "#4C5563",
    margin: 0,
  },

  signupLink: {
    fontSize: "12px",
    fontWeight:"700",
    color: "#4E47E4",
    textDecoration: "none",
    marginTop:"-12px",
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
    lineHeight: 1.5,
  },
};