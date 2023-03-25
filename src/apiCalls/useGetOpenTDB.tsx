import { useQuery } from "react-query";
import {
  Category,
  QuestionType,
  Difficulty,
  OpenTDBResponse,
  MultiSelectOption,
  QuestionResponse,
} from "../utils/types";

type GetOpenTBDProps = {
  amount?: string;
  category?: MultiSelectOption[] | any;
  difficulty?: Difficulty;
  type?: QuestionType;
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
}: GetOpenTBDProps) {
  const fetchMany = async (data: any) => {
    console.log("from fetcher", data);
    if (!category) {
      const results = await fetchTrivia(
        amount,
        { value: "", label: "" },
        difficulty,
        type
      );
      return results.results;
    }
    if (category?.length === 0 || category[0].value === "Any") {
      const response = await fetchTrivia(
        amount,
        { value: "", label: "" },
        difficulty,
        type
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
    return results;
  };

  return useQuery<QuestionResponse[]>(
    ["quiz", amount, category, difficulty, type],
    fetchMany,
    {
      enabled: false,
      cacheTime: 0,
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
