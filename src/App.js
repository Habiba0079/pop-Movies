import { use, useEffect, useState } from "react";
import { Nav, Logo, Search, NumOfResults } from "./components/Nav";
import MoviesBox from "./components/moviesBox";
import { MoviesWatched, Summary } from "./components/moviesWatched";
import StarRating from "./components/StarRating";

const KEY = "7035c60c";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("Avengers");
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
    const filtered = watched.filter((m) => m.imdbID !== id);
    setWatched(filtered);
  }

  useEffect(() => {
    async function getMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        //console.log(data.Search);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    getMovies();
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
function Loading() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function MovieDetails({ selectedId, onCloseMovie, handleWatchMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);  
  const [userRating, setUserRating] = useState('');
  const movieIsWatched = watched.some((m) => m.imdbId === selectedId);
  const {
    Title: title,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    imdbRating: imdbRating,
    Released: released,
    Director: director,
    Actors: actors,
    Genre: genre,
    Year: year,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
    };
    handleWatchMovie(newWatchedMovie);
  }

  useEffect(() => {
    setIsLoading(true);
    async function fetchMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      console.log(data);
      setMovie(data);
    }
    fetchMovieDetails();
    setIsLoading(false);
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              {"<"}
            </button>

            <img src={poster} alt={`Poster of ${title}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} onRate ={setUserRating} />
              {userRating && <button
                className="btn-add"
                onClick={() => handleAdd()}
                disabled={movieIsWatched}
              >
                {movieIsWatched ? "✔ Added to list" : "+ Add to list"}
              </button>}
            </div>
            <p>
              <em> {plot} </em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
