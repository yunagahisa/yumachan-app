"use client";

import Link from "next/link";

import {
useParams
}
from "next/navigation";

export default function InteractPage(){

const params=
useParams();

const yumaId=
params.id as string;

return(

<div style={styles.container}>

<Link

href={`/my/${yumaId}`}

style={styles.backButton}

>

← Back

</Link>

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

position:"absolute",

top:"40px",

left:"20px",

textDecoration:"none",

color:"#696969",

fontWeight:600,

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

};