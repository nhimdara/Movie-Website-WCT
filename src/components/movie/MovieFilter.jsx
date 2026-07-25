import { genres } from "../../data/movies";

export default function MovieFilter({ filters, setFilters, resultCount }) {
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  return <div className="filters">
    <div className="filter-search"><span aria-hidden="true">⌕</span><input aria-label="Search films" value={filters.search} onChange={update("search")} placeholder="Search films…" /></div>
    <select aria-label="Genre" value={filters.genre} onChange={update("genre")}><option value="">All genres</option>{genres.map((genre) => <option key={genre}>{genre}</option>)}</select>
    <select aria-label="Sort" value={filters.sort} onChange={update("sort")}><option value="rating">Top rated</option><option value="newest">Newest</option><option value="title">A–Z</option></select>
    <span className="result-count">{resultCount} {resultCount === 1 ? "film" : "films"}</span>
  </div>;
}
