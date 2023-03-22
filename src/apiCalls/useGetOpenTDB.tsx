import { useQuery } from "react-query";
import {
  Category,
  QuestionType,
  Difficulty,
  OpenTDBResponse,
} from "../utils/types";

type Props = {
  amount?: string;
  category?: Category;
  difficulty?: Difficulty;
  type?: QuestionType;
};

function useGetOpenTBD({ amount, category, difficulty, type }: Props) {
  const fetcher = async () => {
    console.log("cat", category);
    const result = await fetch(
      `https://opentdb.com/api.php?amount=${amount}${
        category === "any" ? "" : `&category=${category}`
      }${difficulty === "any" ? "" : `&difficulty=${difficulty}`}${
        type === "any" ? "" : `&type=${type}`
      }`
    );
    return await result.json();
  };
  return useQuery<OpenTDBResponse>(
    ["quiz", amount, category, difficulty, type],
    fetcher,
    {
      enabled: false,
    }
  );
}

export default useGetOpenTBD;
