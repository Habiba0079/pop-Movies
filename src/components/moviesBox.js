export default function MoviesBox({ movies, handleSelectMovie }) {
  return (
    <div className="box">
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <ListItem
            key={movie.imdbID}
            movie={movie}
            handleSelectMovie={handleSelectMovie}
          />
        ))}
      </ul>
    </div>
  );
}

function ListItem({ movie, handleSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
