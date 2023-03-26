import { Button, Heading, Stack, Box } from "@chakra-ui/react";
import React from "react";
import { cleanAsciiString } from "../../utils/helper";
import { Player, RoomData } from "../../utils/types";
import PlayerCard from "../PlayerCard";

type Props = { next: () => void; playersList?: Player[]; roomData?: RoomData };

function ScoreCard({ next, playersList, roomData }: Props) {
  const currentAnswer =
    roomData?.triviaQuestions[roomData.currentQuestion].correct_answer;
  return (
    <Stack spacing={4}>
      <Heading>ScoreCard</Heading>
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
