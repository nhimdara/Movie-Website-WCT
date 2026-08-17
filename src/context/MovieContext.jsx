import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import seedMovies, {
  createMovieRecord,
  DEFAULT_PREFERENCES,
  DEFAULT_SITE_SETTINGS,
  INITIAL_REVIEWS,
  MOVIE_STORE,
  STORE_KEYS,
} from "../data/movie";
import useLocalStorage from "../hooks/useLocalStorage";

export const MovieContext = createContext(null);
const seedMoviesById = new Map(
  seedMovies.map((movie) => [Number(movie.id), movie]),
);
const legacySeedTitles = new Set([
  "Beyond the Horizon",
  "Neon Abyss",
  "Dayfall",
  "The Fractured Look",
  "The Last Signal",
  "Silent Rise",
  "Obsidian Luxury",
  "Shift at Midnight",
  "Shattered Sky",
  "The Climb",
  "Ember Protocol",
  "Dark Passage",
]);

export const defaultSiteSettings = DEFAULT_SITE_SETTINGS;

export function MovieProvider({ children }) {
  const [storedMovies, setStoredMovies] = useLocalStorage(
    MOVIE_STORE.key,
    seedMovies,
  );
  const [favourites, setFavourites] = useLocalStorage(
    STORE_KEYS.favourites,
    [],
  );
  const [watchlist, setWatchlist] = useLocalStorage(STORE_KEYS.watchlist, []);
  const [reviews, setReviews] = useLocalStorage(
    STORE_KEYS.reviews,
    INITIAL_REVIEWS,
  );
  const [subscribers, setSubscribers] = useLocalStorage(
    STORE_KEYS.subscribers,
    [],
  );
  const [messages, setMessages] = useLocalStorage(STORE_KEYS.messages, []);
  const [preferences, setPreferences] = useLocalStorage(
    STORE_KEYS.preferences,
    DEFAULT_PREFERENCES,
  );
  const [viewHistory, setViewHistory] = useLocalStorage(
    STORE_KEYS.viewHistory,
    [],
  );
  const [storedSiteSettings, setStoredSiteSettings] = useLocalStorage(
    STORE_KEYS.siteSettings,
    defaultSiteSettings,
  );
  const [trailer, setTrailer] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef(null);
  const allMovies = useMemo(() => {
    if (!Array.isArray(storedMovies)) return seedMovies;
    const storedIds = new Set(storedMovies.map((movie) => Number(movie.id)));
    const storedTitles = new Set(
      storedMovies.map((movie) => movie.title?.toLowerCase().trim()),
    );

    const mergedStored = storedMovies.map((movie) => {
      const seedMovie = seedMoviesById.get(Number(movie.id));
      if (!seedMovie) {
        return createMovieRecord(movie);
      }

      const isLegacyMigrated = legacySeedTitles.has(movie.title);

      // If the movie was customized by the user in the admin dashboard (has updatedAt):
      if (movie.updatedAt) {
        return createMovieRecord({
          ...seedMovie,
          ...movie,
          poster:
            movie.poster ||
            movie.image ||
            seedMovie.poster ||
            seedMovie.image ||
            "",
          image:
            movie.image ||
            movie.poster ||
            seedMovie.image ||
            seedMovie.poster ||
            "",
        });
      }

      // Otherwise, this is a seed movie from data.js: keep latest values from data.js
      const poster =
        (isLegacyMigrated ? movie.poster : "") ||
        seedMovie.poster ||
        seedMovie.image ||
        movie.poster ||
        movie.image ||
        "";
      const image =
        seedMovie.image ||
        seedMovie.poster ||
        movie.image ||
        movie.poster ||
        "";

      return createMovieRecord({
        ...movie,
        ...seedMovie,
        poster,
        image,
        trailerUrl: seedMovie.trailerUrl || movie.trailerUrl || "",
        videoUrl: seedMovie.videoUrl || movie.videoUrl || "",
        status: movie.status || seedMovie.status || "published",
      });
    });

    // Include any new movies added directly in data.js (seedMovies) that aren't in storedMovies yet:
    const newSeedMovies = seedMovies
      .filter(
        (seed) =>
          !storedIds.has(Number(seed.id)) &&
          !storedTitles.has(seed.title?.toLowerCase().trim()),
      )
      .map(createMovieRecord);

    return [...mergedStored, ...newSeedMovies];
  }, [storedMovies]);
  const movies = useMemo(
    () => allMovies.filter((movie) => movie.status === "published"),
    [allMovies],
  );
  const siteSettings = useMemo(
    () => ({
      ...defaultSiteSettings,
      ...storedSiteSettings,
      // Keep the new project logo visible for browsers that saved the old empty default.
      logo:
        !storedSiteSettings.logo ||
        storedSiteSettings.logo === "/images/branding/movie-logo.png"
          ? defaultSiteSettings.logo
          : storedSiteSettings.logo,
    }),
    [storedSiteSettings],
  );

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2300);
  }, []);

  const toggleList = useCallback(
    (id, list, setList, label) => {
      const exists = list.includes(id);
      setList(exists ? list.filter((item) => item !== id) : [...list, id]);
      notify(exists ? `Removed from ${label}` : `Added to ${label}`);
    },
    [notify],
  );

  const addMovie = useCallback(
    (details) => {
      const allIds = [
        ...storedMovies.map((movie) => Number(movie.id) || 0),
        ...seedMovies.map((movie) => Number(movie.id) || 0),
      ];
      const nextId = (allIds.length ? Math.max(...allIds) : 0) + 1;
      const poster = details.poster || details.image || "";
      const image = details.image || details.poster || "";
      const movie = createMovieRecord({
        ...details,
        poster,
        image,
        id: nextId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setStoredMovies((current) => [movie, ...current]);
      notify(`${movie.title} added to the catalogue.`);
      return movie;
    },
    [storedMovies, setStoredMovies, notify],
  );

  const updateMovie = useCallback(
    (id, details) => {
      const poster = details.poster !== undefined ? details.poster : undefined;
      const image =
        details.image !== undefined
          ? details.image
          : poster !== undefined
            ? poster
            : undefined;

      setStoredMovies((current) => {
        const exists = current.some((movie) => Number(movie.id) === Number(id));
        const updatedEntry = (baseMovie) =>
          createMovieRecord({
            ...baseMovie,
            ...details,
            ...(poster !== undefined ? { poster } : {}),
            ...(image !== undefined ? { image } : {}),
            id: Number(id),
            updatedAt: new Date().toISOString(),
          });

        if (exists) {
          return current.map((movie) =>
            Number(movie.id) === Number(id) ? updatedEntry(movie) : movie,
          );
        }
        const seedMovie = seedMoviesById.get(Number(id)) || {};
        return [...current, updatedEntry(seedMovie)];
      });
      notify("Movie details updated.");
    },
    [setStoredMovies, notify],
  );

  const deleteMovie = useCallback(
    (id) => {
      setStoredMovies((current) =>
        current.filter((movie) => Number(movie.id) !== Number(id)),
      );
      setFavourites((current) =>
        current.filter((item) => Number(item) !== Number(id)),
      );
      setWatchlist((current) =>
        current.filter((item) => Number(item) !== Number(id)),
      );
      notify("Movie deleted from the catalogue.");
    },
    [setStoredMovies, setFavourites, setWatchlist, notify],
  );

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

  const importMovies = useCallback(
    (records) => {
      if (!Array.isArray(records))
        throw new Error("The imported file must contain an array of movies.");
      const normalized = records.map((movie, index) =>
        createMovieRecord({ ...movie, id: Number(movie.id) || index + 1 }),
      );
      if (normalized.some((movie) => !movie.title || !movie.genre))
        throw new Error("Every movie needs a title and genre.");
      setStoredMovies(normalized);
      notify(`${normalized.length} movies imported.`);
    },
    [setStoredMovies, notify],
  );

  const addReview = useCallback(
    (details) => {
      const review = {
        id: Date.now(),
        movieId: Number(details.movieId),
        movie: details.movie,
        author: details.author.trim(),
        initials: details.author
          .trim()
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        rating: Number(details.rating),
        copy: details.copy.trim(),
        time: "Just now",
        status: "pending",
      };
      setReviews((current) => [review, ...current]);
      notify("Review submitted for moderation.");
      return review;
    },
    [setReviews, notify],
  );

  const moderateReview = useCallback(
    (id, status) => {
      setReviews((current) =>
        current.map((review) =>
          review.id === id ? { ...review, status } : review,
        ),
      );
      notify(status === "approved" ? "Review approved." : "Review hidden.");
    },
    [setReviews, notify],
  );

  const subscribe = useCallback(
    (emailValue) => {
      const email = emailValue.trim().toLowerCase();
      if (subscribers.includes(email))
        return { ok: false, message: "This email is already subscribed." };
      setSubscribers((current) => [...current, email]);
      notify("Welcome to the weekly edit.");
      return { ok: true };
    },
    [subscribers, setSubscribers, notify],
  );

  const sendMessage = useCallback(
    (details) => {
      setMessages((current) => [
        {
          id: Date.now(),
          ...details,
          createdAt: new Date().toISOString(),
          status: "new",
        },
        ...current,
      ]);
      notify("Message saved. We’ll be in touch.");
    },
    [setMessages, notify],
  );

  const updateMessageStatus = useCallback(
    (id, status) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, status } : message,
        ),
      );
      notify(
        status === "resolved"
          ? "Message marked resolved."
          : "Message reopened.",
      );
    },
    [setMessages, notify],
  );

  const deleteMessage = useCallback(
    (id) => {
      setMessages((current) => current.filter((message) => message.id !== id));
      notify("Message deleted.");
    },
    [setMessages, notify],
  );

  const markViewed = useCallback(
    (id) => {
      setViewHistory((current) =>
        [
          Number(id),
          ...current.filter((item) => Number(item) !== Number(id)),
        ].slice(0, 12),
      );
    },
    [setViewHistory],
  );

  const updateSiteSettings = useCallback(
    (details) => {
      setStoredSiteSettings((current) => ({
        ...defaultSiteSettings,
        ...current,
        ...details,
      }));
      notify("Website information updated.");
    },
    [setStoredSiteSettings, notify],
  );

  const resetSiteSettings = useCallback(() => {
    setStoredSiteSettings(defaultSiteSettings);
    notify("Website settings restored.");
  }, [setStoredSiteSettings, notify]);

  const playTrailer = useCallback((movie) => {
    setTrailer({
      ...movie,
      playerUrl: movie.trailerUrl,
      playerType: "Trailer",
    });
  }, []);
  const playMovie = useCallback((movie) => {
    setTrailer({ ...movie, playerUrl: movie.videoUrl, playerType: "Movie" });
  }, []);
  const closeTrailer = useCallback(() => setTrailer(null), []);

  const value = useMemo(
    () => ({
      movies,
      allMovies,
      favourites,
      watchlist,
      trailer,
      toast,
      notify,
      addMovie,
      updateMovie,
      deleteMovie,
      deleteAllMovies,
      restoreSeedMovies,
      importMovies,
      reviews,
      addReview,
      moderateReview,
      subscribers,
      subscribe,
      messages,
      sendMessage,
      updateMessageStatus,
      deleteMessage,
      preferences,
      setPreferences,
      viewHistory,
      markViewed,
      siteSettings,
      updateSiteSettings,
      resetSiteSettings,
      playTrailer,
      playMovie,
      closeTrailer,
      toggleFavourite: (id) =>
        toggleList(id, favourites, setFavourites, "favourites"),
      toggleWatchlist: (id) =>
        toggleList(id, watchlist, setWatchlist, "watchlist"),
    }),
    [
      movies,
      allMovies,
      favourites,
      watchlist,
      trailer,
      toast,
      notify,
      addMovie,
      updateMovie,
      deleteMovie,
      deleteAllMovies,
      restoreSeedMovies,
      importMovies,
      reviews,
      addReview,
      moderateReview,
      subscribers,
      subscribe,
      messages,
      sendMessage,
      updateMessageStatus,
      deleteMessage,
      preferences,
      setPreferences,
      viewHistory,
      markViewed,
      siteSettings,
      updateSiteSettings,
      resetSiteSettings,
      playTrailer,
      playMovie,
      closeTrailer,
      setFavourites,
      setWatchlist,
      toggleList,
    ],
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}
