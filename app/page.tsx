"use client";

import ParticleSystem from "@/app/components/ParticleSystem";

import ProfileModal from "@/app/components/ProfileModal";
import ProfilePage from "@/app/profile/page";

import { useEffect, useState, useRef } from "react";
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
    
  const [collections, setCollections] =
    useState<any[]>([]);

  const [profileOpen,setProfileOpen]
= useState(false);

  const [accountOpen, setAccountOpen] =
  useState(false);

  const [editingName, setEditingName] =
  useState(false);

  const [displayName, setDisplayName] =
  useState("");

  const sheetRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0);

  const currentY = useRef(0);

    useEffect(() => {

      if (!user) return;

      setDisplayName(
        user.displayName || ""
      );

    }, [user]);

    const handleSquadChange = (
  yumaId:string,
  next:boolean
)=>{

  setCollections(prev=>{

    const updated = prev.map(item=>

      item.id===yumaId

        ? {
            ...item,
            inSquad:next,
          }

        : item

    );

    setWorks(
      updated.filter(item=>item.inSquad)
    );

    return updated;

  });

};

    const fetchYumas = async()=>{

  if(!user) return;

  const yumas =
    await getUserYumas(user.uid);

  const collectionData =
    await Promise.all(

      yumas.map(async(yuma:any)=>{

        const work =
          await getWork(yuma.id);

        return{

          ...work,

          id:yuma.id,

          acquiredDate:
          yuma.acquiredDate,

          inSquad:
          yuma.inSquad,

        };

      })

    );

  setCollections(collectionData);

  setWorks(

    collectionData.filter(

      item=>item.inSquad

    )

  );

};

  useEffect(() => {

    fetchYumas();

  },[user]);

const handleTouchStart = (
  e: React.TouchEvent
) => {

  startY.current =
    e.touches[0].clientY;

};

const handleTouchMove = (
  e: React.TouchEvent
) => {

  if(!sheetRef.current) return;

  currentY.current =
    e.touches[0].clientY;

  const diff =
    currentY.current -
    startY.current;

  if(diff < 0) return;

  sheetRef.current.style.transform =
    `translateY(${diff}px)`;

};

const handleTouchEnd = () => {

  if(!sheetRef.current) return;

  const diff =
    currentY.current -
    startY.current;

  if(diff > 120){

    setAccountOpen(false);

  }else{

    sheetRef.current.style.transform =
      "translateY(0)";

  }

};

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

      <ParticleSystem />

<div style={styles.topBar}>

  <button
    style={styles.userInfo}
    onClick={() => setAccountOpen(!accountOpen)}
  >
    <div style={styles.userIconFrame}>

    <div style={styles.userIcon} />

    </div>

    <h2 style={styles.userNickname}>
      {displayName || "Guest"}
    </h2>

  </button>

  <button
  style={styles.menuButton}
  onClick={() => setProfileOpen(true)}
>
  <img
    src="/collection-icon.png"
    style={styles.menuIcon}
    alt="Collection"
  />
</button>

</div>

<ProfileModal
  open={profileOpen}
  onClose={()=>
    setProfileOpen(false)
  }
 >
   <ProfilePage
  collections={collections}
  onSquadChange={handleSquadChange}
/>

 </ProfileModal>

{accountOpen && (

  <>
    <div
      style={styles.backdrop}
      onClick={() =>
        setAccountOpen(false)
      }
    />

    <div
  ref={sheetRef}
  style={styles.accountPopup}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>

  <div style={styles.sheetHandle} />

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

<div style={styles.profileRow}>

  <div style={styles.popupUserIcon} />

  <div style={styles.profileText}>

    <div
      style={{
        display:"flex",
        alignItems:"center",
        gap:"8px",
      }}
    >

      {editingName ? (

        <input
          value={displayName}
          onChange={(e)=>
            setDisplayName(e.target.value)
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

            await updateProfile(user,{
              displayName
            });

          }

          setEditingName(!editingName);

        }}
      >
        ✎
      </button>

    </div>

    <p style={styles.userEmail}>
      {user?.email}
    </p>

  </div>

</div>

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

      <style jsx global>{`

      @keyframes sheetUp{

        from{
          transform:translateY(100%);
        }

        to{
          transform:translateY(0);
        }

      }

      @keyframes fadeIn{

        from{
          opacity:0;
        }

        to{
          opacity:1;
        }

      }

      `}</style>

    </div>

  );

}



