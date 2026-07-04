"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function SignupPage() {

  const [nickname, setNickname] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  const handleSignup = async () => {

    try {

      setLoading(true);

      setError("");

      // アカウント作成
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // ニックネーム保存
      await updateProfile(
        userCredential.user,
        {
          displayName: nickname,
        }
      );

      router.replace("/");

    } catch (err: any) {

      console.error(err);

      setError(
        err?.message || "登録失敗"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div style={styles.container}>

      <img
        src="/Munii.png"
        style={styles.logo}
      />

      <input
        style={styles.input}
        placeholder="Username"
        value={nickname}
        onChange={(e)=>
          setNickname(
            e.target.value
          )
        }
      />

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e)=>
          setEmail(
            e.target.value
          )
        }
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        style={styles.button}
        onClick={handleSignup}
        disabled={loading}
      >

        {loading
          ? "Loading..."
          : "Sign Up"}

      </button>

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

    </div>
  );
}

const styles:any = {

  container:{
    minHeight:"100dvh",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    gap:"16px",
    backgroundColor:"#fff",
  },

  logo:{
    width:"180px",
  },

  input: {
    width: "280px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "14px",
    color: "#111",
    outline: "none",
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
    marginTop: "8px",
  },

  error:{
    color:"red",
  },

};