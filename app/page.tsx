"use client";

import ProfileModal from "@/app/components/ProfileModal";
import ProfilePage from "@/app/profile/page";

import { useEffect, useState } from "react";
import Link from "next/link";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { useAuth } from "./hooks/useAuth";

import { getUserYumas } from "@/lib/getUserYumas";
import { getWork } from "@/lib/getWork";

import { updateProfile } from "firebase/auth";

export default function Home() {

  const { user, loading } =
    useAuth();

  const [works, setWorks] =
    useState<any[]>([]);

  const [profileOpen,setProfileOpen]
= useState(false);

  const [accountOpen, setAccountOpen] =
  useState(false);

  const [editingName, setEditingName] =
  useState(false);

  const [displayName, setDisplayName] =
  useState("");

    useEffect(() => {

  const migrateName = async () => {

    if (!user) return;

    await updateProfile(user, {
      displayName: "Kino Nagahisa"
    });

    console.log("displayName updated");

  };

  migrateName();

}, [user]);

    useEffect(() => {

      if (!user) return;

      setDisplayName(
        user.displayName || ""
      );

    }, [user]);

  useEffect(() => {

    const fetchYumas =
      async () => {

      if (!user) return;

      const yumas =
        await getUserYumas(
          user.uid
        );

      const squadYumas =
      yumas.filter(
      (yuma:any)=>
      yuma.inSquad===true
      );

      const workData =
        await Promise.all(

          squadYumas.map(
            async (
              yuma:any
            ) => {

              const work =
                await getWork(
                  yuma.id
                );

              return {

                id:yuma.id,

                ...work,
              };
            }
          )
        );

      setWorks(
        workData
      );

    };

    fetchYumas();

  },[user]);



  // loading
  if (loading){

    return(

      <div style={styles.empty}>

        <h1>
          Your Yuma Home
        </h1>

      </div>

    );

  }



  // 未ログイン
  if (!user){

    return(

      <div style={styles.empty}>

        <h1>

          ユマちゃんへようこそ

        </h1>

        <p>

          ログインすると
          コレクションが
          表示されます

        </p>

        <Link
          href="/login"
        >

          <button
            style={
              styles.loginButton
            }
          >

            Login

          </button>

        </Link>

      </div>

    );

  }



  return(

    <div style={styles.container}>

<ProfileModal
  open={profileOpen}
  onClose={()=>
    setProfileOpen(false)
  }
 >
   <ProfilePage/>
 </ProfileModal>

{accountOpen && (

  <>
    <div
      style={styles.backdrop}
      onClick={() =>
        setAccountOpen(false)
      }
    />

    <div style={styles.accountPopup}>

      <button

        style={styles.popupClose}

        onClick={() =>
          setAccountOpen(false)
        }

      >

        ✕

      </button>

      <p style={styles.currentLabel}>

        Currently in

      </p>

      <div
        style={{
          display:"flex",
          alignItems:"center",
          gap:"10px"
        }}
      >

        {editingName ? (

          <input

            value={displayName}

            onChange={(e)=>
              setDisplayName(
                e.target.value
              )
            }

            style={styles.nameInput}

          />

        ) : (

          <h2 style={styles.userName}>

            {displayName}

          </h2>

        )}

        <button

          style={styles.editButton}

          onClick={async()=>{

            if(!user) return;

            if(editingName){

              await updateProfile(
                user,
                {
                  displayName
                }
              );

            }

            setEditingName(
              !editingName
            );

          }}

        >

          ✎

        </button>

      </div>

      <p style={styles.userEmail}>

        {user?.email}

      </p>

      <button

        style={styles.logoutPopupButton}

        onClick={async()=>{

          await signOut(auth);

          window.location.href =
          "/login";

        }}

      >

        Log out

      </button>

    </div>

  </>

)}


      {/* Account */}

      <button
        style={styles.accountButton}
        onClick={() =>
          setAccountOpen(!accountOpen)
        }
       >

        <div style={styles.accountIcon}>

          <div style={styles.accountHead} />

          <div style={styles.accountBody} />

        </div>

      </button>


      {/* Floating Menu */}

      <div
        style={
          styles.menuArea
        }
      >
        <button

style={styles.menuButton}

onClick={() => setProfileOpen(true)}
>

Collection
</button>
      </div>



      {/* Yuma Area */}

      <div
        style={
          styles.yumaArea
        }
      >

        {works.map(
          (
            work,
            index
          )=>(

          <Link
            key={work.id}

            href={`/my/${work.id}`}

            style={{
              ...styles.yumaCard,

              top:
              `${
                (
                  index*120
                )%500
              }px`,

              left:
              `${
                (
                  index*90
                )%250
              }px`,
            }}
          >

            <img
              src={
                work.imageUrl
              }

              alt={
                work.title
              }

              style={
                styles.image
              }
            />

            <p
              style={
                styles.name
              }
            >

              {work.title}

            </p>

          </Link>

        ))}

      </div>

    </div>

  );

}



