export const STORE_KEYS = Object.freeze({
  movies: "cinevault-movies",
  favourites: "cinevault-favourites",
  watchlist: "cinevault-watchlist",
  reviews: "cinevault-reviews",
  subscribers: "cinevault-subscribers",
  messages: "cinevault-messages",
  preferences: "cinevault-preferences",
  viewHistory: "cinevault-view-history",
  siteSettings: "cinevault-site-settings",
  user: "cinevault-user",
  session: "cinevault-session",
  accounts: "cinevault-accounts",
  theme: "cinevault-theme",
});

export const MOVIE_STORE = {
  key: STORE_KEYS.movies,
  version: 1,
};

export const DEFAULT_PREFERENCES = Object.freeze({
  reports: true,
  reviews: true,
  publish: false,
});

export const DEFAULT_SITE_SETTINGS = Object.freeze({
  brandName: "CineVault",
  logo: "/images/branding/movie-logo.webp",
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
});

export const INITIAL_REVIEWS = Object.freeze([
  { id: 1, movieId: 1, initials: "SK", author: "Sofia Kim", time: "12 min ago", movie: "Beyond the Horizon", rating: 5, copy: "A beautiful, patient piece of science fiction. The final act stayed with me.", status: "pending" },
  { id: 2, movieId: 2, initials: "JR", author: "James Rivera", time: "1 hour ago", movie: "Neon Abyss", rating: 4.5, copy: "Electric visuals and a brilliant lead performance. I wanted a little more from the ending.", status: "pending" },
  { id: 3, movieId: 5, initials: "AL", author: "Amelia Lee", time: "3 hours ago", movie: "The Last Signal", rating: 4.8, copy: "Quietly devastating. One of the strongest films in the catalogue.", status: "pending" },
]);

export const DEMO_ADMIN = Object.freeze({
  name: "Alex Morgan",
  email: "admin@cinevault.com",
  password: "admin123",
  role: "Administrator",
});

export const MOVIE_DEFAULTS = {
  title: "",
  year: new Date().getFullYear(),
  duration: "",
  genre: "Drama",
  rating: 0,
  image: "",
  poster: "",
  trailerUrl: "",
  videoUrl: "",
  description: "",
  director: "",
  cast: "",
  status: "published",
  createdAt: "",
  updatedAt: "",
};

export function createMovieRecord(movie = {}) {
  return {
    ...MOVIE_DEFAULTS,
    ...movie,
    id: Number(movie.id) || 0,
    year: Number(movie.year) || MOVIE_DEFAULTS.year,
    rating: Number(movie.rating) || 0,
    genre: movie.genre === "Sci-Fi" ? "Science Fiction" : movie.genre || MOVIE_DEFAULTS.genre,
  };
}

