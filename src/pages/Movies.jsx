import { useDeferredValue, useMemo, useState } from "react";
import MovieFilter from "../components/movie/MovieFilter";
import MovieGrid from "../components/movie/MovieGrid";
import useMovies from "../hooks/useMovies";
import filterMovies from "../utils/filterMovies";

export default function Movies() {
  const { movies } = useMovies();
  const params = new URLSearchParams(window.location.search);
  const [filters, setFilters] = useState({ search: params.get("search") || "", genre: params.get("genre") || "", sort: "rating" });
  const deferredSearch = useDeferredValue(filters.search);
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [filters, deferredSearch],
  );
  const filtered = useMemo(() => filterMovies(movies, effectiveFilters), [movies, effectiveFilters]);
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">The collection</span><h1>Find your<br />next story.</h1><p>From quiet character studies to journeys across impossible worlds—explore films selected for their craft and staying power.</p></header>
    <MovieFilter filters={filters} setFilters={setFilters} resultCount={filtered.length} />
    <section className="movie-grid"><MovieGrid movies={filtered} /></section>
  </div></main>;
}
