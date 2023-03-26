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
import { Container, Stack } from "@chakra-ui/react";
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
  const [name, setName] = useState<string>("");
  const [playersList, setPlayersList] = useState(new Set<Player>());
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const [localState, setLocalState] = useLocalStorage(`fastQuiz-player`, {});

  const roomRef = doc(firestoreDB, "rooms", roomId);
  const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);

  useEffect(() => {
    if (localState?.name) {
      setName(localState.name);
    }
    const unSubRooms = onSnapshot(roomRef, (doc) => {
      setRoomData({ ...(doc.data() as RoomData) });
    });

    const unSubPlayers = onSnapshot(playersRef, (querySnapshot) => {
      let tempPlayersList = new Set<Player>();
      let tempPlayerNames = new Set<string>();
      querySnapshot.forEach((player) => {
        tempPlayersList.add({
          ...player.data(),
          id: player.id,
        } as Player);
        tempPlayerNames.add(player.data().name);
      });
      setPlayersList(tempPlayersList);
    });
    return () => {
      unSubRooms();
      unSubPlayers();
    };
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
      isShowingScoreCard: false,
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
    const nameList = Array.from(playersList).map((player) => player.name);
    if (name && !!nameList?.includes(name)) {
      return null;
    }
    setIsLoadingJoin(true);
    const newPlayer = {
      name,
      score: 0,
      correctAnswers: [],
      answersList: [],
      id: localState.id,
      lastAnswer: "",
    } as Player;

    addDoc(playersRef, newPlayer).then((player) => {
      setLocalState({ ...newPlayer, id: player.id } as Player);
      setIsLoadingJoin(false);
      setHasJoined(true);
    });
  };

  const allPlayersReady =
    Array.from(playersList)?.filter((answer) =>
      answer.answersList?.find((ans) => ans.index === roomData?.currentQuestion)
    ).length === playersList.size;

  const hasPlayers = playersList.size !== 0;

  const isPlayer = !!Array.from(playersList).find(
    (player) => player.id === localState.id
  );
  console.log("not Player", isPlayer);
  return (
    <Container maxW="container.sm">
      {roomData?.isEnded && (
        <EndCard
          handleRestart={handleRestart}
          roomData={roomData}
          playersList={playersList}
        />
      )}
      {roomData?.isShowingScoreCard && roomData?.isStarted && (
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
            roomName={roomData?.roomName}
          >
            {hasPlayers && (
              <Stack direction="row">
                {Array.from(playersList).map((player) => (
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
            isPlayer={isPlayer}
          />
        )}
    </Container>
  );
}

export default GamePlay;
