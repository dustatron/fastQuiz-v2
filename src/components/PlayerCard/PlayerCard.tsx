import { Box, Card, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { cleanAsciiString } from "../../utils/helper";
import { Player } from "../../utils/types";

type Props = {
  player: Player;
  isCorrectAnswer?: boolean;
  isEnd?: boolean;
};

const PlayerCard = ({ player, isCorrectAnswer, isEnd }: Props) => {
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
      {!isEnd && (
        <Stack textAlign="center">
          {player.lastAnswer && (
            <Text fontWeight="bold">{cleanAsciiString(player.lastAnswer)}</Text>
          )}
        </Stack>
      )}
    </Card>
  );
};

export default PlayerCard;
