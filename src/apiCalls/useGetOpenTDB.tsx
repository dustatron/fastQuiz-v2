import { addDoc, collection } from "firebase/firestore";
import { NextRouter, useRouter } from "next/router";
import { useQuery } from "react-query";
import { firestoreDB } from "../utils/firebaseConfig";
import {
  QuestionType,
  Difficulty,
  MultiSelectOption,
  QuestionResponse,
  RoomData,
} from "../utils/types";

type GetOpenTBDProps = {
  amount?: string;
  category?: MultiSelectOption[] | any;
  difficulty?: Difficulty;
  type?: QuestionType;
  roomName?: string;
};

export type GetQueryProps = {
  amount?: string;
  category?: MultiSelectOption;
  difficulty?: Difficulty;
  type?: QuestionType;
  roomName?: string;
  isPublic?: boolean;
};

function useGetOpenTBD({
  amount,
  category,
  difficulty,
  type,
  roomName,
}: GetOpenTBDProps) {
  const router = useRouter();

  const fetchMany = async (data: any) => {
    console.log("from fetcher", data);
    if (!roomName) {
      return [];
    }
    if (!category) {
      const response = await fetchTrivia(
        amount,
        { value: "", label: "" },
        difficulty,
        type
      );
      makeFirebaseGame(
        {
          currentQuestion: 0,
          isEnded: false,
          isPublic: true,
          isStarted: false,
          roomName,
          triviaQuestions: response.results,
          isShowingScoreCard: false,
        },
        router
      );
      return response.results;
    }
    if (category?.length === 0 || category[0].value === "Any") {
      const response = await fetchTrivia(
        amount,
        { value: "", label: "" },
        difficulty,
        type
      );
      makeFirebaseGame(
        {
          currentQuestion: 0,
          isEnded: false,
          isPublic: true,
          isStarted: false,
          roomName,
          triviaQuestions: response.results,
          isShowingScoreCard: false,
        },
        router
      );
      return response.results;
    }

    let results: QuestionResponse[] = [];
    for (let catItem in category) {
      const questions = await fetchTrivia(
        amount,
        category[catItem],
        difficulty,
        type
      );
      results = [...results, ...questions.results];
    }
    makeFirebaseGame(
      {
        currentQuestion: 0,
        isEnded: false,
        isPublic: true,
        isStarted: false,
        roomName,
        triviaQuestions: results,
        isShowingScoreCard: false,
      },
      router
    );
    return results;
  };

  return useQuery<QuestionResponse[]>(
    ["quiz", amount, category, difficulty, type],
    fetchMany,
    {
      enabled: false,
      // cacheTime: 0,
    }
  );
}

export default useGetOpenTBD;

const fetchTrivia = async (
  amnt?: string,
  cat?: MultiSelectOption,
  diff?: Difficulty,
  typ?: QuestionType
) => {
  const queryString = getQuery({
    amount: amnt,
    category: cat,
    difficulty: diff,
    type: typ,
  });
  const response = await fetch(`https://opentdb.com/api.php?${queryString}`);
  return await response.json();
};

const getQuery = ({ amount, category, difficulty, type }: GetQueryProps) => {
  let query = [];
  if (amount && amount !== "any") {
    query.push(`amount=${amount}`);
  }
  if (category && category.value !== "any") {
    query.push(`category=${category.value}`);
  }
  if (difficulty) {
    query.push(`difficulty=${difficulty}`);
  }
  if (type) {
    query.push(`type=${type}`);
  }
  return query.join("&");
};

const makeFirebaseGame = async (roomData: RoomData, router: NextRouter) => {
  const roomsRef = collection(firestoreDB, "rooms");
  addDoc(roomsRef, roomData)
    .then((docRef) => {
      console.log("doc", docRef);
      console.log("docID", docRef.id);
      router.push(`/games/${docRef.id}`);
    })
    .catch((error) => {
      console.error(error);
    });
};
