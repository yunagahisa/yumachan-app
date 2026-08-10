"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getWork } from "@/lib/getWork";
import { getUserYuma } from "@/lib/getUserYuma";
import { toggleSquad } from "@/lib/toggleSquad";
import { toggleFavorite } from "@/lib/toggleFavorite";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import HeartButton from "@/app/components/HeartButton";
import SquadButton from "@/app/components/SquadButton";

export default function MyYumaPageContent({

  yumaId,

  onClose,

  onSquadChange,

}:{

  yumaId:string;

  onClose?:()=>void;

  onSquadChange?:(
    yumaId:string,
    next:boolean
  )=>void;

}) {


const router = useRouter();
const [work, setWork] = useState<any>(null);
const [inSquad, setInSquad] = useState(false);
const [favorite, setFavorite] = useState(false);
const [rarity, setRarity] = useState("normal");


useEffect(() => {

  if (!yumaId) return;

  const unsubscribe =
    onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {
      const data =
        await getWork(yumaId);

      setWork(data);

      return;
    }

    const [data, userYuma] =
      await Promise.all([
        getWork(yumaId),
        getUserYuma(
          user.uid,
          yumaId
        )
      ]);

    setWork(data);

    if (userYuma) {

      setInSquad(
        userYuma.inSquad
      );

      setFavorite(
        userYuma.favorite ??
        false
      );

      setRarity(
        userYuma.rarity ??
        "normal"
      );
    }
  }
);

  return () => unsubscribe();

}, [yumaId]);


if (
  !work
) {

  return (
  
    <div
      style={{
        padding: 40
      }}
    >

      Loading...

    </div>

  );

}

return (

  <div
    style={
      styles.container
    }
  >

    <button
      onClick={()=>{

  if(onClose){

    onClose();

  }else{

    router.back();

  }

}}
      style={styles.closeButton}
     >
      ✕
     </button>


    {/* image + favorite */}

    <div
      style={
        styles.imageWrapper
      }
    >

      <img
        src={
          work.imageUrl
        }
        style={
          styles.characterImage
        }
      />

      <HeartButton
        initialFavorite={favorite}
        yumaId={yumaId}
        style={styles.heartButton}
      />

    </div>


     {/* interact button */}

    <Link

    href={`/my/${yumaId}/interact`}

    style={styles.interactButton}

    >

    Meet!

    </Link>


      {/* title */}

<div style={styles.titleRow}>

<div

  style={{

    ...styles.rarityBadge,

    background:
      rarity==="superRare"
      ? "#FF7A7A"
      : rarity==="rare"
      ? "#73C8CC"
      : "#252525"
  }}

>

  {
    rarity==="superRare"
    ? "SR"
    : rarity==="rare"
    ? "R"
    : "N"
  }

</div>

<h1 style={styles.title}>

  {work.title}

</h1>

</div>


    {/* squad button */}

    <SquadButton
  initialInSquad={inSquad}
  yumaId={yumaId}
  style={styles.squadButton}
  onSquadChange={onSquadChange}
/>

<div style={styles.workInfoArea}>

<img
  src={work.workImageUrl}
  style={styles.workImage}
/>

<div style={styles.workTextArea}>

  <h2 style={styles.workTitle}>

    {work.title}

  </h2>

  <div style={styles.categoryBadge}>

    {work.category}

  </div>

  <p style={styles.workDescription}>

    {work.description}

  </p>

</div>

</div>


{/* footer */}

<div style={styles.footerArea}>

<img
  src="/footerLogo.png"
  style={styles.footerLogo}
/>

</div>

  </div>

);
}


const styles: any = {


container: {
  minHeight:
    "100vh",
  display:
    "flex",
  flexDirection:
    "column",
  justifyContent:
    "center",
  alignItems:
    "center",
  gap: "24px",
  padding: "24px",
  background:
    "#ffffffff",
},


title: {
  fontSize: "24px",
  fontWeight: 600,
  letterSpacing:
    "-0.05em",
  color:
    "#252525",
},


imageWrapper:{
  position:"relative",
  marginTop:"-90px",
},


characterImage: {
  width: "130px",
  height: "130px",
  objectFit:
    "cover",
  borderRadius:
    "24px",
  background:
    "#f6f1eb",
  marginTop: "68px",
},


heartButton: {
  position:
    "absolute",
  top: "12px",
  right: "-60px",
  width: "40px",
  height: "40px",
  border: "none",
  background:
    "transparent",
  padding:0,
  cursor:
    "pointer",
  marginTop: "60px",
},


heartIcon:{
width:"26px",
height:"26px",
objectFit:"contain",
},


interactButton:{
padding:
"10px 30px",
borderRadius:
"999px",
background:
"#ebe7e7ff",
color:
"#333333",
fontWeight:
600,
fontSize:
"11px",
textDecoration:
"none",
marginTop:
"0px",
border:"0px solid #bababaff",
},


workInfoArea:{
   display:"flex",
   alignItems:"flex-start",
   gap:"16px",
   marginTop:"-20px",
   marginBottom:"150px",
   width:"100%",
   maxWidth:"720px",
},


workImage:{
   width:"95px",
   height:"95px",
   objectFit:"cover",
   borderRadius:"0px",
   background:"#F4F1EB",
   flexShrink:0,
},


workTextArea:{
   display:"flex",
   flexDirection:"column",
   justifyContent:"flex-start",
   flex:1,
},


workTitle:{
   margin:0,
   fontSize:"12px",
   fontWeight:400,
   color:"#333333",
   marginBottom:"3px",
   marginTop:"10px",
},


categoryBadge:{
   display:"inline-flex",
   alignItems:"center",
   padding:"0px 12px",
   borderRadius:"999px",
   background:"#E0B2C6",
   fontSize:"6px",
   fontWeight:500,
   color:"#333333",
   marginBottom:"10px",
   width:"fit-content",
},


workDescription:{
   margin:0,
   fontSize:"10px",
   lineHeight:1.7,
   color:"#333333",
   maxWidth:"320px",
   marginTop:"-5px",
},


squadButton:{
   display:"flex",
   alignItems:"center",
   justifyContent:"center",
   gap:"8px",
   width:"130px",
   height:"28px",
   borderRadius:"999px",
   border:"0px solid #bababaff",
   background:"#ebe7e7ff",
   fontSize:"10px",
   fontWeight:600,
   color:"#333333",
   cursor:"pointer",
   marginBottom:"28px",
},


footerArea:{
marginTop:"auto",
width:"100%",
display:"flex",
justifyContent:"center",
alignItems:"center",
paddingBottom:"30px",
},


footerLogo:{
width:"140px",
objectFit:"contain",
marginTop:"-20px",
},


hideButton:{
position:"absolute",
top:"68px",
left:"24px",
display:"flex",
alignItems:"center",
transform:
"translateY(-50%)",
zIndex:200,
},


hideIcon:{
width:"22px",
height:"22px",
objectFit:"contain",
},


rarityBadge:{
width:"20px",
height:"20px",
borderRadius:"999px",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#fff",
fontSize:"10px",
fontWeight:600,
flexShrink:0,
},


titleRow:{
display:"flex",
alignItems:"center",
gap:"8px",
marginTop:"-10px",
},


closeButton: {
position: "absolute",
top: "18px",
left: "18px",
width: "38px",
height: "38px",
borderRadius: "999px",
border: "none",
background: "rgba(0,0,0,0.05)",
display: "flex",
alignItems: "center",
justifyContent: "center",
cursor: "pointer",
fontSize: "18px",
fontWeight: 700,
color: "#333",
backdropFilter: "blur(6px)",
},

};





