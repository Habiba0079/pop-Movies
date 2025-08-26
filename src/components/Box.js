export default function Box1({ setIsOpen1, isOpen1, movies }) {
  return (
    <div className="box">
      <ToggleButton isOpen={isOpen1} setIsOpen={setIsOpen1} />
      {isOpen1 && (
        <ul className="list">
          {movies?.map((movie) => (
            <ListItem key={movie.imdbID} movie={movie} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ToggleButton({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((Open) => !Open)}>
      {isOpen ? "–" : "+"}
    </button>
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
