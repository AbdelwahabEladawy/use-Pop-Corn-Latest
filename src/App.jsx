import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import useMovies from "./useMovies";
import useLocalStorage from "./useLocalStorage";
import useKey from "./useKey";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "8fc99c78";

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   const stored = localStorage.getItem("watched");
  //   return JSON.parse(stored);
  // });

  // const [watched, setWatched] = useLocalStorage([], "watched");

  const [watched, setWatched] = useLocalStorage([], "watched");

  function handelSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(Movie) {
    setWatched((watched) => [...watched, Movie]);
  }
  function handleDeleteWatchedMovie(id) {
    setWatched(watched.filter((Movie) => Movie.imdbID !== id));
    // localStorage.removeItem()
  }
  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  const { movies, IsLoading, error } = useMovies(query, handleCloseMovie);
  return (
    <>
    <div className="container">
        <Navbar>
          <Logo></Logo>
          <Search query={query} setQuery={setQuery}></Search>
          <NumResult movies={movies}></NumResult>
        </Navbar>
        <Main>
          <Box movies={movies}>
            {!IsLoading && !error && (
              <MovieList
                movies={movies}
                handelSelectedMovie={handelSelectedMovie}
              ></MovieList>
            )}
            {IsLoading && <Loader></Loader>}
            {error && <ErrorMsg message={error}></ErrorMsg>}
          </Box>
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                handleCloseMovie={handleCloseMovie}
                handleAddWatched={handleAddWatched}
                watched={watched}
                handleDeleteWatchedMovie={handleDeleteWatchedMovie}
              ></MovieDetails>
            ) : (
              <>
                <Summary watched={watched}></Summary>
                <WatchedMovieList
                  watched={watched}
                  handleDeleteWatchedMovie={handleDeleteWatchedMovie}
                ></WatchedMovieList>
              </>
            )}
          </Box>
        </Main>
    </div>
      </> 
  );
}

function Loader() {
  return <p className="loader"> Loading ...</p>;
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function ErrorMsg({ message }) {
  return (
    <p className="error">
      {" "}
      <span>🛑</span>
      {message}
    </p>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEle = useRef(null);
  useKey(function () {
    if (document.activeElement === inputEle.current) return;
    inputEle.current.focus();
    setQuery("");
  }, "enter");

  useEffect(() => {
    function CallBack(e) {
      if (document.activeElement === inputEle.current) return;

      if (e.code === "Enter") {
        inputEle.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", CallBack);
    return () => document.addEventListener("keydown", CallBack);
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search movies..."
      ref={inputEle}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handelSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          handelSelectedMovie={handelSelectedMovie}
          key={movie.imdbID}
        ></Movie>
      ))}
    </ul>
  );
}

function Movie({ movie, handelSelectedMovie }) {
  return (
    <li onClick={() => handelSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetails({
  selectedId,
  handleCloseMovie,
  handleAddWatched,
  watched,
}) {
  const [Movie, setMovie] = useState({});
  const [IsLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRate = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const [AvgRating, setAvgRating] = useState(0);
  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) {
      countRef.current++;
    }
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Released: released,
    Genre: genre,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Actors: actors,
    Director: director,
  } = Movie;

  // is top is a derived state
  const IsTop = imdbRating > 8;
  // console.log(IsTop);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRating: countRef.current,
    };
    handleAddWatched(newWatchedMovie);
    // handleCloseMovie();
    setAvgRating(Number(imdbRating));
    // here without the (imdbRating) in the callback you will find imdbRating = zero that because its sync
    // it is mean imdbRating is a stale state so that we use callback to update it's value

    setAvgRating((imdbRating) => (imdbRating + userRating) / 2);
  }

  useKey(handleCloseMovie, "escape");
  // useEffect(() => {
  //   function CallBack(e) {
  //     if (e.code === "Escape") {
  //       handleCloseMovie();
  //     }
  //   }
  //   document.addEventListener("keydown", CallBack);
  //   return function () {
  //     document.removeEventListener("keydown", CallBack);
  //   };
  // }, [handleCloseMovie]);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
    }
    getMovieDetails();
    setIsLoading(false);
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `movie | ${title}`;

    return () => {
      document.title = "🍿UsePopCorn";
    };
  }, [title]);

  return (
    <div className="details">
      {IsLoading ? (
        <Loader></Loader>
      ) : (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of the movie ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            {!iswatched ? (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={24}
                  onMovieRating={setUserRating}
                ></StarRating>
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add To List
                  </button>
                )}
              </div>
            ) : (
              <p style={{ color: "yellow", fontWeight: "bolder" }}>
                You Rated This Movies Before with ({watchedUserRate}
                <span>⭐</span>)
              </p>
            )}
            <p> The New Average Of Rating Will Be {AvgRating} </p>
            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  )?.toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  )?.toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime?.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, handleDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieElement
          handleDeleteWatchedMovie={handleDeleteWatchedMovie}
          key={movie.imdbID}
          movie={movie}
        ></WatchedMovieElement>
      ))}
    </ul>
  );
}

function WatchedMovieElement({ movie, handleDeleteWatchedMovie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime?.toFixed(0)} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => handleDeleteWatchedMovie(movie.imdbID)}
      >
        X
      </button>
    </li>
  );
}

<p></p>;
