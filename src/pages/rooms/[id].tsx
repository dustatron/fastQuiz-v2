import React from "react";
import { Firestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { Center, Container, Heading, Stack } from "@chakra-ui/react";
import useGetRoomData from "../../apiCalls/useGetRoomData";

type Props = { firestore: Firestore };

function RoomDetail({ firestore }: Props) {
  const router = useRouter();
  const { id } = router.query;

  const { data: roomData, isLoading } = useGetRoomData({
    id,
    firestore,
  });

  return (
    <Container>
      <Center>
        <Heading>Room Details</Heading>
      </Center>
      {isLoading && <div> ...loading</div>}
      {!isLoading && (
        <Stack>
          <div>Room Name: {roomData?.roomName}</div>
          <div>Game Id: {roomData?.gameId}</div>
          <div>Public Game: {roomData?.isPublic ? "True" : "False"}</div>
          <div>Game has started: {roomData?.isStarted ? "True" : "False"}</div>
          <div>Game has ended: {roomData?.isEnded ? "True" : "False"}</div>
          <div>Room Leader: {roomData?.roomLeaderId}</div>
        </Stack>
      )}
    </Container>
  );
}

export default RoomDetail;
