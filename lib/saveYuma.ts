import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const saveYuma = async (userId: string, yumaId: string) => {
  console.log("🔥 userId:", userId);
  console.log("🔥 yumaId:", yumaId);

  await setDoc(doc(db, "users", userId, "yumas", yumaId), {
    acquiredAt: new Date(),
  });
};