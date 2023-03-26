import {
  Center,
  Container,
  Heading,
  Stack,
  Card,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import useGetRoomsList from "../../apiCalls/useGetRoomsList";
import { firestoreDB } from "../../utils/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

function RoomListView() {
  const { data: roomsList, isLoading, refetch } = useGetRoomsList();
  const router = useRouter();

  const handelDeleteRoom = async (roomId?: string) => {
    if (roomId) {
      const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);
      const rooms = await getDocs(playersRef);
      rooms.forEach((player) => {
        deleteDoc(doc(firestoreDB, `rooms/${roomId}/players/${player.id}`));
      });
      deleteDoc(doc(firestoreDB, `rooms/${roomId}`));
      refetch();
    }
  };

  return (
    <Container>
      <Center>
        <Heading>Rooms</Heading>
      </Center>
      <Stack>
        {isLoading && <div>...loading rooms</div>}
        {roomsList?.map((room) => (
          <Card p="5" key={room.roomId}>
            <Center>
              <Heading size="md">{room.roomName}</Heading>
            </Center>
            <Stack direction="row" justifyContent="space-between" p="5">
              <Button
                onClick={() => handelDeleteRoom(room.roomId)}
                colorScheme="red"
              >
                Delete
              </Button>
              <Button onClick={() => router.push(`/rooms/${room.roomId}`)}>
                Join Room
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default RoomListView;
