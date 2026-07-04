import {
doc,
getDoc
} from "firebase/firestore";

import { db } from "./firebase";

export async function getUserYuma(

userId:string,
yumaId:string

){

const snapshot=
await getDoc(

doc(
db,
"users",
userId,
"yumas",
yumaId
)

);

if(
!snapshot.exists()
){

return null;

}

return{

id:
snapshot.id,

...snapshot.data(),

};

}