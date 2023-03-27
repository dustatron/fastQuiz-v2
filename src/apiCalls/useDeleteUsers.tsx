import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useMutation } from "react-query";
import { firestoreDB } from "../utils/firebaseConfig";
import { Player } from "../utils/types";

type Props = {
  roomId: string;
  playersList: Set<Player>;
};

function useDeleteUsers({ roomId, playersList }: Props) {
  const fetcher = async () => {
    playersList.forEach((player) => {
      deleteDoc(doc(firestoreDB, `rooms/${roomId}/players/${player.id}`));
    });
  };

  return useMutation([roomId, playersList], fetcher);
}

export default useDeleteUsers;
