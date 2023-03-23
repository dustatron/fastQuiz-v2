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
  category?: MultiSelectOption[];
  difficulty?: Difficulty;
  type?: QuestionType;
};

type GetQueryProps = {
  amount?: string;
  category?: MultiSelectOption;
  difficulty?: Difficulty;
  type?: QuestionType;
};

function useGetOpenTBD({
  amount,
  category,
  difficulty,
  type,
}: GetOpenTBDProps) {
  const fetchMany = async () => {
    if (!category) {
      return [];
    }
    if (category?.length === 0 || category[0].value === "Any") {
      const response = await fetcher(
        amount,
        { value: "", label: "" },
        difficulty,
        type
      );
      return response.results;
    }

    let results: QuestionResponse[] = [];
    for (let catItem in category) {
      const questions = await fetcher(
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
    }
  );
}

export default useGetOpenTBD;

const fetcher = async (
  amnt?: string,
  cat?: MultiSelectOption,
  diff?: Difficulty,
  typ?: QuestionType
) => {
  const response = await fetch(
    `https://opentdb.com/api.php?${getQuery({
      amount: amnt,
      category: cat,
      difficulty: diff,
      type: typ,
    })}`
  );
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
  if (difficulty && difficulty !== "any") {
    query.push(`difficulty=${difficulty}`);
  }
  if (type && type !== "any") {
    query.push(`type=${type}`);
  }
  return query.join("&");
};
