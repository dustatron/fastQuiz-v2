import { Firestore } from "firebase/firestore";
import { useQuery } from "react-query";
import { RoomData } from "../utils/types";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestoreDB } from "../utils/firebaseConfig";

function useGetRoomsList() {
  const roomsRef = query(
    collection(firestoreDB, "rooms"),
    where("isPublic", "==", true)
  );

  const getRoomList = async () => {
    const roomList: RoomData[] = [];
    const rooms = await getDocs(roomsRef);
    rooms.forEach((doc) => {
      roomList.push({ ...doc.data(), roomId: doc.id } as RoomData);
    });
    return roomList;
  };
  return useQuery(["roomList"], getRoomList, { enabled: true });
}

export default useGetRoomsList;
