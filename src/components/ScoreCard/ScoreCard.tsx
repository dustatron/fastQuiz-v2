import { Button, Heading, Stack, Box } from "@chakra-ui/react";
import { ST } from "next/dist/shared/lib/utils";
import React from "react";
import { cleanAsciiString } from "../../utils/helper";
import { Player, RoomData } from "../../utils/types";
import PlayerCard from "../PlayerCard";

type Props = {
  next: () => void;
  playersList?: Player[];
  roomData?: RoomData;
  restart: () => void;
};

function ScoreCard({ next, playersList, roomData, restart }: Props) {
  const currentAnswer =
    roomData?.triviaQuestions[roomData.currentQuestion].correct_answer;
  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between">
        <Heading>ScoreCard</Heading>
        <Button onClick={restart}>Restart</Button>
      </Stack>

      <Box>
        {cleanAsciiString(
          roomData?.triviaQuestions[roomData.currentQuestion].question!
        )}
      </Box>
      <Box>{currentAnswer && cleanAsciiString(currentAnswer)}</Box>
      <Stack spacing={4} direction="row">
        {playersList &&
          playersList.map((player) => {
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
      <Button onClick={next}>Next</Button>
    </Stack>
  );
}

export default ScoreCard;
