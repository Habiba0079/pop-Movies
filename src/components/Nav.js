import { useEffect, useRef, useState } from "react";
import { useKey } from "../useKey";

export function Nav({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🎬</span>
      <h1>PopMovies</h1>
    </div>
  );
}

export function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey(
    "Enter",
    function () {
      if (inputEl.current === document.activeElement) return;
      inputEl.current.focus();
      setQuery("");
    }
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export function NumOfResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
