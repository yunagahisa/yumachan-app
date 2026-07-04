import {
  doc,
  updateDoc
} from "firebase/firestore";

import { db }
from "@/lib/firebase";

export async function toggleFavorite(

  userId:string,

  yumaId:string,

  nextValue:boolean

){

  await updateDoc(

    doc(
      db,
      "users",
      userId,
      "yumas",
      yumaId
    ),

    {
      favorite:
      nextValue
    }

  );

}