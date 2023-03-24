import { Firestore } from "firebase/firestore";
import { useQuery } from "react-query";
import { RoomData } from "../utils/types";
import { doc, getDocs, collection } from "firebase/firestore";

type Props = { firestore: Firestore };

function useGetRoomsList({ firestore }: Props) {
  const roomsRef = collection(firestore, "rooms");

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
