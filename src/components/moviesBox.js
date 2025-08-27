export default function MoviesBox({ movies }) {
  return (
    <div className="box">
      <ul className="list">
        {movies?.map((movie) => (
          <ListItem key={movie.imdbID} movie={movie} />
        ))}
      </ul>
    </div>
  );
}

function ListItem({ movie }) {
  return (
    <li key={movie.imdbID}>
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
