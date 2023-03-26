import {
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import React, { Children, ReactNode } from "react";

type Props = {
  name?: string;
  setName: (name: string) => void;
  handleJoinGame: () => void;
  handleStart: () => void;
  hasJoined: boolean;
  isLoadingJoin: boolean;
  isStarted?: boolean;
  hasPlayers: boolean;
  children?: ReactNode;
};

const JoinGame = ({
  name,
  setName,
  handleJoinGame,
  hasJoined,
  isLoadingJoin,
  handleStart,
  isStarted,
  hasPlayers,
  children,
}: Props) => {
  return (
    <Stack p="5">
      <Center p="5">
        <Heading size="sm">Join Game</Heading>
      </Center>
      <Stack>
        <Flex justify="space-between">
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={"text"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="md"
                onClick={handleJoinGame}
                colorScheme="blue"
                isDisabled={!name || hasJoined}
                isLoading={isLoadingJoin}
              >
                Join
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Button
          onClick={handleStart}
          colorScheme={!isStarted ? "green" : "blue"}
          isDisabled={!hasPlayers}
        >
          {!isStarted ? "Start Game" : "restart"}
        </Button>
      </Stack>
      {children}
    </Stack>
  );
};

export default JoinGame;
