import {
  Button,
  Box,
  Stack,
  Flex,
  Container,
  Center,
  Badge,
  Text,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { firestoreDB } from "../../utils/firebaseConfig";
import { cleanAsciiString, shuffleList } from "../../utils/helper";
import { RoomData, Player, answerList } from "../../utils/types";

type Props = {
  roomData: RoomData;
  roomId: string;
  handleNext: () => void;
  allPlayersReady: boolean;
  isPlayer: boolean;
};

const Question = ({
  roomData,
  handleNext,
  allPlayersReady,
  roomId,
  isPlayer,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string>();
  const [localStorage, setLocalState] = useLocalStorage(`fastQuiz-player`, {});
  const userId = localStorage.id;
  const { isStarted, currentQuestion, triviaQuestions } = roomData;

  const playerRef = doc(firestoreDB, `rooms/${roomId}/players/${userId}`);

  const currentItem = triviaQuestions[currentQuestion];

  const allQuestions = useMemo(
    () =>
      shuffleList([
        ...currentItem.incorrect_answers,
        currentItem.correct_answer,
      ]),
    []
  );

  const handleMakeGuess = (guess: string) => {
    const isCorrect = guess === currentItem.correct_answer;
    const newScore = isCorrect ? localStorage.score + 1 : localStorage.score;

    let newCorrectAnswerList = localStorage.correctAnswers;
    if (isCorrect) {
      newCorrectAnswerList.push(currentItem.correct_answer);
    }

    const newAnswerList = [
      ...localStorage?.answersList,
      { answer: guess, index: roomData.currentQuestion },
    ];

    setAnswer(guess);
    setLocalState({
      ...localStorage,
      lastAnswer: guess,
      answersList: newAnswerList,
      correctAnswers: newCorrectAnswerList,
      score: newScore,
    } as Player);

    updateDoc(playerRef, {
      answersList: newAnswerList,
      lastAnswer: guess,
      correctAnswers: newCorrectAnswerList,
      score: newScore,
    } as Player);
  };

  return (
    <Container>
      <Box>
        <Center p="4">{cleanAsciiString(currentItem.question)}</Center>
        <Stack spacing={5}>
          {allQuestions &&
            allQuestions.map((guess) => (
              <Button
                key={guess}
                colorScheme={answer === guess ? "facebook" : "gray"}
                onClick={() => handleMakeGuess(guess)}
                isDisabled={!isPlayer}
                p="4"
              >
                <Text w="100%" whiteSpace="normal">
                  {cleanAsciiString(guess)}
                </Text>
              </Button>
            ))}
        </Stack>
        {isStarted && isPlayer && (
          <Flex justify="space-between" p="5">
            <Badge colorScheme={allPlayersReady ? "green" : "blue"} p="3">
              {allPlayersReady ? "Ready" : "waiting"}
            </Badge>
            <Button
              onClick={() => {
                handleNext();
                setIsLoading(true);
              }}
              isLoading={isLoading}
              colorScheme={allPlayersReady ? "green" : "gray"}
              isDisabled={!allPlayersReady}
            >
              Next
            </Button>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default Question;