const styles:any={

container:{

minHeight:"100vh",

background:"#fff",

padding:"24px",

overflow:"hidden",

position:"relative",

},

logoutButton:{

position:"absolute",

top:"30px",

right:"20px",

zIndex:1000,

padding:
"10px 18px",

borderRadius:
"999px",

border:"none",

background:"#ffffffff",

color:"#696969",

fontSize:"12px",

fontWeight:600,

cursor:"pointer",

},

menuArea:{

position:"absolute",

right:"20px",

bottom:"40px",

display:"flex",

flexDirection:
"column" as const,

gap:"14px",

zIndex:1000,

},

menuButton:{

marginBottom:"50px",

width:"68px",

height:"68px",

borderRadius:
"999px",

background:
"#ffffffff",

display:"flex",

justifyContent:
"center",

alignItems:
"center",

textDecoration:
"none",

color:"#DCCBDB",

fontSize:"12px",

fontWeight:700,

boxShadow:
"0px 4px 12px rgba(0,0,0,0.15)",

},

yumaArea:{

position:"relative",

width:"100%",

height:"80vh",

marginTop:"120px",

},

yumaCard:{

position:"absolute",

width:"60px",

textDecoration:
"none",

color:"#222",

},

image:{

width:"60px",

height:"60px",

borderRadius:
"12px",

objectFit:
"cover",

background:"#eee",

},

name:{

textAlign:"center",

marginTop:"8px",

fontSize:"0px",

},

loginButton:{

marginTop:"24px",

padding:
"12px 24px",

borderRadius:
"999px",

border:"none",

background:"#222",

color:"white",

cursor:"pointer",

},

empty:{

padding:"40px",

},

accountButton:{

  position:"absolute",

  top:"24px",

  right:"20px",

  width:"42px",

  height:"42px",

  borderRadius:"999px",

  border:"none",

  background:"#fff",

  fontSize:"24px",

  cursor:"pointer",

  zIndex:2000,

},

backdrop:{

  position:"fixed",

  inset:0,

  zIndex:3000,

},

accountPopup:{

  position:"absolute",

  top:"75px",

  right:"20px",

  width:"290px",

  height:"175px",

  background:"#ffffffff",

  borderRadius:"15px",

  padding:"28px",

  zIndex:4000,

  boxShadow:
  "0px 0px 10px rgba(0, 0, 0, 0.12)",

},

popupClose:{

  position:"absolute",

  top:"13px",

  right:"22px",

  border:"none",

  background:"none",

  fontSize:"14px",

  cursor:"pointer",

  color:"#000000ff",

},

currentLabel:{

  color:"#696962",

  fontSize:"12px",

  fontWeight:500,

  marginTop:"-5px",

  marginLeft:"-4px",

},

userName:{

  margin:0,

  fontSize:"17px",

  fontWeight:600,

  marginTop:"6px",

  color:"#000000ff",

  marginLeft:"-4px",

  letterSpacing:"0.02px",

},

userEmail:{

  color:"#696962",

  fontSize:"14px",

  marginTop:"6px",

  fontWeight:500,

  marginLeft:"-4px",

},

logoutPopupButton:{

  marginTop:"34px",

  border:"none",

  background:"none",

  fontSize:"14px",

  fontWeight:700,

  cursor:"pointer",

  color:"#000000ff",

  marginLeft:"-4px",

},

editButton:{

  border:"none",

  background:"none",

  fontSize:"18px",

  cursor:"pointer",

  color:"#333333",

},

nameInput:{

  fontSize:"14px",

  fontWeight:500,

  border:"1px solid #ddd",

  borderRadius:"8px",

  padding:"4px 8px",

  marginLeft:"-4px",

  width:"200px",

  marginTop:"6px",

  color:"#000000ff",

},

accountIcon:{

  width:"24px",

  height:"24px",

  position:"relative",

},

accountHead:{

  position:"absolute",

  top:"1px",

  left:"7px",

  width:"10px",

  height:"10px",

  border:"1.5px solid #DCCBDB",

  borderRadius:"999px",

  boxSizing:"border-box",

},

accountBody:{

  position:"absolute",

  top:"12px",

  left:"3px",

  width:"18px",

  height:"8px",

  border:"1.5px solid #DCCBDB",

  borderBottom:"none",

  borderRadius:"18px 18px 0 0",

  boxSizing:"border-box",

},

};