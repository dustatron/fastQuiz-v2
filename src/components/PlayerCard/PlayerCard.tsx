import { Box, Card, Stack } from "@chakra-ui/react";
import React from "react";
import { Player } from "../../utils/types";

type Props = {
  player: Player;
  isCorrectAnswer?: boolean;
};

const PlayerCard = ({ player, isCorrectAnswer }: Props) => {
  return (
    <Card
      key={player.id}
      p="3"
      backgroundColor={isCorrectAnswer ? "green.200" : ""}
    >
      <Stack direction="row">
        <Box>{player.name} :</Box>
        <Box>{player.score}</Box>
      </Stack>
    </Card>
  );
};

export default PlayerCard;
