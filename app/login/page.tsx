"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const goNext = () => {
    router.push("/");
  };

  // ✅ ログイン状態監視（iPad対策の本体）
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        goNext();
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ redirect復帰（補助）
  useEffect(() => {
    const run = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result?.user) {
          goNext();
          return;
        }

        // fallback（復帰遅延対策）
        if (auth.currentUser) {
          goNext();
        }
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, []);

  // EMAIL LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.includes("google.com")) {
        setError("このメールはGoogleログインで登録されています");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      goNext();
    } catch (err: any) {
      console.error(err);

      if (err.code === "auth/too-many-requests") {
        setError("ログイン失敗が多すぎます。少し待ってください。");
      } else if (err.code === "auth/invalid-credential") {
        setError("メールまたはパスワードが違います");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await createUserWithEmailAndPassword(auth, email, password);

      goNext();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN（統一：全部redirectでもOK）
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();

      // iPad判定やめて安定優先
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error(err);

      setError(err.message);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGoogle();
        }}
      >
        <button type="submit" style={styles.googleButton} disabled={loading}>
          Continue with Google
        </button>
      </form>

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