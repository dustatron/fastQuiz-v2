import { Box, Button, Card, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Card m="1">
      <Flex justify="space-between" p="5">
        <Box>
          <Heading size="md">{roomData?.roomName}</Heading>
          <Box>
            <Text fontWeight="bold">
              {roomData?.triviaQuestions[roomData.currentQuestion].category}
            </Text>
          </Box>
          <Box>
            Question: {Number(roomData?.currentQuestion) + 1} of{" "}
            {roomData?.triviaQuestions && roomData?.triviaQuestions.length}
          </Box>
        </Box>
        <Button
          isLoading={isLoading}
          onClick={() => {
            handleRestart();
            setIsLoading(true);
          }}
        >
          Restart
        </Button>
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
