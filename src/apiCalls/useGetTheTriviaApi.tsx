import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { useAlertStore } from "../components/AlertCenter/AlertCenter";
import { firestoreDB } from "../utils/firebaseConfig";
import {
  QuestionResponse,
  theTriviaApiQueryValues,
  theTriviaApiResponse,
} from "../utils/types";

type Props = {
  optionsPayload?: theTriviaApiQueryValues;
  roomName?: string;
  roomId?: string;
};

function useGetTheTriviaApi({ optionsPayload, roomName, roomId }: Props) {
  const [addError, addSuccess, clearError] = useAlertStore((state) => [
    state.addError,
    state.addSuccess,
    state.clearError,
  ]);
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
    if (resultsFormatted.length === 0) {
      return addError("The api returned zero questions");
    }
    addSuccess(`Retrieved ${resultsFormatted.length} questions`);
    if (roomId && roomName) {
      updateFirebaseGame(resultsFormatted, router, roomId, roomName);
      return resultsFormatted;
    } else {
      makeFirebaseGame(resultsFormatted, router, roomName);
      return resultsFormatted;
    }
  };
  return useQuery(["trivia", optionsPayload], fetcher, { enabled: false });
}

export default useGetTheTriviaApi;

const getQueryString = (options?: theTriviaApiQueryValues): string => {
  console.log("options", options);
  const results = [];
  if (options?.limit) {
    results.push(`limit=${options.limit}`);
  }
  if (options?.tags && options.tags.length !== 0) {
    results.push(`tags=${options.tags.map((cat) => cat.value).join(",")}`);
  }
  if (options?.categories && options?.categories.length !== 0) {
    results.push(
      `categories=${options.categories.map((cat) => cat.value).join(",")}`
    );
  }
  if (options?.difficulty) {
    results.push(`difficulty=${options.difficulty}`);
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
const updateFirebaseGame = async (
  results: QuestionResponse[],
  router: NextRouter,
  roomId: string,
  roomName: string
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
    roomId: roomId,
  };

  const roomRef = doc(firestoreDB, "rooms", roomId);
  await updateDoc(roomRef, roomData)
    .then(() => {
      router.push(`/games/${roomId}`);
    })
    .catch((error) => {
      console.error(error);
    });
};
