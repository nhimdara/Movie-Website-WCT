import useMovies from "../hooks/useMovies";

export default function About() {
  const { movies, siteSettings } = useMovies();
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">Our point of view</span><h1>{siteSettings.aboutHeading}</h1></header>
    <section className="split-page about-story"><div className="about-art"><img src="/images/banners/cinema-banner.jpg" alt="A cinematic landscape" /><span>Stories worth<br />staying for.</span></div><div className="content-card"><span className="eyebrow">Why we exist</span><h2>Less scrolling.<br />More feeling.</h2><p>{siteSettings.aboutCopy}</p><a className="btn btn-primary" href="/contact">Talk to us →</a></div></section>
    <section className="about-stat-grid"><div><b>{movies.length}</b><span>Curated titles</span></div><div><b>{new Set(movies.map(movie => movie.genre)).size}</b><span>Distinct genres</span></div><div><b>100%</b><span>React powered</span></div></section>
  </div></main>;
}
