import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getWork = async (id: string) => {
  const ref = doc(db, "works", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data();
};