import { createContext, useCallback, useMemo, useState } from "react";
import seedMovies, { createMovieRecord, MOVIE_STORE } from "../data/movies";
import useLocalStorage from "../hooks/useLocalStorage";

export const MovieContext = createContext(null);

const initialReviews = [
  { id: 1, movieId: 1, initials: "SK", author: "Sofia Kim", time: "12 min ago", movie: "Beyond the Horizon", rating: 5, copy: "A beautiful, patient piece of science fiction. The final act stayed with me.", status: "pending" },
  { id: 2, movieId: 2, initials: "JR", author: "James Rivera", time: "1 hour ago", movie: "Neon Abyss", rating: 4.5, copy: "Electric visuals and a brilliant lead performance. I wanted a little more from the ending.", status: "pending" },
  { id: 3, movieId: 5, initials: "AL", author: "Amelia Lee", time: "3 hours ago", movie: "The Last Signal", rating: 4.8, copy: "Quietly devastating. One of the strongest films in the catalogue.", status: "pending" },
];

export const defaultSiteSettings = {
  brandName: "CineVault",
  logo: "/images/branding/movie-logo.png",
  heroLabel: "CineVault Original",
  heroNote: "Featured this week",
  featuredMovieId: "",
  topRowTitle: "Top 10 on CineVault Today",
  trendingTitle: "Trending Now",
  newReleasesTitle: "New Releases",
  newsletterTitle: "Your next obsession is waiting.",
  newsletterCopy: "Get fresh releases and hand-picked recommendations sent to your inbox.",
  footerTagline: "Thoughtfully curated films for people who believe every great story deserves to be found.",
  contactEmail: "hello@cinevault.example",
  location: "Phnom Penh, Cambodia",
  aboutHeading: "Good films find you.",
  aboutCopy: "CineVault is a movie discovery experience created around a simple idea: choosing what to watch should feel inspiring.",
  contactHeading: "Let’s talk cinema.",
  contactCopy: "Questions, feedback or a film we should know about? Send us a note.",
  announcement: "",
  showGenres: true,
  showContinueWatching: true,
  showTopRow: true,
  showTrending: true,
  showNewReleases: true,
  showGenreRows: true,
  showNewsletter: true,
};

