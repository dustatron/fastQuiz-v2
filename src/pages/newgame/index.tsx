import type { NextPage } from "next";
import { FormEvent, FormEventHandler, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Container,
  Select as ChakraSelect,
  Stack,
  Switch,
} from "@chakra-ui/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import useGetOpenTBD from "../../apiCalls/useGetOpenTDB";
import {
  CategoryValues,
  DifficultyValues,
  Difficulty,
  QuestionType,
  QuestionTypeValues,
  MultiSelectOption,
} from "../../utils/types";
import { v4 } from "uuid";
import { cleanAsciiString } from "../../utils/helper";

const MakeNewGame: NextPage = () => {
  const animatedComponents = makeAnimated();
  const [gameName, setGameName] = useState<string>();
  const [isPublic, setIsPublic] = useState(false);
  const [amount, setAmount] = useState<string>("5");
  const [category, setCategory] = useState<MultiSelectOption[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>();
  const [type, setType] = useState<QuestionType>();
  const { data, isLoading, refetch } = useGetOpenTBD({
    amount,
    category,
    difficulty,
    type,
  });

  const getCategoryOptions = (options: { [key: string]: string }) => {
    return Object.entries(options).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  };
  const categoryOptions = getCategoryOptions(CategoryValues);
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
              <FormLabel>Game Name</FormLabel>
              <Input
                type="text"
                placeholder="name your game"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Public Game</FormLabel>
              <Switch
                size="md"
                isChecked={isPublic}
                onChange={() => {
                  setIsPublic(!isPublic);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Amount of questions per category</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                isMulti
                placeholder="Any"
                components={animatedComponents}
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e as MultiSelectOption[])}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Difficulty</FormLabel>
              <ChakraSelect
                placeholder="Any"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                {Object.entries(DifficultyValues).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <ChakraSelect
                value={type}
                placeholder="Any"
                onChange={(e) => setType(e.target.value as QuestionType)}
              >
                {Object.entries(QuestionTypeValues).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <Button type="submit">Build Trivia Game</Button>
          </Stack>
        </form>
      </Container>
      {isLoading && <div>...loading</div>}
      {data && (
        <div>
          {data && <div>{data.length}</div>}
          {data?.map((item) => (
            <div key={v4()}>{cleanAsciiString(item.question)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakeNewGame;
