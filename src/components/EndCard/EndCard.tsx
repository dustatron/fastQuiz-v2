import { Box, Button, Card, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Player, RoomData } from "../../utils/types";
import PlayerCard from "../PlayerCard";

type Props = {
  handleRestart: () => void;
  roomData: RoomData;
  playersList: Set<Player>;
  roomId: string;
};

function EndCard({ handleRestart, roomData, playersList, roomId }: Props) {
  const router = useRouter();
  return (
    <Card p="5" m="5">
      <Stack p="5">
        <Heading> You Finished {roomData.roomName} Quiz </Heading>
        <Box>Total points possible : {roomData.triviaQuestions.length}</Box>
        <Box>
          {Array.from(playersList).map((player) => (
            <PlayerCard key={player.id} player={player} isEnd />
          ))}
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => router.push(`/newgame/${roomId}`)}
        >
          New questions
        </Button>
        <Button onClick={handleRestart} colorScheme="blackAlpha">
          Restart game
        </Button>
      </Stack>
    </Card>
  );
}

export default EndCard;
