import {
  Center,
  Container,
  Heading,
  Stack,
  Card,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { Firestore } from "firebase/firestore";
import { useRouter } from "next/router";
import useGetRoomsList from "../../apiCalls/useGetRoomsList";

type Props = { firestore: Firestore };

function RoomsPage({ firestore }: Props) {
  const { data: roomsList, isLoading } = useGetRoomsList({ firestore });
  const router = useRouter();

  return (
    <Container>
      <Center>
        <Heading>Rooms</Heading>
      </Center>
      <Stack>
        {isLoading && <div>...loading rooms</div>}
        {roomsList?.map((room) => (
          <Card p="5" key={room.roomId}>
            {room.roomName}
            <Button onClick={() => router.push(`/rooms/${room.roomId}`)}>
              Join Room
            </Button>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default RoomsPage;
