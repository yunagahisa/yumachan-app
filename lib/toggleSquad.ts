import {
doc,
updateDoc,
collection,
getDocs
} from "firebase/firestore";

import { db } from "./firebase";

export async function toggleSquad(

userId:string,
yumaId:string,
currentState:boolean

){

// OFFにする場合は制限不要
if(currentState){

await updateDoc(

doc(
db,
"users",
userId,
"yumas",
yumaId
),

{
inSquad:false
}

);

return;

}

// ONにする場合人数確認

const snapshot=
await getDocs(

collection(
db,
"users",
userId,
"yumas"
)

);

const squadCount=

snapshot.docs.filter(

doc=>

doc.data()
.inSquad===true

).length;


// 最大10人

if(
squadCount>=10
){

alert(
"My Squadは最大10人です"
);

return;

}


await updateDoc(

doc(
db,
"users",
userId,
"yumas",
yumaId
),

{

inSquad:true

}

);

}