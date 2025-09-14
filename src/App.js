import { useState } from "react";
import { Nav, Logo, Search, NumOfResults } from "./components/Nav";
import MoviesBox from "./components/moviesBox";
import { MoviesWatched, Summary } from "./components/moviesWatched";
import MovieDetails from "./components/MovieDetails";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorge";

//const KEY = "7035c60c";
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorage([], "watched");

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
