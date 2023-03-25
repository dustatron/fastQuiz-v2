import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";
import { RoomData } from "../../utils/types";
import {
  Card,
  Heading,
  Box,
  Container,
  Stack,
  Button,
  Flex,
  Center,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import Question from "./Question";
import { firestoreDB } from "../../utils/firebaseConfig";

type Player = {
  id: string;
  name: string;
};

type Props = { roomId: string };

function GamePlay({ roomId }: Props) {
  const [roomData, setRoomData] = useState<RoomData>();
  const [name, setName] = useState<string>();
  const [playersList, setPlayersList] = useState<Player[]>();

  const roomRef = doc(firestoreDB, "rooms", roomId);
  const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);

  const unsubRooms = onSnapshot(roomRef, (doc) => {
    setRoomData({ ...(doc.data() as RoomData) });
  });

  const unsubPlayers = onSnapshot(playersRef, (querySnapshot) => {
    let tempPlayersList: Player[] = [];
    querySnapshot.forEach((player) => {
      tempPlayersList.push(player.data() as Player);
    });
    setPlayersList(tempPlayersList);
  });

  useEffect(() => {
    return () => {
      unsubRooms();
      unsubPlayers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    updateDoc(roomRef, { isStarted: true });
  };
  const handleRestart = () => {
    updateDoc(roomRef, { isStarted: false, currentQuestion: 0 });
  };

  const handleNext = () => {
    console.log("next");
    if (
      roomData &&
      roomData?.currentQuestion < roomData?.triviaQuestions.length - 1
    ) {
      console.log("next +");
      updateDoc(roomRef, { currentQuestion: roomData?.currentQuestion + 1 });
    }
  };
  const handleBack = () => {
    console.log("next");
    if (roomData && roomData?.currentQuestion > 0) {
      console.log("next +");
      updateDoc(roomRef, { currentQuestion: roomData?.currentQuestion - 1 });
    }
  };

  const handleJoinGame = () => {
    addDoc(playersRef, { name });
  };

  const hasPlayers = playersList?.length !== 0;
  return (
    <Container maxW="container.sm">
      {!roomData?.isStarted && (
        <Stack>
          <Center p="5">
            <Heading size="sm">Join Game</Heading>
          </Center>
          <Stack>
            <Flex justify="space-between">
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={"text"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleJoinGame}
                    colorScheme="blue"
                    isDisabled={!name}
                  >
                    Join
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
            <Button
              onClick={handleStart}
              colorScheme={!roomData?.isStarted ? "green" : "blue"}
              isDisabled={!hasPlayers}
            >
              {!roomData?.isStarted ? "Start Game" : "restart"}
            </Button>
          </Stack>
          {hasPlayers && (
            <Flex>
              {playersList &&
                playersList.map((player) => (
                  <Card key={player.id}>{player.name}</Card>
                ))}
            </Flex>
          )}
        </Stack>
      )}
      {hasPlayers && roomData?.isStarted && (
        <Card p="5">
          <Flex justify="space-between" p="5">
            <Box>
              <Heading size="md">{roomData?.roomName}</Heading>
              <Box>
                Current Questions: {Number(roomData?.currentQuestion) + 1} of{" "}
                {roomData?.triviaQuestions && roomData?.triviaQuestions.length}
              </Box>
            </Box>
            <Button onClick={handleRestart}>Restart</Button>
          </Flex>
          {roomData && (
            <Question
              roomData={roomData}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          )}
        </Card>
      )}
    </Container>
  );
}

export default GamePlay;
