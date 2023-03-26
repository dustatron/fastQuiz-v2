import { Button, Heading, Stack, Box, Text, Divider } from "@chakra-ui/react";
import React, { useState } from "react";
import { cleanAsciiString } from "../../utils/helper";
import { Player, RoomData } from "../../utils/types";
import PlayerCard from "../PlayerCard";

type Props = {
  next: () => void;
  playersList: Set<Player>;
  roomData?: RoomData;
  restart: () => void;
};

function ScoreCard({ next, playersList, roomData, restart }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const currentAnswer =
    roomData?.triviaQuestions[roomData.currentQuestion].correct_answer;
  return (
    <Stack spacing={4} p="2" m="1">
      <Stack direction="row" justifyContent="space-between">
        <Heading>ScoreCard</Heading>
        <Button onClick={restart}>Restart</Button>
      </Stack>

      <Box>
        {cleanAsciiString(
          roomData?.triviaQuestions[roomData.currentQuestion].question!
        )}
      </Box>
      <Box>
        <Text fontWeight="black">
          Answer: {currentAnswer && cleanAsciiString(currentAnswer)}
        </Text>
      </Box>
      <Divider />
      <Stack spacing={4} direction="row">
        {Array.from(playersList).map((player) => {
          const isCorrectAnswer =
            currentAnswer && player.correctAnswers?.includes(currentAnswer);
          return (
            <PlayerCard
              player={player}
              key={player.id}
              isCorrectAnswer={!!isCorrectAnswer}
            />
          );
        })}
      </Stack>
      <Button
        colorScheme="blue"
        onClick={() => {
          next();
          setIsLoading(true);
        }}
        isLoading={isLoading}
      >
        Next
      </Button>
    </Stack>
  );
}

export default ScoreCard;
