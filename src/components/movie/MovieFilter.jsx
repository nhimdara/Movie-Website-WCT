import { genres } from "../../data/movie";
import useLanguage from "../../hooks/useLanguage";

export default function MovieFilter({ filters, setFilters, resultCount }) {
  const { t } = useLanguage();
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  return <div className="filters">
    <div className="filter-search"><span aria-hidden="true">⌕</span><input aria-label={t("searchMovies", "Search films")} value={filters.search} onChange={update("search")} placeholder={`${t("searchMovies", "Search films")}…`} /></div>
    <select aria-label={t("genre", "Genre")} value={filters.genre} onChange={update("genre")}><option value="">{t("allGenres", "All genres")}</option>{genres.map((genre) => <option key={genre}>{genre}</option>)}</select>
    <select aria-label="Sort" value={filters.sort} onChange={update("sort")}><option value="rating">{t("topRated", "Top rated")}</option><option value="newest">{t("newest", "Newest")}</option><option value="title">A–Z</option></select>
    <span className="result-count">{resultCount} {t("films", resultCount === 1 ? "film" : "films")}</span>
  </div>;
}
