import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { NextRouter, useRouter } from "next/router";
import { useQuery } from "react-query";
import { useAlertStore } from "../components/AlertCenter/AlertCenter";
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
  roomId?: string;
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
  roomId,
}: GetOpenTBDProps) {
  const router = useRouter();
  const [addSuccessAlert, addErrorAlert] = useAlertStore((store) => [
    store.addSuccess,
    store.addError,
  ]);

  const fetchMany = async (data: any) => {
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
      addSuccessAlert(`Retrieved ${response.results.length} questions `);
      makeFirebaseGame({ results: response.results, roomName, router, roomId });
      return response.results;
    }
    if (category?.length === 0 || category[0].value === "Any") {
      const response = await fetchTrivia(
        amount,
        { value: "", label: "" },
        difficulty,
        type
      );
      addSuccessAlert(`Retrieved ${response.results.length} questions `);
      makeFirebaseGame({ results: response.results, roomName, router, roomId });
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
    addSuccessAlert(`Retrieved ${results.length} questions `);
    makeFirebaseGame({ results, roomName, router, roomId });
    return results;
  };

  return useQuery<QuestionResponse[]>(
    ["quiz", amount, category, difficulty, type, roomName],
    fetchMany,
    {
      enabled: false,
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

type MakeProps = {
  results: QuestionResponse[];
  router: NextRouter;
  roomName: string;
  roomId?: string;
};

const makeFirebaseGame = async ({
  roomName,
  roomId,
  results,
  router,
}: MakeProps) => {
  const roomData = {
    currentQuestion: 0,
    isEnded: false,
    isPublic: true,
    isStarted: false,
    roomName,
    triviaQuestions: results,
    isShowingScoreCard: false,
    ...(roomId && { roomId }),
  };
  if (roomId) {
    const roomRef = doc(firestoreDB, "rooms", roomId);
    await updateDoc(roomRef, roomData)
      .then(() => {
        router.push(`/games/${roomId}`);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    const roomsRef = collection(firestoreDB, "rooms");
    addDoc(roomsRef, roomData)
      .then((docRef) => {
        router.push(`/games/${docRef.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
