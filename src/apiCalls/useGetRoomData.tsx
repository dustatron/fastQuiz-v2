import { useQuery } from "react-query";
import { RoomData } from "../utils/types";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../utils/firebaseConfig";

type Props = { roomId: string | string[] | undefined };

function useGetRoomData({ roomId }: Props) {
  const getAndSetRoomData = async () => {
    if (typeof roomId === "string") {
      const docRef = doc(firestoreDB, "rooms", roomId);
      const docSnap = await getDoc(docRef);
      const results = { ...docSnap.data(), roomId: docSnap.id } as RoomData;
      return results;
    }
  };
  return useQuery(["roomData", roomId], getAndSetRoomData, { enabled: true });
}

export default useGetRoomData;
