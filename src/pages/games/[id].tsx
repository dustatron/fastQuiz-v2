import React from "react";
import { useRouter } from "next/router";
import GamePlay from "../../components/GamePlay";

function RoomDetail(props: any) {
  const router = useRouter();
  const { id } = router.query;

  return <>{id && <GamePlay roomId={id as string} />}</>;
}

export default RoomDetail;