const styles:any={

container:{

minHeight:"100vh",

background:"#ffffffff",

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

menuButton:{

width:"30px",
height:"30px",

borderRadius:"999px",

border:"none",

background:
"#FFFEFB",

display:"flex",
justifyContent:"center",
alignItems:"center",

cursor:"pointer",

boxShadow:
"0px 0px 5px rgba(0,0,0,0.22)",

color:"#DCCBDB",

fontSize:"0px",

},

yumaArea:{

position:"relative",

width:"100%",

height:"80vh",

marginTop:"320px",

marginLeft:"40px",

},

yumaCard:{

position:"absolute",

width:"240px",

},

image:{

width:"220px",

height:"220px",

objectFit:
"contain",

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

  background:"rgba(0,0,0,0.32)",

  zIndex:3000,

  animation:"fadeIn 0.25s",

},

accountPopup:{

  position:"fixed",

  left:0,

  right:0,

  bottom:0,

  background:"#fff",

  borderTopLeftRadius:"28px",

  borderTopRightRadius:"28px",

  padding:"28px",

  paddingBottom:"42px",

  zIndex:4000,

  boxShadow:"0 -8px 30px rgba(0,0,0,0.15)",

  animation:"sheetUp 0.28s ease",

},

popupClose:{

  position:"absolute",

  top:"13px",

  right:"22px",

  border:"none",

  background:"none",

  fontSize:"14px",

  cursor:"pointer",

  color:"#E0DCD5",

},

currentLabel:{

  color:"#62625B",

  fontSize:"12px",

  fontWeight:500,

  marginTop:"-10px",

  marginLeft:"-4px",

},

userName:{

  margin:0,

  fontSize:"17px",

  fontWeight:600,

  marginTop:"6px",

  color:"#000000",

  marginLeft:"-4px",

  letterSpacing:"0.02px",

},

userEmail:{

  color:"#62625B",

  fontSize:"12px",

  marginTop:"0px",

  fontWeight:400,

  marginLeft:"-4px",

},

logoutPopupButton:{

  marginTop:"22px",

  border:"none",

  background:"none",

  fontSize:"14px",

  fontWeight:600,

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

topBar:{
  position:"absolute",
  top:"44px",
  left:"18px",
  right:"18px",

  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",

  zIndex:2000,
},

userInfo: {
  display: "flex",
  alignItems: "center",
  gap: "9px",

  background:"none",
  border:"none",
  padding:0,

  cursor:"pointer",
},

userIcon: {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  background: "#DBDFE4",
},

userNickname: {
  margin: 0,
  fontSize: "16px",
  fontWeight: 610,
  color: "#C79CCD",
},

profileRow:{
  display:"flex",
  alignItems:"center",
  gap:"16px",

  marginTop:"15px",
},

popupUserIcon:{
  width:"56px",
  height:"56px",

  borderRadius:"999px",

  background:"#d9d9d9",

  flexShrink:0,
},

profileText:{
  display:"flex",
  flexDirection:"column",

  justifyContent:"center",

  flex:1,
},

menuIcon:{

  width:"14px",

  height:"14px",

  objectFit:"contain",

},

userIconFrame:{

  width:"34px",
  height:"34px",
  border: "1.8px solid #DBDFE4",
  borderRadius:"999px",
  display: "flex",
  justifyContent:"center",
  alignItems:"center",
  flexShrink:0,

},

sheetHandle:{

width:"42px",

height:"5px",

borderRadius:"999px",

background:"#D8D8D8",

margin:"-10px auto 20px auto",

},

};

<style jsx global>{`

@keyframes sheetUp{

from{

transform:translateY(100%);

}

to{

transform:translateY(0);

}

}

@keyframes fadeIn{

from{

opacity:0;

}

to{

opacity:1;

}

}

`}</style>