export function MovieProvider({ children }) {
  const [storedMovies, setStoredMovies] = useLocalStorage(MOVIE_STORE.key, seedMovies);
  const [favourites, setFavourites] = useLocalStorage("cinevault-favourites", []);
  const [watchlist, setWatchlist] = useLocalStorage("cinevault-watchlist", []);
  const [reviews, setReviews] = useLocalStorage("cinevault-reviews", initialReviews);
  const [subscribers, setSubscribers] = useLocalStorage("cinevault-subscribers", []);
  const [messages, setMessages] = useLocalStorage("cinevault-messages", []);
  const [preferences, setPreferences] = useLocalStorage("cinevault-preferences", { reports: true, reviews: true, publish: false });
  const [viewHistory, setViewHistory] = useLocalStorage("cinevault-view-history", []);
  const [storedSiteSettings, setStoredSiteSettings] = useLocalStorage("cinevault-site-settings", defaultSiteSettings);
  const [trailer, setTrailer] = useState(null);
  const [toast, setToast] = useState("");
  const allMovies = useMemo(() => storedMovies.map((movie) => {
    const seedMovie = seedMovies.find(seed => Number(seed.id) === Number(movie.id));
    return createMovieRecord({
      ...seedMovie,
      ...movie,
      trailerUrl: movie.trailerUrl || seedMovie?.trailerUrl || "",
      videoUrl: movie.videoUrl || seedMovie?.videoUrl || "",
    });
  }), [storedMovies]);
  const movies = useMemo(() => allMovies.filter(movie => movie.status === "published"), [allMovies]);
  const siteSettings = useMemo(() => ({
    ...defaultSiteSettings,
    ...storedSiteSettings,
    // Keep the new project logo visible for browsers that saved the old empty default.
    logo: storedSiteSettings.logo || defaultSiteSettings.logo,
  }), [storedSiteSettings]);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.cinevaultToastTimer);
    window.cinevaultToastTimer = window.setTimeout(() => setToast(""), 2300);
  }, []);

  const toggleList = useCallback((id, list, setList, label) => {
    const exists = list.includes(id);
    setList(exists ? list.filter((item) => item !== id) : [...list, id]);
    notify(exists ? `Removed from ${label}` : `Added to ${label}`);
  }, [notify]);

  const addMovie = useCallback((details) => {
    const nextId = Math.max(0, ...storedMovies.map(movie => Number(movie.id) || 0)) + 1;
    const movie = createMovieRecord({ ...details, id: nextId, createdAt: new Date().toISOString() });
    setStoredMovies(current => [movie, ...current]);
    notify(`${movie.title} added to the catalogue.`);
    return movie;
  }, [storedMovies, setStoredMovies, notify]);

  const updateMovie = useCallback((id, details) => {
    setStoredMovies(current => current.map(movie =>
      Number(movie.id) === Number(id) ? createMovieRecord({ ...movie, ...details, id: Number(id), updatedAt: new Date().toISOString() }) : movie
    ));
    notify("Movie details updated.");
  }, [setStoredMovies, notify]);

  const deleteMovie = useCallback((id) => {
    setStoredMovies(current => current.filter(movie => Number(movie.id) !== Number(id)));
    setFavourites(current => current.filter(item => Number(item) !== Number(id)));
    setWatchlist(current => current.filter(item => Number(item) !== Number(id)));
    notify("Movie deleted from the catalogue.");
  }, [setStoredMovies, setFavourites, setWatchlist, notify]);

  const deleteAllMovies = useCallback(() => {
    setStoredMovies([]);
    setFavourites([]);
    setWatchlist([]);
    notify("All movies were removed.");
  }, [setStoredMovies, setFavourites, setWatchlist, notify]);

  const restoreSeedMovies = useCallback(() => {
    setStoredMovies(seedMovies);
    notify("Seed catalogue restored.");
  }, [setStoredMovies, notify]);

  const importMovies = useCallback((records) => {
    if (!Array.isArray(records)) throw new Error("The imported file must contain an array of movies.");
    const normalized = records.map((movie, index) => createMovieRecord({ ...movie, id: Number(movie.id) || index + 1 }));
    if (normalized.some(movie => !movie.title || !movie.genre)) throw new Error("Every movie needs a title and genre.");
    setStoredMovies(normalized);
    notify(`${normalized.length} movies imported.`);
  }, [setStoredMovies, notify]);

  const addReview = useCallback((details) => {
    const review = {
      id: Date.now(),
      movieId: Number(details.movieId),
      movie: details.movie,
      author: details.author.trim(),
      initials: details.author.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase(),
      rating: Number(details.rating),
      copy: details.copy.trim(),
      time: "Just now",
      status: "pending",
    };
    setReviews(current => [review, ...current]);
    notify("Review submitted for moderation.");
    return review;
  }, [setReviews, notify]);

  const moderateReview = useCallback((id, status) => {
    setReviews(current => current.map(review => review.id === id ? { ...review, status } : review));
    notify(status === "approved" ? "Review approved." : "Review hidden.");
  }, [setReviews, notify]);

  const subscribe = useCallback((emailValue) => {
    const email = emailValue.trim().toLowerCase();
    if (subscribers.includes(email)) return { ok: false, message: "This email is already subscribed." };
    setSubscribers(current => [...current, email]);
    notify("Welcome to the weekly edit.");
    return { ok: true };
  }, [subscribers, setSubscribers, notify]);

  const sendMessage = useCallback((details) => {
    setMessages(current => [{ id: Date.now(), ...details, createdAt: new Date().toISOString(), status: "new" }, ...current]);
    notify("Message saved. We’ll be in touch.");
  }, [setMessages, notify]);

  const updateMessageStatus = useCallback((id, status) => {
    setMessages(current => current.map(message => message.id === id ? { ...message, status } : message));
    notify(status === "resolved" ? "Message marked resolved." : "Message reopened.");
  }, [setMessages, notify]);

  const deleteMessage = useCallback((id) => {
    setMessages(current => current.filter(message => message.id !== id));
    notify("Message deleted.");
  }, [setMessages, notify]);

  const markViewed = useCallback((id) => {
    setViewHistory(current => [Number(id), ...current.filter(item => Number(item) !== Number(id))].slice(0, 12));
  }, [setViewHistory]);

  const updateSiteSettings = useCallback((details) => {
    setStoredSiteSettings(current => ({ ...defaultSiteSettings, ...current, ...details }));
    notify("Website information updated.");
  }, [setStoredSiteSettings, notify]);

  const resetSiteSettings = useCallback(() => {
    setStoredSiteSettings(defaultSiteSettings);
    notify("Website settings restored.");
  }, [setStoredSiteSettings, notify]);

  const value = useMemo(() => ({
    movies, allMovies, favourites, watchlist, trailer, toast, notify,
    addMovie, updateMovie, deleteMovie, deleteAllMovies, restoreSeedMovies, importMovies,
    reviews, addReview, moderateReview, subscribers, subscribe, messages, sendMessage, updateMessageStatus, deleteMessage, preferences, setPreferences, viewHistory, markViewed,
    siteSettings, updateSiteSettings, resetSiteSettings,
    playTrailer: (movie) => setTrailer({ ...movie, playerUrl: movie.trailerUrl, playerType: "Trailer" }),
    playMovie: (movie) => setTrailer({ ...movie, playerUrl: movie.videoUrl, playerType: "Movie" }),
    closeTrailer: () => setTrailer(null),
    toggleFavourite: (id) => toggleList(id, favourites, setFavourites, "favourites"),
    toggleWatchlist: (id) => toggleList(id, watchlist, setWatchlist, "watchlist"),
  }), [movies, allMovies, favourites, watchlist, trailer, toast, notify, addMovie, updateMovie, deleteMovie, deleteAllMovies, restoreSeedMovies, importMovies, reviews, addReview, moderateReview, subscribers, subscribe, messages, sendMessage, updateMessageStatus, deleteMessage, preferences, setPreferences, viewHistory, markViewed, siteSettings, updateSiteSettings, resetSiteSettings, setFavourites, setWatchlist, toggleList]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
