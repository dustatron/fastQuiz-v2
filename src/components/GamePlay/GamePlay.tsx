import React, { useEffect, useState } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { Player, RoomData } from "../../utils/types";
import { Box, Container, Stack } from "@chakra-ui/react";
import { firestoreDB } from "../../utils/firebaseConfig";
import PlayerCard from "../PlayerCard";
import useLocalStorage from "../../hooks/useLocalStorage";
import ScoreCard from "../ScoreCard";
import JoinGame from "../JoinGame";
import QuestionCard from "../QuestionCard";
import EndCard from "../EndCard";
import useAddPlayer from "../../apiCalls/useAddPlayer";
import useUpdateNext from "../../apiCalls/useUpdateNext";
import useDeleteUsers from "../../apiCalls/useDeleteUsers";

type Props = { roomId: string };

function GamePlay({ roomId }: Props) {
  const [localState] = useLocalStorage(`fastQuiz-player`, {});
  const [roomData, setRoomData] = useState<RoomData>();
  const [playersList, setPlayersList] = useState(new Set<Player>());

  const [name, setName] = useState<string>("");

  const { mutate: addPlayer, isLoading: isLoadingAddPlayer } = useAddPlayer({
    name,
    playerId: localState.id,
    roomId,
  });

  const { mutate: updateNext, isLoading: isNextLoading } = useUpdateNext({
    roomId,
    currentQuestion: roomData?.currentQuestion,
    amountOfQuestions: roomData?.triviaQuestions.length,
    nextQuestion: Number(roomData?.currentQuestion) + 1,
  });

  const { mutate: deleteRoomUsers } = useDeleteUsers({ playersList, roomId });

  useEffect(() => {
    if (localState?.name) {
      setName(localState.name);
    }

    const roomRef = doc(firestoreDB, "rooms", roomId);
    const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);

    const unSubRooms = onSnapshot(roomRef, (doc) => {
      setRoomData({ ...(doc.data() as RoomData) });
    });

    const unSubPlayers = onSnapshot(playersRef, (querySnapshot) => {
      let tempPlayersList = new Set<Player>();
      querySnapshot.forEach((player) => {
        tempPlayersList.add({
          ...player.data(),
        } as Player);
      });
      setPlayersList(tempPlayersList);
    });
    return () => {
      unSubRooms();
      unSubPlayers();
    };
    //Should only run on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    updateNext({
      action: "START",
    });
  };

  const handleDeleteUsers = () => {
    deleteRoomUsers();
  };
  const handleRestart = () => {
    updateNext({
      action: "RESTART",
    });
  };

  const handleNext = () => {
    updateNext({
      action: "NEXT_QUESTION",
    });
  };

  const handleShowScoreCard = () => {
    updateNext({
      action: "SHOW_SCORE_CARD",
    });
  };

  const handleJoinGame = () => {
    addPlayer();
  };

  const allPlayersReady =
    Array.from(playersList)?.filter((answer) =>
      answer.answersList?.find((ans) => ans.index === roomData?.currentQuestion)
    ).length === playersList.size;

  const hasPlayers = playersList.size !== 0;

  const isPlayer = !!Array.from(playersList).find(
    (player) => player.id === localState.id
  );

  return (
    <Container maxW="container.sm">
      {roomData?.isEnded && (
        <EndCard
          handleRestart={handleRestart}
          handleDeleteUsers={handleDeleteUsers}
          roomData={roomData}
          playersList={playersList}
          roomId={roomId}
        />
      )}
      {roomData?.isShowingScoreCard && roomData?.isStarted && (
        <ScoreCard
          next={handleNext}
          playersList={playersList}
          roomData={roomData}
          restart={handleRestart}
          isNextLoading={isNextLoading}
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
            hasPlayers={hasPlayers}
            isLoadingJoin={isLoadingAddPlayer}
            isStarted={roomData?.isStarted}
            roomName={roomData?.roomName}
            isPlayer={isPlayer}
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
        roomData?.triviaQuestions.length !== 0 &&
        roomData?.isStarted &&
        !roomData.isEnded && (
          <QuestionCard
            allPlayersReady={allPlayersReady}
            handleRestart={handleRestart}
            handleShowScoreCard={handleShowScoreCard}
            roomData={roomData}
            roomId={roomId}
            isPlayer={isPlayer}
          />
        )}
      {!roomData?.isShowingScoreCard &&
        hasPlayers &&
        roomData?.triviaQuestions.length === 0 &&
        roomData?.isStarted && <Box>No questions</Box>}
    </Container>
  );
}

export default GamePlay;
