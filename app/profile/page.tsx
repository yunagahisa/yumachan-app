"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getUserYumas } from "@/lib/getUserYumas";
import { getWork } from "@/lib/getWork";
import MyYumaPageContent from "@/app/components/MyYumaPageContent";

export default function ProfilePage({

  collections,

  onSquadChange,

}:{

  collections:any[];

  onSquadChange:(
    yumaId:string,
    next:boolean
  )=>void;

}) {

 const [nickname,setNickname]
 = useState("");

 const [selectedYumaId, setSelectedYumaId]
 = useState<string | null>(null);

 const [selectedYuma,setSelectedYuma]
 = useState<any>(null);

 useEffect(()=>{

  const load=async()=>{

    if(!selectedYumaId){

      setSelectedYuma(null);

      return;

    }

    const work=
      await getWork(selectedYumaId);

    setSelectedYuma(work);

  };

  load();

},[selectedYumaId]);


useEffect(()=>{

  const user =
    auth.currentUser;

  if(!user)return;

  setNickname(
    user.displayName ||
    "Guest"
  );

},[]);

 return(

<div style={styles.container}>

<div style={styles.profileSection}>


{/* Header */}


<div style={styles.header}>

<h2 style={styles.headerTitle}>

{selectedYumaId
?"My Yuma"
:"Collection"}

</h2>

</div>


{/* User */}


{!selectedYumaId && (

<div style={styles.userRow}>

  <div style={styles.icon}/>

  <h2 style={styles.nickname}>

    {nickname}

  </h2>

</div>

)}


{/* Scroll Area */}

{selectedYumaId ? (

  <div style={styles.contentArea}>

    <MyYumaPageContent

  yumaId={selectedYumaId}

  onSquadChange={
    onSquadChange
  }

  onClose={()=>{
    setSelectedYumaId(null);
  }}

/>

  </div>

) : (

  <div style={styles.collectionArea}>

    {collections.map((item)=>{

      const date =
        item.acquiredDate?.toDate?.();

      const formattedDate =
        date
        ? `${date.getFullYear()}.${String(
            date.getMonth()+1
          ).padStart(2,"0")}.${String(
            date.getDate()
          ).padStart(2,"0")}`
        : "";

      return(

        <div

          key={item.id}

          style={styles.card}

          onClick={()=>
            setSelectedYumaId(item.id)
          }

        >

          <div style={styles.imageGroup}>

            <img

              src={item.imageUrl}

              style={styles.yumaImage}

            />

          </div>

          <div style={styles.textArea}>

            <div style={styles.titleRow}>

              <p style={styles.workTitle}>

                {item.title}

              </p>

              {item.type==="limited"&&(

                <img

                  src="/limited-icon.png"

                  style={styles.typeIcon}

                />

              )}

              {item.type==="custom"&&(

                <img

                  src="/custom-icon.png"

                  style={styles.typeIcon}

                />

              )}

            </div>

            <p style={styles.description}>

              {item.description}

            </p>

            <p style={styles.date}>

              {formattedDate}

            </p>

          </div>

        </div>

      );

    })}

  </div>

)}

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


fontWeight:700,


color:"#C99CCD",


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


color:"#C99CCD",


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

gap:"10px",

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


yumaImage:{

  width:"62px",

  height:"62px",

  objectFit:"contain",

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


color:"#7a7874ff",


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


color:"#7a7874ff",


paddingBottom:"30px",


},


date:{


margin:0,


fontSize:"11px",


color:"#aaa",


},

contentArea:{

  flex:1,

  overflow:"hidden",

  marginTop:"10px",

},

};

