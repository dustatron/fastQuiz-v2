import React from "react";
import { useQueries, useQuery } from "react-query";

function useGetRandomWords() {
  const fetcher = async () => {
    const response = await fetch(
      "https://random-word-api.herokuapp.com/word?number=1"
    );
    const result = await response.json();
    return result.join(" ");
  };
  return useQuery(["random-word"], fetcher, { enabled: false });
}

export default useGetRandomWords;