const movieRecords = [
  {
    id: 1,
    title: "Beyond the Horizon",
    year: 2026,
    duration: "2h 18m",
    genre: "Science Fiction",
    rating: 9.2,
    image: "movie-1.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    videoUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    description:
      "An explorer follows a mysterious signal through a fractured corner of space, risking everything for a final chance at home.",
    director: "Mara Venn",
    cast: "Lena Cross, Theo Vale, Imani Reed",
  },
  {
    id: 2,
    title: "Neon Abyss",
    year: 2025,
    duration: "1h 49m",
    genre: "Thriller",
    rating: 8.7,
    image: "movie-2.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    videoUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    description:
      "A courier discovers the package she is carrying can rewrite the memories of an entire city.",
    director: "Eli Warren",
    cast: "Sora Lane, Mark Enzo",
  },
  {
    id: 3,
    title: "Dayfall",
    year: 2024,
    duration: "2h 05m",
    genre: "Drama",
    rating: 8.4,
    image: "movie-3.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    videoUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    description:
      "Two estranged sisters return to their coastal hometown on the longest day of the year.",
    director: "Nadia Sol",
    cast: "Mira Stone, Adele Park",
  },
  {
    id: 4,
    title: "The Fractured Look",
    year: 2026,
    duration: "1h 58m",
    genre: "Thriller",
    rating: 8.9,
    image: "movie-4.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "A celebrated photographer sees a crime hidden inside one of her unfinished portraits.",
    director: "Jonas Rook",
    cast: "Eva Nox, Colin North",
  },
  {
    id: 5,
    title: "The Last Signal",
    year: 2026,
    duration: "2h 12m",
    genre: "Science Fiction",
    rating: 9.1,
    image: "movie-5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    videoUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    description:
      "At the end of the world, an isolated radio operator receives a transmission that should not exist.",
    director: "Amara Quinn",
    cast: "Naomi Bell, Erik Moss",
  },
  {
    id: 6,
    title: "Silent Rise",
    year: 2023,
    duration: "1h 26m",
    genre: "Documentary",
    rating: 8.5,
    image: "movie-6.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    videoUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    description:
      "An intimate study of four climbers attempting an uncharted winter ascent.",
    director: "Cole Mercer",
    cast: "Ari Chen, Luca Gray",
  },
  {
    id: 7,
    title: "Obsidian Luxury",
    year: 2025,
    duration: "1h 54m",
    genre: "Drama",
    rating: 8.2,
    image: "movie-7.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    videoUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    description:
      "A hotel concierge becomes the only witness to a billionaire's carefully staged disappearance.",
    director: "Yuki Aster",
    cast: "June Ko, Anton Reyes",
  },
  {
    id: 8,
    title: "Shift at Midnight",
    year: 2024,
    duration: "1h 42m",
    genre: "Thriller",
    rating: 8.0,
    image: "movie-8.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "A night-shift paramedic realizes every emergency call is leading her toward the same address.",
    director: "Faye Holt",
    cast: "Liv Mercer, Ben Rami",
  },
  {
    id: 9,
    title: "Shattered Sky",
    year: 2026,
    duration: "2h 27m",
    genre: "Adventure",
    rating: 8.8,
    image: "movie-9.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    videoUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    description:
      "A crew of storm pilots crosses a world where the atmosphere is breaking apart.",
    director: "Rian West",
    cast: "Iris Kane, Sol Quinn",
  },
  {
    id: 10,
    title: "The Climb",
    year: 2023,
    duration: "1h 40m",
    genre: "Documentary",
    rating: 7.9,
    image: "movie-10.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    videoUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    description:
      "A breathtaking account of endurance, friendship and impossible vertical terrain.",
    director: "Milo Hart",
    cast: "Tess Morgan, Kai Young",
  },
  {
    id: 11,
    title: "Ember Protocol",
    year: 2025,
    duration: "2h 15m",
    genre: "Science Fiction",
    rating: 8.6,
    image: "movie-11.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    videoUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    description:
      "The last firefighter on Mars uncovers the code that started a planet-wide catastrophe.",
    director: "Celeste Wynn",
    cast: "Nico Rhodes, Sana Bell",
  },
  {
    id: 12,
    title: "Dark Passage",
    year: 2024,
    duration: "1h 50m",
    genre: "Adventure",
    rating: 8.1,
    image: "movie-12.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "A cartographer enters an underground ocean to find a missing expedition.",
    director: "Oren Pike",
    cast: "Maya Voss, Ren Cole",
  },
];

// This is the complete seed catalogue. Every exported record contains every
// field defined in MOVIE_DEFAULTS, including trailer, poster and publish state.
const movies = movieRecords.map(createMovieRecord);

export const genres = [
  "Science Fiction",
  "Drama",
  "Thriller",
  "Adventure",
  "Documentary",
];
export const moviePoster = (movie) => {
  const source = movie?.poster || movie?.image || "movie-1.jpg";
  return /^(https?:|data:|blob:|\/)/i.test(source)
    ? source
    : `/images/movies/${source.replace(/\.jpe?g$/i, ".webp")}`;
};
export default movies;
