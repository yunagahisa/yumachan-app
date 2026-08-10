"use client";

import ParticleSystem from "@/app/components/ParticleSystem";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function InteractPage(){

const router = useRouter();

const params=
useParams();

const yumaId=
params.id as string;

return(

<div style={styles.container}>

        <ParticleSystem />

<div style={styles.topBar}>

<button
  style={styles.backButton}
  onClick={() => router.back()}
>
  <img
    src="/collection-icon.png"
    style={styles.menuIcon}
    alt="Collection"
  />
</button>

</div>

<div style={styles.placeholder}>

Yuma Animation Area

</div>

<p style={styles.text}>

Coming Soon...

</p>

</div>

);

}

const styles:any={

container:{

height:"100vh",

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

background:"#fff",

},


backButton:{

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

menuIcon:{

  width:"14px",

  height:"14px",

  objectFit:"contain",

},

placeholder:{

width:"260px",

height:"260px",

borderRadius:"999px",

background:"#F4F4F4",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"#999",

},

text:{

marginTop:"20px",

fontSize:"14px",

color:"#696969",

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

};