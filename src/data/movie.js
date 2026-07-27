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
  { id: 1, movieId: 1, initials: "SK", author: "Sofia Kim", time: "12 min ago", movie: "Spider-Man: Across the Spider-Verse", rating: 5, copy: "A dazzling animated adventure with heart, energy and unforgettable visual style.", status: "pending" },
  { id: 2, movieId: 2, initials: "JR", author: "James Rivera", time: "1 hour ago", movie: "Avatar", rating: 4.5, copy: "A spectacular journey through Pandora with groundbreaking visuals and an immersive world.", status: "pending" },
  { id: 3, movieId: 5, initials: "AL", author: "Amelia Lee", time: "3 hours ago", movie: "Mortal Kombat", rating: 4, copy: "Fast, brutal and packed with familiar fighters and signature moves.", status: "pending" },
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
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    duration: "2h 20m",
    genre: "Animation",
    rating: 8.6,
    image: "movie-1.webp",
    trailerUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    videoUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    description:
      "Miles Morales is sent across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    cast: "Shameik Moore, Hailee Steinfeld, Brian Tyree Henry",
  },
  {
    id: 2,
    title: "Avatar",
    year: 2009,
    duration: "2h 42m",
    genre: "Science Fiction",
    rating: 7.9,
    image: "movie-2.webp",
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    videoUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    description:
      "A former Marine on the moon Pandora becomes torn between following his orders and protecting the world he learns to call home.",
    director: "James Cameron",
    cast: "Sam Worthington, Zoe Saldaña, Sigourney Weaver",
  },
  {
    id: 3,
    title: "Spider-Man: Brand New Day",
    year: 2026,
    duration: "TBA",
    genre: "Action",
    rating: 0,
    image: "movie-3.webp",
    trailerUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    videoUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    description:
      "Peter Parker begins a new chapter as Spider-Man in the Marvel Cinematic Universe.",
    director: "Destin Daniel Cretton",
    cast: "Tom Holland, Zendaya, Jacob Batalon",
  },
  {
    id: 4,
    title: "The Batman",
    year: 2022,
    duration: "2h 56m",
    genre: "Crime",
    rating: 7.8,
    image: "movie-4.webp",
    trailerUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
    director: "Matt Reeves",
    cast: "Robert Pattinson, Zoë Kravitz, Paul Dano",
  },
  {
    id: 5,
    title: "Mortal Kombat",
    year: 2021,
    duration: "1h 50m",
    genre: "Action",
    rating: 6.0,
    image: "movie-5.webp",
    trailerUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    videoUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    description:
      "Earth's greatest champions battle enemies from Outworld in a high-stakes tournament for the fate of the realm.",
    director: "Simon McQuoid",
    cast: "Lewis Tan, Jessica McNamee, Josh Lawson",
  },
  {
    id: 6,
    title: "Star Wars: The Rise of Skywalker",
    year: 2019,
    duration: "2h 22m",
    genre: "Science Fiction",
    rating: 6.4,
    image: "movie-6.webp",
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    videoUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    description:
      "The surviving Resistance faces the First Order once more as Rey, Finn and Poe bring the Skywalker saga to its conclusion.",
    director: "J. J. Abrams",
    cast: "Daisy Ridley, Adam Driver, John Boyega",
  },
  {
    id: 7,
    title: "Hidden Strike",
    year: 2023,
    duration: "1h 42m",
    genre: "Action",
    rating: 5.3,
    image: "movie-7.webp",
    trailerUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    videoUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    description:
      "Two former special-forces soldiers escort civilians through a dangerous gauntlet of gunfire and explosions.",
    director: "Scott Waugh",
    cast: "Jackie Chan, John Cena, Pilou Asbæk",
  },
  {
    id: 8,
    title: "John Wick: Chapter 2",
    year: 2017,
    duration: "2h 2m",
    genre: "Action",
    rating: 7.4,
    image: "movie-8.webp",
    trailerUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "Legendary hitman John Wick is forced back out of retirement by a former associate plotting to seize control of an assassins' guild.",
    director: "Chad Stahelski",
    cast: "Keanu Reeves, Riccardo Scamarcio, Ian McShane",
  },
  {
    id: 9,
    title: "Spider-Man: No Way Home",
    year: 2021,
    duration: "2h 28m",
    genre: "Action",
    rating: 8.2,
    image: "movie-9.webp",
    trailerUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    videoUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    description:
      "With Spider-Man's identity revealed, Peter Parker asks Doctor Strange for help and unleashes visitors from across the Multiverse.",
    director: "Jon Watts",
    cast: "Tom Holland, Zendaya, Benedict Cumberbatch",
  },
  {
    id: 10,
    title: "Joker",
    year: 2019,
    duration: "2h 2m",
    genre: "Crime",
    rating: 8.3,
    image: "movie-10.webp",
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    videoUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    description:
      "A struggling clown and aspiring comedian descends into isolation and violence in a fractured Gotham City.",
    director: "Todd Phillips",
    cast: "Joaquin Phoenix, Robert De Niro, Zazie Beetz",
  },
  {
    id: 11,
    title: "Thor: Ragnarok",
    year: 2017,
    duration: "2h 10m",
    genre: "Action",
    rating: 7.9,
    image: "movie-11.webp",
    trailerUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    videoUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    description:
      "Thor races against time to prevent the destruction of Asgard after being imprisoned on the far side of the universe.",
    director: "Taika Waititi",
    cast: "Chris Hemsworth, Tom Hiddleston, Cate Blanchett",
  },
  {
    id: 12,
    title: "The Abyss",
    year: 1989,
    duration: "2h 20m",
    genre: "Science Fiction",
    rating: 7.5,
    image: "movie-12.webp",
    trailerUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "A civilian diving team is enlisted to search for a lost nuclear submarine and encounters something extraordinary deep beneath the sea.",
    director: "James Cameron",
    cast: "Ed Harris, Mary Elizabeth Mastrantonio, Michael Biehn",
  },
];

// This is the complete seed catalogue. Every exported record contains every
// field defined in MOVIE_DEFAULTS, including trailer, poster and publish state.
const movies = movieRecords.map(createMovieRecord);

export const genres = [
  "Science Fiction",
  "Action",
  "Animation",
  "Crime",
];
export const moviePoster = (movie) => {
  const source = movie?.poster || movie?.image || "movie-1.jpg";
  return /^(https?:|data:|blob:|\/)/i.test(source)
    ? source
    : `/images/movies/${source.replace(/\.jpe?g$/i, ".webp")}`;
};
export default movies;
