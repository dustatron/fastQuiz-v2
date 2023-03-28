import {
  Center,
  Container,
  Heading,
  Stack,
  Card,
  Button,
  Box,
  Badge,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useGetRoomsList from "../../apiCalls/useGetRoomsList";
import { firestoreDB } from "../../utils/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import useDeleteGame from "../../apiCalls/useDeleteGame";
import { RoomData } from "../../utils/types";

function GameListView() {
  const [selectedRoom, setSelectedRoom] = useState<RoomData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: roomsList, isLoading, refetch } = useGetRoomsList();

  const { mutate: deleteGame, isLoading: isDeleting } = useDeleteGame({
    onSettled: () => {
      refetch();
      onClose();
    },
  });
  const router = useRouter();

  const handelDeleteRoom = async (roomId?: string) => {
    deleteGame(roomId);
  };

  return (
    <>
      <Container mt="2">
        <Center>
          <Heading>{roomsList?.length} Games</Heading>
        </Center>
        <Stack spacing={3}>
          {roomsList?.length === 0 && (
            <Card p="3" textAlign="center" backgroundColor="orange.200">
              No Games, Start a new game
            </Card>
          )}
          {isLoading && <div>...loading rooms</div>}
          {roomsList?.map((room) => (
            <Card p="5" key={room.roomId}>
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Heading size="md" textTransform="capitalize">
                      {room.roomName}
                    </Heading>
                  </Box>
                  <Button
                    onClick={() => {
                      setSelectedRoom(room);
                      onOpen();
                    }}
                    isLoading={isDeleting}
                    variant="ghost"
                  >
                    🗑️
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack
                    direction="row"
                    borderTop="1px"
                    borderColor="gray.300"
                    w="100%"
                    paddingTop={2}
                  >
                    <Box>
                      <Badge
                        colorScheme={room.isStarted ? "red" : "green"}
                        p="1"
                        fontSize="0.8em"
                      >
                        {room.isStarted ? "Started" : "Ready"}
                      </Badge>
                    </Box>
                    <Box>{room.triviaQuestions.length} questions</Box>
                  </Stack>
                  <Button
                    onClick={() => router.push(`/games/${room.roomId}`)}
                    variant="ghost"
                  >
                    ➕
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {selectedRoom?.roomName}?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>You can not undo this action.</ModalBody>

          <ModalFooter justifyContent="space-between">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handelDeleteRoom(selectedRoom?.roomId)}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GameListView;
