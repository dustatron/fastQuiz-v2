import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useMutation } from "react-query";
import { useAlertStore } from "../components/AlertCenter/AlertCenter";
import { firestoreDB } from "../utils/firebaseConfig";

type Props = { onSettled: () => void };

function useDeleteGame({ onSettled }: Props) {
  const [addSuccessAlert, addErrorAlert] = useAlertStore((state) => [
    state.addSuccess,
    state.addError,
  ]);
  const fetcher = async (roomId?: string) => {
    if (!roomId) return null;
    const playersRef = collection(firestoreDB, `rooms/${roomId}/players`);
    const playersList = await getDocs(playersRef);

    // First delete players docs in sub collection
    for (let player in playersList) {
      await deleteDoc(
        // @ts-ignore
        doc(firestoreDB, `rooms/${roomId}/players/${playersList[player].id}`)
      );
    }

    // Then delete doc
    deleteDoc(doc(firestoreDB, `rooms/${roomId}`))
      .then(() => {
        addSuccessAlert("Game was deleted successfully");
      })
      .catch(() => {
        addErrorAlert("Could not delete game");
      });
  };
  return useMutation(["games"], fetcher, { onSettled });
}

export default useDeleteGame;
