import { Box, Button, Card, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { Player, RoomData } from "../../utils/types";
import PlayerCard from "../PlayerCard";

type Props = {
  handleRestart: () => void;
  roomData: RoomData;
  playersList: Set<Player>;
};

function EndCard({ handleRestart, roomData, playersList }: Props) {
  return (
    <Card p="5" m="5">
      <Stack p="5">
        <Heading> You Finished {roomData.roomName} Quiz </Heading>
        <Box>
          {Array.from(playersList).map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </Box>
        <Button onClick={handleRestart}>Restart</Button>
      </Stack>
    </Card>
  );
}

export default EndCard;
