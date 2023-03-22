import type { NextPage } from "next";
import { FormEvent, FormEventHandler, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Container,
  Select,
  Stack,
} from "@chakra-ui/react";
import useGetOpenTBD from "../apiCalls/useGetOpenTDB";
import {
  CategoryValues,
  Category,
  DifficultyValues,
  Difficulty,
  QuestionType,
  QuestionTypeValues,
} from "../utils/types";
import { v4 } from "uuid";
import { cleanAsciiString } from "../utils/helper";

const Home: NextPage = () => {
  const [amount, setAmount] = useState<string>("5");
  const [category, setCategory] = useState<Category>("any");
  const [difficulty, setDifficulty] = useState<Difficulty>("any");
  const [type, setType] = useState<QuestionType>("any");
  const { data, isLoading, refetch } = useGetOpenTBD({
    amount,
    category,
    difficulty,
    type,
  });
  console.log("data", data);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };
  return (
    <div>
      <Container p="5">
        <form action="" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>category</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                defaultValue={"any"}
              >
                {Object.entries(CategoryValues).map(([key, value]) => (
                  <option key={key} value={key}>
                    {`${value}`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>difficulty</FormLabel>
              <Select
                placeholder="Select Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                {Object.entries(DifficultyValues).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>type</FormLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
              >
                {Object.entries(QuestionTypeValues).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Button type="submit">Get Question</Button>
          </Stack>
        </form>
      </Container>
      {isLoading && <div>...loading</div>}
      {data && (
        <div>
          {data.results.map((item) => (
            <div key={v4()}>{cleanAsciiString(item.question)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
