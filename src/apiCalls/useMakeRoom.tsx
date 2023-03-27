import { collection, addDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { RoomData } from "../utils/types";
import { useRouter } from "next/router";
import { firestoreDB } from "../utils/firebaseConfig";

type Props = {
  roomData: RoomData;
};

// This hook may not be needed anymore
// Its functionality was included in useGetOpenTDB

function useMakeRoom({ roomData }: Props) {
  const router = useRouter();

  const fetcher = async () => {
    const roomsRef = collection(firestoreDB, "rooms");
    addDoc(roomsRef, roomData)
      .then((docRef) => {
        console.log("doc", docRef);
        console.log("docID", docRef.id);
        router.push(`/games/${docRef.id}`);
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
