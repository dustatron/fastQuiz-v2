import { addDoc, collection } from "firebase/firestore";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { firestoreDB } from "../utils/firebaseConfig";
import {
  QuestionResponse,
  theTriviaApiQueryValues,
  theTriviaApiResponse,
} from "../utils/types";

type Props = {
  optionsPayload?: theTriviaApiQueryValues;
  roomName?: string;
};

function useGetTheTriviaApi({ optionsPayload, roomName }: Props) {
  const router = useRouter();

  const fetcher = async () => {
    const response = await fetch(
      `https://the-trivia-api.com/api/questions?${getQueryString(
        optionsPayload
      )}`
    );
    const results = (await response.json()) as theTriviaApiResponse[];
    const resultsFormatted: QuestionResponse[] = results.map((q) => ({
      category: q.category,
      correct_answer: q.correctAnswer,
      incorrect_answers: q.incorrectAnswers,
      difficulty: q.difficulty,
      question: q.question,
      type: q.type,
    }));

    makeFirebaseGame(resultsFormatted, router, roomName);
    return resultsFormatted;
  };
  return useQuery(["trivia", optionsPayload], fetcher, { enabled: false });
}

export default useGetTheTriviaApi;

const getQueryString = (options?: theTriviaApiQueryValues): string => {
  const results = [];
  if (options?.limit) {
    results.push(`limit=${options.limit}`);
  }
  if (options?.categories) {
    results.push(
      `categories=${options.categories.map((cat) => cat.value).join(",")}`
    );
  }
  if (options?.difficulty) {
    results.push(`difficulty=${options.difficulty}`);
  }
  if (options?.tags) {
    results.push(`categories=${options.tags.join(",")}`);
  }
  results.push("region=US");
  return results.join("&");
};

const makeFirebaseGame = async (
  results: QuestionResponse[],
  router: NextRouter,
  roomName?: string
) => {
  if (!roomName) return null;
  const roomData = {
    currentQuestion: 0,
    isEnded: false,
    isPublic: true,
    isStarted: false,
    roomName,
    triviaQuestions: results,
    isShowingScoreCard: false,
  };
  const roomsRef = collection(firestoreDB, "rooms");
  addDoc(roomsRef, roomData)
    .then((docRef) => {
      router.push(`/games/${docRef.id}`);
    })
    .catch((error) => {
      console.error(error);
    });
};
