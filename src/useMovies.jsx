import React, { useEffect, useState } from "react";
const KEY = "8fc99c78";

export default function useMovies(query,callback) {
  const [movies, setMovies] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    callback?.()
    const controller = new AbortController();

    async function getMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Something went wrong in fetching movies ");
        }
        const data = await res.json();
        if (data?.Response === "false") {
          throw new Error("No Movie Founded ");
        }

        setMovies(data.Search);
        setError(data.Error);

        setIsLoading(false);
      } catch (err) {
        if (err.message !== "AbortError") {
          // console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
        setError("");
      }
    }
    // handleCloseMovie();
    getMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, IsLoading, error };
}
