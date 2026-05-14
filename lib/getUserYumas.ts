import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export const getUserYumas = async (userId: string) => {
  const ref = collection(db, "users", userId, "yumas");

  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};