import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Player, RoomData } from "../../utils/types";
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
import PlayerCard from "../PlayerCard";
import useLocalStorage from "../../hooks/useLocalStorage";
import ScoreCard from "../ScoreCard";

type Props = { roomId: string };

function GamePlay({ roomId }: Props) {
  const [roomData, setRoomData] = useState<RoomData>();
  const [name, setName] = useState<string>();
  const [playersList, setPlayersList] = useState<Player[]>();
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [localState, setLocalState] = useLocalStorage(`fastQuiz-player`, {});

  const roomRef = doc(firestoreDB, "rooms", roomId);
  const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);

  const unsubRooms = onSnapshot(roomRef, (doc) => {
    setRoomData({ ...(doc.data() as RoomData) });
  });

  const unsubPlayers = onSnapshot(playersRef, (querySnapshot) => {
    let tempPlayersList: Player[] = [];
    querySnapshot.forEach((player) => {
      tempPlayersList.push({
        ...player.data(),
        id: player.id,
      } as Player);
    });
    setPlayersList(tempPlayersList);
  });

  useEffect(() => {
    if (localState?.name) {
      setName(localState.name);
    }
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
    playersList?.forEach((player) => {
      deleteDoc(doc(firestoreDB, `rooms/${roomId}/players/${player.id}`));
    });
    updateDoc(roomRef, { isStarted: false, currentQuestion: 0 });
  };

  const handleNext = () => {
    if (roomData) {
      console.log("next");
      updateDoc(roomRef, {
        currentQuestion: roomData?.currentQuestion + 1,
        isShowingScoreCard: false,
      });
    }
  };

  const handleShowScoreCard = () => {
    updateDoc(roomRef, { isShowingScoreCard: true });
  };

  const handleBack = () => {
    console.log("next");
    if (roomData && roomData?.currentQuestion > 0) {
      console.log("next +");
      updateDoc(roomRef, { currentQuestion: roomData?.currentQuestion - 1 });
    }
  };

  const handleJoinGame = () => {
    setIsLoadingJoin(true);
    const newPlayer = { name, score: 0, correctAnswers: [], answersList: [] };
    addDoc(playersRef, newPlayer).then((player) => {
      setLocalState({ ...newPlayer, id: player.id } as Player);
      setIsLoadingJoin(false);
      setHasJoined(true);
    });
  };

  const allPlayersReady =
    playersList?.filter(
      (player) => player.answersList?.length === roomData?.currentQuestion! + 1
    ).length === playersList?.length;

  const hasPlayers = playersList?.length !== 0;

  return (
    <Container maxW="container.sm">
      {roomData?.isShowingScoreCard && (
        <Box p="4">
          <ScoreCard
            next={handleNext}
            playersList={playersList}
            roomData={roomData}
            restart={handleRestart}
          />
        </Box>
      )}
      {!roomData?.isShowingScoreCard &&
        (!roomData?.isStarted || !hasPlayers) && (
          <Stack p="5">
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
                      isDisabled={!name || hasJoined}
                      isLoading={isLoadingJoin}
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
              <Stack direction="row">
                {playersList &&
                  playersList.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
              </Stack>
            )}
          </Stack>
        )}
      {!roomData?.isShowingScoreCard && hasPlayers && roomData?.isStarted && (
        <Card p="5" m="5">
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
              roomId={roomId}
              roomData={roomData}
              handleNext={handleShowScoreCard}
              handleBack={handleBack}
              allPlayersReady={allPlayersReady}
            />
          )}
        </Card>
      )}
    </Container>
  );
}

export default GamePlay;
