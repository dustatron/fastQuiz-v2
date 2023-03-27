import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Container,
  Select as ChakraSelect,
  Stack,
  Center,
} from "@chakra-ui/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import useGetOpenTBD, { GetQueryProps } from "../../apiCalls/useGetOpenTDB";
import {
  CategoryValues,
  DifficultyValues,
  QuestionTypeValues,
} from "../../utils/types";
import { Controller, useForm } from "react-hook-form";
import useGetRandomWords from "../../apiCalls/useGetRandomWords";

const MakeNewGame = () => {
  const defaultValues = {
    amount: "5",
    roomName: "",
    isPublic: true,
    category: undefined,
    type: undefined,
    difficulty: undefined,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues,
  });

  const animatedComponents = makeAnimated();
  const [quizPayload, setQuizPayload] = useState<GetQueryProps>(defaultValues);

  const { data: randomWords, refetch: getRandomName } = useGetRandomWords();

  const { data, isLoading, refetch } = useGetOpenTBD({
    amount: quizPayload?.amount,
    category: quizPayload?.category,
    difficulty: quizPayload?.difficulty,
    type: quizPayload?.type,
    roomName: quizPayload?.roomName,
  });

  const getCategoryOptions = (options: { [key: string]: string }) => {
    return Object.entries(options).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  };
  const categoryOptions = getCategoryOptions(CategoryValues);
  useEffect(() => {
    if (quizPayload) {
      refetch();
    }
  }, [quizPayload, refetch]);

  useEffect(() => {
    if (randomWords) {
      setValue("roomName", randomWords);
    }
  }, [randomWords, setValue]);

  const onSubmit = (e: any) => {
    setQuizPayload({ ...e, isPublic: true });
  };

  return (
    <div>
      <Container p="5">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Game Name</FormLabel>
              <Stack direction="row">
                <Input type="text" isRequired {...register("roomName")} />
                <Button m="4" onClick={() => getRandomName()}>
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
      </Container>
      <Container>
        {isLoading && <div>...loading</div>}
        {data && data.length > 0 && <Box> Sending you to your game </Box>}
      </Container>
    </div>
  );
};

export default MakeNewGame;
