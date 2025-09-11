import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loading } from "../App";

const KEY = "7035c60c";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  handleWatchMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const movieIsWatched = watched.some((m) => m.imdbId === selectedId);

  // Get the existing rating if movie is already watched
  const existingMovie = watched.find((m) => m.imdbId === selectedId);
  const existingRating = existingMovie?.userRating || "";

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
    // Reset user rating when selectedId changes
    setUserRating("");

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
  }, [selectedId]); // This effect runs when selectedId changes

  useEffect(() => {
    if (title) document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

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
              {movieIsWatched ? (
                <p>You rated this movie {existingRating} ⭐</p>
              ) : (
                <StarRating
                  key={selectedId} // This forces StarRating to reset when movie changes
                  maxRating={10}
                  size={24}
                  onRate={setUserRating}
                />
              )}
              {userRating && !movieIsWatched && (
                <button className="btn-add" onClick={() => handleAdd()}>
                  + Add to list
                </button>
              )}
              {movieIsWatched && <p>✔ Already in your watched list</p>}
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
