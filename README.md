# CineVault

CineVault is a complete responsive multi-page movie discovery website built with React 19, Vite, semantic JSX, and modular CSS.

## Features

- Nine JSX page routes rendered by one React application
- Search, genre filtering, and catalogue sorting
- Persistent favourites and watchlist
- Reusable React components and state-driven interactions
- Demo authentication, validation, and light/dark themes
- Responsive and accessible interface

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`.

## Production build

```powershell
npm.cmd run build
```

The project is a React single-page application. `index.html` only provides Vite's required root element; all visible pages and content are JSX in `src/App.jsx`.

Routes include `/`, `/movies`, `/movie?id=1`, `/favourites`, `/watchlist`, `/about`, `/contact`, `/login`, and `/register`.
