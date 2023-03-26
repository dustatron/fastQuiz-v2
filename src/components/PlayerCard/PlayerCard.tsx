import { Box, Card, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { cleanAsciiString } from "../../utils/helper";
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

      <Stack textAlign="center">
        <Text fontWeight="bold">{cleanAsciiString(player.lastAnswer!)}</Text>
      </Stack>
    </Card>
  );
};

export default PlayerCard;
