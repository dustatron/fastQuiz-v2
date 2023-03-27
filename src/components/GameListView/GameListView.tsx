import {
  Center,
  Container,
  Heading,
  Stack,
  Card,
  Button,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import useGetRoomsList from "../../apiCalls/useGetRoomsList";
import { firestoreDB } from "../../utils/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import useDeleteGame from "../../apiCalls/useDeleteGame";

function GameListView() {
  const { data: roomsList, isLoading, refetch } = useGetRoomsList();

  const { mutate: deleteGame, isLoading: isDeleting } = useDeleteGame({
    onSettled: () => {
      refetch();
    },
  });
  const router = useRouter();

  const handelDeleteRoom = async (roomId?: string) => {
    deleteGame(roomId);
  };

  return (
    <Container>
      <Center>
        <Heading>Games</Heading>
      </Center>
      <Stack>
        {roomsList?.length === 0 && (
          <Card p="3" textAlign="center" backgroundColor="orange.200">
            No Games, Start a new game
          </Card>
        )}
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
                isLoading={isDeleting}
              >
                Delete
              </Button>
              <Button onClick={() => router.push(`/games/${room.roomId}`)}>
                Join Room
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default GameListView;
