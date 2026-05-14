"use client";


import { useEffect, useState } from "react";
import Link from "next/link";


import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";


import { useAuth } from "./hooks/useAuth";


import { getUserYumas } from "@/lib/getUserYumas";
import { getWork } from "@/lib/getWork";


export default function Home() {


 const { user, loading } = useAuth();


 const [works, setWorks] = useState<any[]>([]);


 useEffect(() => {


   const fetchYumas = async () => {


     if (!user) return;


     // ユーザー所有ユマ取得
     const yumas = await getUserYumas(user.uid);


     // works取得
     const workData = await Promise.all(
       yumas.map(async (yuma: any) => {


         const work = await getWork(yuma.id);


         return {
           id: yuma.id,
           ...work,
         };
       })
     );


     setWorks(workData);
   };


   fetchYumas();


 }, [user]);


 // loading中
 if (loading) {


   return (
     <div style={styles.empty}>
       <h1>Your Yuma Home</h1>
     </div>
   );
 }


 // 未ログイン
 if (!user) {


   return (
     <div style={styles.empty}>


       <h1>
         ユマちゃんへようこそ
       </h1>


       <p>
         ログインするとコレクションが表示されます
       </p>


       <Link href="/login">
         <button style={styles.loginButton}>
           Login
         </button>
       </Link>


     </div>
   );
 }


 // ログイン済み
 return (


   <div style={styles.container}>


     {/* LOGOUT BUTTON */}
     <button
       style={styles.logoutButton}
       onClick={async () => {


         await signOut(auth);


         window.location.href = "/login";
       }}
     >
       Logout
     </button>


     <h1 style={styles.title}>
       Your Yuma Home
     </h1>


     <div style={styles.yumaArea}>


       {works.map((work, index) => (


         <Link
           key={work.id}
           href={`/my/${work.id}`}
           style={{
             ...styles.yumaCard,
             top: `${(index * 120) % 500}px`,
             left: `${(index * 90) % 250}px`,
           }}
         >


           <img
             src={work.imageUrl}
             alt={work.title}
             style={styles.image}
           />


           <p style={styles.name}>
             {work.title}
           </p>


         </Link>
       ))}


     </div>


   </div>
 );
}


const styles = {


 container: {
   minHeight: "100vh",
   padding: "24px",
   background: "#fffaf7",
   overflow: "hidden",
   position: "relative" as const,
 },


 title: {
   textAlign: "center" as const,
   marginTop: "80px",
   marginBottom: "32px",
   fontSize: "28px",
   fontWeight: 500,
 },


 logoutButton: {
   position: "fixed" as const,


   top: "20px",
   right: "20px",


   zIndex: 999999,


   padding: "14px 24px",


   borderRadius: "999px",
   border: "none",


   background: "red",
   color: "white",


   fontSize: "16px",
   fontWeight: 700,


   cursor: "pointer",


   boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
 },


 loginButton: {
   marginTop: "24px",
   padding: "12px 24px",
   borderRadius: "999px",
   border: "none",
   background: "#222",
   color: "white",
   cursor: "pointer",
   fontSize: "14px",
 },


 yumaArea: {
   position: "relative" as const,
   width: "100%",
   height: "80vh",
 },


 yumaCard: {
   position: "absolute" as const,
   width: "120px",
   textDecoration: "none",
   color: "#222",
 },


 image: {
   width: "120px",
   height: "120px",
   borderRadius: "24px",
   objectFit: "cover" as const,
   background: "#eee",
 },


 name: {
   textAlign: "center" as const,
   marginTop: "8px",
   fontSize: "12px",
 },


 empty: {
   padding: "40px",
 },
};

