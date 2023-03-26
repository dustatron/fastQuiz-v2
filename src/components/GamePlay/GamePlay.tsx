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
import JoinGame from "../JoinGame";
import QuestionCard from "../QuestionCard";
import EndCard from "../EndCard";

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
    setHasJoined(false);
    updateDoc(roomRef, {
      isStarted: false,
      currentQuestion: 0,
      isEnded: false,
    });
  };

  const handleNext = () => {
    if (
      roomData &&
      roomData.currentQuestion < roomData.triviaQuestions.length - 1
    ) {
      updateDoc(roomRef, {
        currentQuestion: roomData?.currentQuestion + 1,
        isShowingScoreCard: false,
      });
    }

    if (
      roomData &&
      roomData.currentQuestion === roomData.triviaQuestions.length - 1
    ) {
      updateDoc(roomRef, {
        isEnded: true,
        isShowingScoreCard: false,
        isStarted: false,
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
      {roomData?.isEnded && (
        <EndCard
          handleRestart={handleRestart}
          roomData={roomData}
          playersList={playersList}
        />
      )}
      {roomData?.isShowingScoreCard && (
        <ScoreCard
          next={handleNext}
          playersList={playersList}
          roomData={roomData}
          restart={handleRestart}
        />
      )}
      {!roomData?.isShowingScoreCard &&
        !roomData?.isEnded &&
        (!roomData?.isStarted || !hasPlayers) && (
          <JoinGame
            name={name}
            setName={setName}
            handleJoinGame={handleJoinGame}
            handleStart={handleStart}
            hasJoined={hasJoined}
            hasPlayers={hasPlayers}
            isLoadingJoin={isLoadingJoin}
            isStarted={roomData?.isStarted}
          >
            {hasPlayers && (
              <Stack direction="row">
                {playersList &&
                  playersList.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
              </Stack>
            )}
          </JoinGame>
        )}
      {!roomData?.isShowingScoreCard &&
        hasPlayers &&
        roomData?.isStarted &&
        !roomData.isEnded && (
          <QuestionCard
            allPlayersReady={allPlayersReady}
            handleBack={handleBack}
            handleRestart={handleRestart}
            handleShowScoreCard={handleShowScoreCard}
            roomData={roomData}
            roomId={roomId}
          />
        )}
    </Container>
  );
}

export default GamePlay;
