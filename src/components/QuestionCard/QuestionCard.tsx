import { Box, Button, Card, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { RoomData } from "../../utils/types";
import Question from "../GamePlay/Question";

type Props = {
  roomData: RoomData;
  roomId: string;
  handleRestart: () => void;
  handleShowScoreCard: () => void;
  handleBack: () => void;
  allPlayersReady: boolean;
};

const QuestionCard = ({
  roomData,
  roomId,
  handleRestart,
  handleShowScoreCard,
  handleBack,
  allPlayersReady,
}: Props) => {
  return (
    <Card p="5" m="5">
      <Flex justify="space-between" p="5">
        <Box>
          <Heading size="md">{roomData?.roomName}</Heading>
          <Box>
            Current Questions: {Number(roomData?.currentQuestion) + 1} of{" "}
            {roomData?.triviaQuestions && roomData?.triviaQuestions.length}
          </Box>
        </Box>
        <Button onClick={handleRestart}>Restart</Button>
      </Flex>
      {roomData && (
        <Question
          roomId={roomId}
          roomData={roomData}
          handleNext={handleShowScoreCard}
          handleBack={handleBack}
          allPlayersReady={allPlayersReady}
        />
      )}
    </Card>
  );
};

export default QuestionCard;
