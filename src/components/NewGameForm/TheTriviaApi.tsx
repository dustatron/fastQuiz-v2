import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useGetRandomWords from "../../apiCalls/useGetRandomWords";
import useGetTheTriviaApi from "../../apiCalls/useGetTheTriviaApi";
import {
  DifficultyValues,
  QuestionTypeValues,
  RoomData,
  theTriviaApiCategoriesValues,
  theTriviaApiQueryValues,
  theTriviaApiTags,
} from "../../utils/types";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  Stack,
  Heading,
} from "@chakra-ui/react";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { getCategoryOptions } from "../../utils/helper";

type Props = { roomData?: RoomData };

function TheTriviaApi({ roomData }: Props) {
  const [optionsPayload, setOptionsPayload] =
    useState<theTriviaApiQueryValues>();
  const { data, isLoading, refetch } = useGetTheTriviaApi({
    optionsPayload,
    roomName: optionsPayload?.roomName,
    roomId: roomData?.roomId,
  });
  const {
    data: randomWords,
    refetch: getRandomName,
    isLoading: isRandomQuestionLoading,
  } = useGetRandomWords();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      limit: "5",
      roomName: "",
      isPublic: true,
      categories: [],
      type: undefined,
      difficulty: undefined,
      tags: [],
    },
  });

  useEffect(() => {
    if (roomData?.roomName) {
      setValue("roomName", roomData.roomName);
      setValue("limit", String(roomData.triviaQuestions.length));
    }
  }, [roomData, setValue]);

  useEffect(() => {
    if (optionsPayload) {
      refetch();
    }
  }, [optionsPayload, refetch]);

  useEffect(() => {
    if (randomWords) {
      setValue("roomName", randomWords);
    }
  }, [randomWords, setValue]);

  const onSubmit = (e: any) => {
    setOptionsPayload({ ...e, isPublic: true });
  };
  const animatedComponents = makeAnimated();
  const tagOptions = theTriviaApiTags.map((item) => ({
    value: item,
    label: item,
  }));

  const categoryOptions = getCategoryOptions(theTriviaApiCategoriesValues);
  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <Heading textAlign="center" size="md" marginBlock="3">
          Using The Trivia API
        </Heading>
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

          <FormControl>
            <FormLabel>Total amount of questions</FormLabel>
            <Input type="number" {...register("limit")} />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Controller
              control={control}
              name="categories"
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
            <FormLabel>Tags</FormLabel>
            <Controller
              control={control}
              name="tags"
              render={({ field: { onChange, value } }) => (
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={tagOptions}
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
          <Button type="submit" colorScheme="facebook">
            Build Trivia Game
          </Button>
        </Stack>
      </form>
      <Box>
        <>
          {isLoading && <div>...loading</div>}
          {data && data.length > 0 && <Box> Sending you to your game </Box>}
        </>
      </Box>
    </>
  );
}

export default TheTriviaApi;
