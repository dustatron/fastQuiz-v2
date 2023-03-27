import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React from "react";
import { useMutation } from "react-query";
import { firestoreDB } from "../utils/firebaseConfig";

type Props = { onSettled: () => void };

function useDeleteGame({ onSettled }: Props) {
  const fetcher = async (roomId?: string) => {
    if (!roomId) return null;
    const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);
    const rooms = await getDocs(playersRef);

    // First delete players docs in sub collection
    rooms.forEach((player) => {
      deleteDoc(doc(firestoreDB, `rooms/${roomId}/players/${player.id}`));
    });

    // Then delete doc
    deleteDoc(doc(firestoreDB, `rooms/${roomId}`));
  };
  return useMutation(["games"], fetcher, { onSettled });
}

export default useDeleteGame;
