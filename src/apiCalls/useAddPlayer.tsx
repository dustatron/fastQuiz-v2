import { doc, setDoc } from "firebase/firestore";
import { useMutation, useQuery } from "react-query";
import useLocalStorage from "../hooks/useLocalStorage";
import { firestoreDB } from "../utils/firebaseConfig";
import { Player } from "../utils/types";
import { v4 } from "uuid";

type Props = {
  roomId: string;
  name: string;
  playerId: string;
};

function useAddPlayer({ roomId, name, playerId }: Props) {
  const [localState, setLocalState] = useLocalStorage(`fastQuiz-player`, {});

  const fetcher = async () => {
    const playerId = localState.id || v4();
    const newPlayer = {
      id: playerId,
      name: name || localState.name,
      score: 0,
      correctAnswers: [],
      answersList: [],
      lastAnswer: "",
    } as Player;

    await setDoc(
      doc(firestoreDB, `rooms/${roomId}/players`, playerId),
      newPlayer
    );
    setLocalState(newPlayer);
    return newPlayer;
  };
  return useMutation(["player", name, playerId], fetcher);
}

export default useAddPlayer;
