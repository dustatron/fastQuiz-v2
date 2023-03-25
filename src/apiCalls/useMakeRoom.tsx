import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { RoomData } from "../utils/types";
import { useRouter } from "next/router";
import { firestoreDB } from "../utils/firebaseConfig";

type Props = {
  roomData: RoomData;
};

function useMakeRoom({ roomData }: Props) {
  const router = useRouter();
  const [docId, setDocId] = useState<string>();

  const fetcher = async () => {
    const roomsRef = collection(firestoreDB, "rooms");
    addDoc(roomsRef, roomData)
      .then((docRef) => {
        setDocId(docRef.id);
        console.log("doc", docRef);
        console.log("docID", docRef.id);
        router.push(`/rooms/${docRef.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return useQuery(["room-maker", roomData.roomName], fetcher, {
    enabled: false,
  });
}

export default useMakeRoom;
