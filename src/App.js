import { use, useEffect, useState } from "react";
import { Nav, Logo, Search, NumOfResults } from "./components/Nav";
import MoviesBox from "./components/moviesBox";
import { MoviesWatched, Summary } from "./components/moviesWatched";
import MovieDetails from "./components/MovieDetails";

const KEY = "7035c60c";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // const tempQuery = "batman";

  function handleSelectMovie(id) {
    setSelectedId(selectedId === id ? null : id);
  }
  function onCloseMovie() {
    setSelectedId(null);
  }
  function handleWatchMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function onDeleteMovie(id) {
    const filtered = watched.filter((movie) => movie.imdbId !== id);
    setWatched(filtered);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function getMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
        //console.log(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    onCloseMovie();
    getMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumOfResults movies={movies} />
      </Nav>

      <main className="main">
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MoviesBox movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {!isLoading && error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              handleWatchMovie={handleWatchMovie}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <MoviesWatched watched={watched} onDeleteMovie={onDeleteMovie} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((Open) => !Open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
export function Loading() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
