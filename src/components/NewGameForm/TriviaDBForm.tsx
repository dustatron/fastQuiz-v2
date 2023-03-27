import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import useGetOpenTBD, { GetQueryProps } from "../../apiCalls/useGetOpenTDB";
import { Controller, useForm } from "react-hook-form";
import useGetRandomWords from "../../apiCalls/useGetRandomWords";
import {
  CategoryValues,
  DifficultyValues,
  QuestionTypeValues,
  RoomData,
} from "../../utils/types";

type Props = {
  roomData?: RoomData;
};

function TriviaDBForm({ roomData }: Props) {
  console.log("from form", roomData);
  const defaultValues = {
    amount: "5",
    roomName: roomData?.roomName,
    isPublic: true,
    category: undefined,
    type: undefined,
    difficulty: undefined,
  };
  const [quizPayload, setQuizPayload] = useState<GetQueryProps>(
    roomData || defaultValues
  );
  const animatedComponents = makeAnimated();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues,
  });

  const {
    data: randomWords,
    refetch: getRandomName,
    isLoading: isRandomQuestionLoading,
  } = useGetRandomWords();

  const { data, isLoading, refetch } = useGetOpenTBD({
    amount: quizPayload?.amount,
    category: quizPayload?.category,
    difficulty: quizPayload?.difficulty,
    type: quizPayload?.type,
    roomName: quizPayload?.roomName,
    roomId: roomData?.roomId,
  });
  const getCategoryOptions = (options: { [key: string]: string }) => {
    return Object.entries(options).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  };
  const categoryOptions = getCategoryOptions(CategoryValues);

  useEffect(() => {
    if (randomWords) {
      setValue("roomName", randomWords);
    }
  }, [randomWords]);

  useEffect(() => {
    if (quizPayload) {
      refetch();
    }
  }, [quizPayload, refetch]);

  const onSubmit = (e: any) => {
    setQuizPayload({ ...e, isPublic: true });
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Game Name</FormLabel>
            <Stack direction="row" spacing={3}>
              <Input
                type="text"
                isRequired
                {...register("roomName")}
                placeholder={
                  isRandomQuestionLoading ? "...retrieving random work" : ""
                }
              />
              <Button onClick={() => getRandomName()} px="5">
                Random
              </Button>
            </Stack>
          </FormControl>
          {/* // IS PUBLIC: probably remove this */}
          {/* <FormControl>
        <FormLabel>Public Game</FormLabel>
        <Controller
          control={control}
          name="isPublic"
          render={({ field: { onChange, value } }) => (
            <Switch
              size="md"
              isChecked={value}
              onChange={(val) => onChange(val)}
            />
          )}
        ></Controller>
      </FormControl> */}
          <FormControl>
            <FormLabel>Amount of questions per category</FormLabel>
            <Input type="number" {...register("amount")} />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={categoryOptions}
                  value={value}
                  onChange={(val) => onChange(val)}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Difficulty</FormLabel>
            <ChakraSelect placeholder="Any" {...register("difficulty")}>
              {Object.entries(DifficultyValues).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <ChakraSelect placeholder="Any" {...register("type")}>
              {Object.entries(QuestionTypeValues).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Build Trivia Game
          </Button>
        </Stack>
      </form>
      <Box>
        {isLoading && <div>...loading</div>}
        {data && data.length > 0 && <Box> Sending you to your game </Box>}
      </Box>
    </>
  );
}

export default TriviaDBForm;
