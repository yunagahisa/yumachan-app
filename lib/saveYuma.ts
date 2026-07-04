import { db } from "@/lib/firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export const saveYuma = async (
  userId: string,
  yumaId: string
) => {

  console.log("🔥 userId:", userId);
  console.log("🔥 yumaId:", yumaId);

  await setDoc(
    doc(
      db,
      "users",
      userId,
      "yumas",
      yumaId
    ),
    {
      id: yumaId,

      // QR保存日時
      acquiredDate:
        serverTimestamp(),
      inSquad: true,
      favorite: false,
    }
  );
};