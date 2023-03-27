import { useRouter } from "next/router";
import React from "react";
import NewGameForm from "../../components/NewGameForm";

function UpdateGame() {
  const router = useRouter();
  const { id } = router.query;
  if (id) {
    return <NewGameForm roomId={id as string} />;
  } else {
    return null;
  }
}

export default UpdateGame;
