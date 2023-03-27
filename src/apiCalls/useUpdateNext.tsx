import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useMutation } from "react-query";
import { firestoreDB } from "../utils/firebaseConfig";

type Props = {
  roomId: string;
  nextQuestion: number;
  currentQuestion?: number;
  amountOfQuestions?: number;
};

type fetcherProps = {
  action: "NEXT_QUESTION" | "SHOW_SCORE_CARD" | "RESTART" | "START";
};

const useUpdateNext = ({
  roomId,
  currentQuestion,
  amountOfQuestions,
  nextQuestion,
}: Props) => {
  const fetcher = async (params: fetcherProps) => {
    const { action } = params;
    switch (action) {
      case "START":
        return startGame(roomId);
      case "RESTART":
        return restartGame(roomId);
      case "SHOW_SCORE_CARD":
        return showScoreCard(roomId);
      case "NEXT_QUESTION":
        return nextSlide(roomId, nextQuestion, amountOfQuestions);
      default:
        return [];
    }
  };
  return useMutation(
    ["next-slide", roomId, currentQuestion, nextQuestion, amountOfQuestions],
    fetcher
  );
};

export default useUpdateNext;

const nextSlide = async (
  roomId: string,
  nextQuestion: number,
  amountOfQuestions?: string | number
) => {
  const roomRef = doc(firestoreDB, "rooms", roomId);
  const isEndGame = nextQuestion > Number(amountOfQuestions) - 1;
  if (!isEndGame) {
    const docResponse = await updateDoc(roomRef, {
      currentQuestion: nextQuestion,
      isShowingScoreCard: false,
    });
    return docResponse;
  }
  if (isEndGame) {
    const docResponse = await updateDoc(roomRef, {
      isEnded: true,
      isShowingScoreCard: false,
      isStarted: false,
    });
    return docResponse;
  }
};

const showScoreCard = async (roomId: string) => {
  const roomRef = doc(firestoreDB, "rooms", roomId);
  const docResponse = await updateDoc(roomRef, {
    isShowingScoreCard: true,
  });
  return docResponse;
};

const startGame = async (roomId: string) => {
  const roomRef = doc(firestoreDB, "rooms", roomId);
  const docResponse = await updateDoc(roomRef, {
    isStarted: true,
  });
  return docResponse;
};

const restartGame = async (roomId: string) => {
  const roomRef = doc(firestoreDB, "rooms", roomId);
  const docResponse = await updateDoc(roomRef, {
    isStarted: false,
    currentQuestion: 0,
    isShowingScoreCard: false,
    isEnded: false,
  });
  return docResponse;
};
