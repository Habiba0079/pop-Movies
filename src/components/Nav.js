import { useEffect, useRef, useState } from "react";

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
  useEffect(() => {
    function callBack(e) {
      if (inputEl.current === document.activeElement) return;
      if (e.key === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", callBack);
    return () => document.addEventListener("keydown", callBack);
  }, [setQuery]);

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
