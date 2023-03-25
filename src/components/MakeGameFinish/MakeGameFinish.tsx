import { Box, Card, Stack, Button } from "@chakra-ui/react";
import { Firestore } from "firebase/firestore";
import React from "react";
import { GetQueryProps } from "../../apiCalls/useGetOpenTDB";
import useMakeRoom from "../../apiCalls/useMakeRoom";
import { QuestionResponse } from "../../utils/types";

type Props = {
  questions: QuestionResponse[];
  quizPayload?: GetQueryProps;
};

function MakeGameFinish({ questions, quizPayload }: Props) {
  const { refetch, isLoading } = useMakeRoom({
    roomData: {
      currentQuestion: 0,
      isEnded: false,
      isPublic: quizPayload?.isPublic || false,
      isStarted: false,
      roomName: quizPayload?.roomName || "default room",
      triviaQuestions: questions,
    },
  });
  return (
    <Card>
      <Stack>
        <Box>{questions.length} Questions</Box>
        <Box>Trivia Room name : {quizPayload?.roomName}</Box>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={() => refetch()}
        >
          Make Game
        </Button>
      </Stack>
    </Card>
  );
}

export default MakeGameFinish;
