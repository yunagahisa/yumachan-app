"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getUserYumas } from "@/lib/getUserYumas";
import { getWork } from "@/lib/getWork";
import { useRouter } from "next/navigation";

export default function ProfilePage() {

 const [nickname,setNickname]
 = useState("");

 const [collections,setCollections]
 = useState<any[]>([]);

 const router = useRouter();

 useEffect(()=>{

   const fetchData=async()=>{

     const user=
     auth.currentUser;

     if(!user)return;

     setNickname(
       user.displayName ||
       "Guest"
     );

     const yumas=
     await getUserYumas(
       user.uid
     );

     const items=
     await Promise.all(

       yumas.map(
         async(
           yuma:any
         )=>{


           const work=
           await getWork(
             yuma.id
           );

           return{

             ...work,

             id:yuma.id,

             acquiredDate:
             yuma.acquiredDate,

             inSquad:
             yuma.inSquad,

           };

         }
       )

     );


     setCollections(
       items
     );

   };

   fetchData();

 },[]);

 return(

<div style={styles.container}>

<div style={styles.profileSection}>


{/* Header */}


<div style={styles.header}>

<h2 style={styles.headerTitle}>

Collection

</h2>

</div>


{/* User */}


<div style={styles.userRow}>

<div style={styles.icon}/>

<h2 style={styles.nickname}>


{nickname} 様


</h2>

</div>


{/* Scroll Area */}

<div style={styles.collectionArea}>

{collections.map(
(item)=>{

const date=
item.acquiredDate
?.toDate?.();

const formattedDate=
date
?`${date.getFullYear()}.${String(
date.getMonth()+1
).padStart(
2,
"0"
)}.${String(
date.getDate()
).padStart(
2,
"0"
)}`
:"";




return(


<div
 key={item.id}
 style={styles.card}
 onClick={() => router.push(`/my/${item.id}`)}
>


{/* image */}


<div
style={styles.imageGroup}
>


<img
src={
item.workImageUrl
}
style={
styles.workImage
}
/>


<img
src={
item.imageUrl
}
style={
styles.yumaImage
}
/>


</div>




{/* right */}


<div
style={
styles.textArea
}
>


<div
style={
styles.titleRow
}
>


<p
style={
styles.workTitle
}
>


{item.title}


</p>


{item.type===
"limited"&&(


<img
src="/limited-icon.png"
style={
styles.typeIcon
}
/>


)}


{item.type===
"custom"&&(


<img
src="/custom-icon.png"
style={
styles.typeIcon
}
/>


)}


</div>




<p
style={
styles.description
}
>


{
item.description
}


</p>




<p
style={
styles.date
}
>


{
formattedDate
}


</p>


</div>


</div>


);


}


)}


</div>




</div>


<style jsx>{`


div::-webkit-scrollbar{


display:none;


}


`}</style>


</div>


);


}


const styles:any={


container:{


display:"flex",


flexDirection:
"column",


height:"100%",


},


profileSection:{


display:"flex",


flexDirection:
"column",


height:"100%",


},


header:{


display:"flex",


justifyContent:
"center",


marginBottom:"30px",


},


headerTitle:{


margin:0,


fontSize:"20px",


fontWeight:600,


color:"#000000ff",


},


userRow:{


display:"flex",


alignItems:"center",


gap:"14px",


marginTop:"-15px",


},


icon:{


width:"35px",


height:"35px",


borderRadius:
"999px",


background:
"#d9d9d9",


},


nickname:{


fontSize:"12px",


fontWeight:550,


margin:0,


color:"#000000ff",


},


collectionArea:{


display:"flex",


flexDirection:
"column",


overflowY:
"scroll",


flex:1,


paddingBottom:"20px",

paddingRight:"8px",

msOverflowStyle:
"none",

scrollbarWidth:
"none",

marginTop:"10px",

},


card:{

display:"flex",

alignItems:"center",

gap:"0px",

borderBottom:
"0px solid #0b344e74",

maxHeight:"70px",

background:
"#ffffffff",

borderRadius:
"15px",

},


imageGroup:{


display:"flex",


alignItems:
"center",


gap:"8px",


flexShrink:0,


},


workImage:{


width:"62px",


height:"62px",


objectFit:
"contain",


borderRadius:
"8px",


background:
"#f4f4f4",


},


yumaImage:{


width:"0px",


height:"0px",


objectFit:
"cover",


borderRadius:
"12px",


},


textArea:{


display:"flex",


flexDirection:
"column",


justifyContent:
"center",


flex:1,


paddingLeft:"0px",


minWidth:0,


},


titleRow:{


display:"flex",


alignItems:
"center",


gap:"6px",


marginBottom:"0px",


paddingTop:"50px",


paddingLeft:"5px",


},


workTitle:{


margin:0,


fontSize:"12px",


fontWeight:600,


color:"#000000ff",


},


typeIcon:{


width:"18px",


height:"18px",


objectFit:
"contain",


},


description:{


margin:0,


fontSize:"12px",


fontWeight:550,


lineHeight:1.5,


marginBottom:"25px",


marginLeft:"5px",


color:"#000000ff",


paddingBottom:"30px",


},


date:{


margin:0,


fontSize:"11px",


color:"#aaa",


},


};

