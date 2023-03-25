import { Button, Box, Stack, Flex, Container, Center } from "@chakra-ui/react";
import React from "react";
import RoomsPage from "../../pages/rooms";
import { cleanAsciiString } from "../../utils/helper";
import { RoomData } from "../../utils/types";

type Props = {
  roomData: RoomData;
  handleNext: () => void;
  handleBack: () => void;
};

const Question = ({ roomData, handleNext, handleBack }: Props) => {
  const {
    isStarted,
    currentQuestion,
    gameId,
    isEnded,
    isPublic,
    roomName,
    triviaQuestions,
    roomLeaderId,
    roomLeaderName,
  } = roomData;
  const currentItem = triviaQuestions[currentQuestion];
  const allQuestions = [
    ...currentItem.incorrect_answers,
    currentItem.correct_answer,
  ];
  return (
    <Container>
      <Box>
        <Center p="4">{cleanAsciiString(currentItem.question)}</Center>
        <Stack spacing={5}>
          {allQuestions &&
            allQuestions.map((question) => (
              <Button key={question}>{cleanAsciiString(question)}</Button>
            ))}
        </Stack>
        {isStarted && (
          <Flex justify="space-between" p="5">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleNext}>Next</Button>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default Question;
