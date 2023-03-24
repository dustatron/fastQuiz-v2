import { Firestore } from "firebase/firestore";
import { useQuery } from "react-query";
import { RoomData } from "../utils/types";
import { doc, getDoc } from "firebase/firestore";

type Props = { id: string | string[] | undefined; firestore: Firestore };

function useGetRoomData({ id, firestore }: Props) {
  const getAndSetRoomData = async () => {
    if (typeof id === "string") {
      const docRef = doc(firestore, "rooms", id);
      const docSnap = await getDoc(docRef);
      const results = docSnap.data() as RoomData;
      return results;
    }
  };
  return useQuery(["roomData", id], getAndSetRoomData, { enabled: true });
}

export default useGetRoomData;
