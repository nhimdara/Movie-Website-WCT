import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { genres, moviePoster } from "../../data/movies";
import { AuthContext } from "../../context/AuthContext";
import useMovies from "../../hooks/useMovies";
import "./AdminDashboard.css";

const Icon = ({ name, size = 19 }) => {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    film: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63h.01A1.7 1.7 0 0 0 10 3.08V3h4v.09A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9v.01A1.7 1.7 0 0 0 20.92 10H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 19v2h16v-2"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
    play: <path d="m9 7 8 5-8 5Z"/>,
    star: <path d="m12 3 2.8 5.67 6.2.9-4.5 4.38 1.06 6.18L12 17.2l-5.56 2.93 1.06-6.18L3 9.57l6.2-.9Z"/>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const navGroups = [
  { label: "Workspace", items: [["grid", "Overview"], ["film", "Movies"], ["users", "Audience"], ["chart", "Analytics"]] },
  { label: "Manage", items: [["eye", "Website"], ["message", "Inbox"], ["star", "Reviews"], ["settings", "Settings"]] },
];

const trendData = {
  "7d": [18, 28, 24, 40, 36, 52, 48, 68, 63, 80, 74, 91],
  "30d": [22, 33, 29, 45, 42, 57, 54, 72, 67, 84, 79, 96],
  "90d": [14, 25, 31, 38, 35, 48, 59, 62, 74, 70, 86, 94],
};

function TrendChart({ range }) {
  const values = trendData[range];
  const points = values.map((value, index) => `${20 + index * 46},${190 - value * 1.5}`).join(" ");
  const area = `M${points} L526,190 L20,190 Z`;
  return <div className="dash-chart">
    <div className="chart-y"><span>15K</span><span>10K</span><span>5K</span><span>0</span></div>
    <svg viewBox="0 0 546 210" role="img" aria-label="Views have increased over the selected period">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff695f" stopOpacity=".28"/>
          <stop offset="100%" stopColor="#ff695f" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[34, 86, 138, 190].map(y => <line key={y} x1="20" y1={y} x2="526" y2={y} className="chart-gridline"/>)}
      <path d={area} fill="url(#chartFill)"/>
      <polyline points={points} className="chart-line"/>
      <circle cx="526" cy={190 - values.at(-1) * 1.5} r="5" className="chart-dot"/>
    </svg>
    <div className="chart-x"><span>Jul 1</span><span>Jul 7</span><span>Jul 13</span><span>Jul 19</span><span>Jul 25</span></div>
  </div>;
}

const sectionCopy = {
  Movies: ["Movie library", "Manage every title in your CineVault catalogue."],
  Audience: ["Audience", "Understand who is watching and how they engage."],
  Analytics: ["Analytics", "Explore performance across your entire studio."],
  Reviews: ["Review moderation", "Manage ratings and feedback from your community."],
  Inbox: ["Contact inbox", "Read and manage messages submitted through the website."],
  Website: ["Website content", "Control the information visitors see across your public website."],
  Settings: ["Studio settings", "Control workspace preferences and notifications."],
};

function WorkspacePage({ active, movies, query, range, setRange, reviews, moderateReview, messages, updateMessageStatus, deleteMessage, preferences, setPreferences, siteSettings, saveWebsite, resetWebsite, saved, saveSettings, onAdd, onEdit, onDelete, onDeleteAll, onRestore, onImport, onExport }) {
  const filteredMovies = movies.filter(movie =>
    `${movie.title} ${movie.genre} ${movie.year}`.toLowerCase().includes(query.toLowerCase())
  );

  if (active === "Movies") return <>
    <WorkspaceHeader active={active} action={<button className="workspace-primary" onClick={onAdd}>+ Add title</button>}/>
    <div className="library-stats">
      <article><span>Published</span><strong>{movies.filter(movie => movie.status === "published").length}</strong><small>Visible on the website</small></article>
      <article><span>Drafts</span><strong>{movies.filter(movie => movie.status === "draft").length}</strong><small>Only visible to admins</small></article>
      <article><span>Playable movies</span><strong>{movies.filter(movie => movie.videoUrl).length}</strong><small>Full video available</small></article>
    </div>
    <section className="panel library-panel">
      <div className="library-toolbar">
        <b>All titles</b><span>{filteredMovies.length} movies</span>
        <div className="library-tools">
          <label className="library-import">Import JSON<input type="file" accept=".json,application/json" onChange={onImport}/></label>
          <button onClick={onExport}>Export</button>
          <button className="restore-button" onClick={onRestore}>Restore seed</button>
          <button className="delete-all-button" onClick={onDeleteAll}>Delete all</button>
        </div>
      </div>
      <div className="library-head"><span>Movie</span><span>Status</span><span>Year</span><span>Rating</span><span>Actions</span></div>
      {filteredMovies.length ? filteredMovies.map(movie => <div className="library-row" key={movie.id}>
        <img src={moviePoster(movie)} alt=""/>
        <span><b>{movie.title}</b><small>{movie.genre} · {movie.duration}</small></span>
        <span className={movie.status === "published" ? "status-live" : "status-draft"}><i/> {movie.status === "published" ? "Published" : "Draft"}</span>
        <span>{movie.year}</span>
        <span className="movie-rating"><Icon name="star" size={14}/>{movie.rating}</span>
        <span className="library-actions"><button onClick={() => onEdit(movie)}>Edit</button><button onClick={() => onDelete(movie)}>Delete</button></span>
      </div>) : <div className="dashboard-empty">No movies match “{query}”.</div>}
    </section>
  </>;

  if (active === "Audience") return <>
    <WorkspaceHeader active={active}/>
    <div className="audience-layout">
      <section className="panel audience-hero">
        <div><span>Active audience</span><strong>24,812</strong><p><b>+18.7%</b> from last month</p></div>
        <div className="audience-orbit"><i/><i/><i/><span><Icon name="users" size={25}/></span></div>
      </section>
      <section className="panel audience-locations"><div className="panel-heading"><div><h2>Top locations</h2><p>Viewers by region</p></div></div>
        {[["United States", 38], ["United Kingdom", 22], ["Cambodia", 18], ["Canada", 13], ["Other", 9]].map(([label, value]) =>
          <div className="location-row" key={label}><span>{label}</span><i><b style={{ width: `${value}%` }}/></i><strong>{value}%</strong></div>)}
      </section>
      <section className="panel device-panel"><div className="panel-heading"><div><h2>Watching on</h2><p>Device distribution</p></div></div>
        <div className="device-ring"><span><b>62%</b><small>Desktop</small></span></div>
        <div className="device-legend"><span><i/>Desktop <b>62%</b></span><span><i/>Mobile <b>27%</b></span><span><i/>TV <b>11%</b></span></div>
      </section>
    </div>
  </>;

  if (active === "Analytics") return <>
    <WorkspaceHeader active={active} action={<div className="range-tabs">{["7d", "30d", "90d"].map(item => <button className={range === item ? "active" : ""} onClick={() => setRange(item)} key={item}>{item}</button>)}</div>}/>
    <div className="analytics-cards">
      {[["Completion rate", "72.4%", "+4.2%"], ["Returning viewers", "41.8%", "+7.1%"], ["Avg. session", "48m 12s", "+2.9%"]].map(([label, value, delta]) => <article className="panel" key={label}><span>{label}</span><strong>{value}</strong><small>{delta} this period</small></article>)}
    </div>
    <section className="panel analytics-main">
      <div className="panel-heading"><div><h2>Engagement overview</h2><p>Views across all titles</p></div></div>
      <div className="chart-summary"><strong>{range === "7d" ? "286,410" : range === "30d" ? "842,670" : "2,418,290"}</strong><span>+14.8%</span></div>
      <TrendChart range={range}/>
    </section>
  </>;

  if (active === "Reviews") return <>
    <WorkspaceHeader active={active} action={<span className="review-count">{reviews.filter(review => review.status === "pending").length} pending</span>}/>
    <section className="review-grid">
      {reviews.map(review => <article className={`panel review-card ${review.status !== "pending" ? "resolved" : ""}`} key={review.id}>
        <div className="review-author"><span>{review.initials}</span><div><b>{review.author}</b><small>{review.time}</small></div><strong>★ {review.rating}</strong></div>
        <h3>{review.movie}</h3><p>“{review.copy}”</p>
        {review.status === "pending" ? <div className="review-actions">
          <button onClick={() => moderateReview(review.id, "approved")}>Approve</button>
          <button onClick={() => moderateReview(review.id, "hidden")}>Hide</button>
        </div> : <div className={`review-status ${review.status}`}>{review.status === "approved" ? "✓ Approved" : "Hidden"}</div>}
      </article>)}
    </section>
  </>;

  if (active === "Inbox") return <>
    <WorkspaceHeader active={active} action={<span className="review-count">{messages.filter(message => message.status === "new").length} unread</span>}/>
    <section className="inbox-list">
      {messages.length ? messages.map(message => <article className={`panel inbox-message ${message.status === "resolved" ? "resolved" : ""}`} key={message.id}>
        <div className="inbox-avatar">{message.name?.split(/\s+/).map(part => part[0]).join("").slice(0,2).toUpperCase()}</div>
        <div><header><b>{message.name}</b><a href={`mailto:${message.email}`}>{message.email}</a><time>{new Date(message.createdAt).toLocaleDateString()}</time></header><p>{message.message}</p>
          <footer><button onClick={() => updateMessageStatus(message.id, message.status === "resolved" ? "new" : "resolved")}>{message.status === "resolved" ? "Reopen" : "Mark resolved"}</button><button onClick={() => deleteMessage(message.id)}>Delete</button></footer>
        </div>
      </article>) : <div className="panel dashboard-empty">No contact messages yet.</div>}
    </section>
  </>;

  if (active === "Website") return <WebsiteEditor
    key={JSON.stringify(siteSettings)}
    movies={movies.filter(movie => movie.status === "published")}
    settings={siteSettings}
    onSave={saveWebsite}
    onReset={resetWebsite}
    saved={saved}
  />;

  return <>
    <WorkspaceHeader active={active}/>
    <section className="settings-layout">
      <nav className="panel settings-nav" aria-label="Settings section"><span className="active">General preferences</span><small>Notification and publishing behavior is managed here.</small></nav>
      <form className="panel settings-form" onSubmit={event => { event.preventDefault(); saveSettings(); }}>
        <div className="settings-heading"><h2>General preferences</h2><p>Customize how your studio workspace behaves.</p></div>
        <label className="settings-field"><span>Studio name</span><input defaultValue="CineVault Studio"/></label>
        <label className="settings-field"><span>Contact email</span><input type="email" defaultValue="admin@cinevault.com"/></label>
        <div className="settings-switches">
          {[
            ["Weekly performance report", "Receive a summary every Monday.", "reports"],
            ["New review notifications", "Get notified when viewers leave feedback.", "reviews"],
            ["Auto-publish approved titles", "Publish immediately after editorial approval.", "publish"],
          ].map(([title, copy, key]) => <label key={key}><span><b>{title}</b><small>{copy}</small></span><input type="checkbox" checked={preferences[key]} onChange={() => setPreferences(current => ({ ...current, [key]: !current[key] }))}/><i/></label>)}
        </div>
        <div className="settings-save"><span className={saved ? "show" : ""}>✓ Changes saved</span><button>Save changes</button></div>
      </form>
    </section>
  </>;
}

function WebsiteEditor({ movies, settings, onSave, onReset, saved }) {
  const [logoPreview, setLogoPreview] = useState(settings.logo || "");

  const uploadLogo = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type)) {
      window.alert("Choose a PNG, JPG, WebP or SVG logo.");
      event.target.value = "";
      return;
    }
    if (file.size > 750_000) {
      window.alert("Please choose a logo smaller than 750 KB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    onSave({
      brandName: values.brandName.trim(),
      logo: logoPreview,
      heroLabel: values.heroLabel.trim(),
      heroNote: values.heroNote.trim(),
      featuredMovieId: values.featuredMovieId,
      topRowTitle: values.topRowTitle.trim(),
      trendingTitle: values.trendingTitle.trim(),
      newReleasesTitle: values.newReleasesTitle.trim(),
      newsletterTitle: values.newsletterTitle.trim(),
      newsletterCopy: values.newsletterCopy.trim(),
      footerTagline: values.footerTagline.trim(),
      contactEmail: values.contactEmail.trim(),
      location: values.location.trim(),
      aboutHeading: values.aboutHeading.trim(),
      aboutCopy: values.aboutCopy.trim(),
      contactHeading: values.contactHeading.trim(),
      contactCopy: values.contactCopy.trim(),
      announcement: values.announcement.trim(),
      showGenres: form.elements.showGenres.checked,
      showContinueWatching: form.elements.showContinueWatching.checked,
      showTopRow: form.elements.showTopRow.checked,
      showTrending: form.elements.showTrending.checked,
      showNewReleases: form.elements.showNewReleases.checked,
      showGenreRows: form.elements.showGenreRows.checked,
      showNewsletter: form.elements.showNewsletter.checked,
    });
  };

  const visibility = [
    ["Genre navigation", "Show genre filters below the hero.", "showGenres"],
    ["Continue watching", "Show viewing history to returning visitors.", "showContinueWatching"],
    ["Top titles", "Show the highest-rated movie row.", "showTopRow"],
    ["Trending", "Show the main catalogue row.", "showTrending"],
    ["New releases", "Show titles ordered by release year.", "showNewReleases"],
    ["Genre collections", "Show Science Fiction, Drama and Thriller rows.", "showGenreRows"],
    ["Newsletter", "Show the email subscription section.", "showNewsletter"],
  ];

  return <>
    <WorkspaceHeader active="Website" action={<a className="workspace-preview" href="/" target="_blank" rel="noreferrer">Preview website ↗</a>}/>
    <form className="website-editor" onSubmit={submit}>
      <section className="panel website-settings-card">
        <div className="settings-heading"><h2>Brand and homepage</h2><p>These changes appear immediately after you save.</p></div>
        <div className="website-logo-control">
          <div className="website-logo-preview">{logoPreview ? <img src={logoPreview} alt="Website logo preview"/> : <span>CV</span>}</div>
          <div><b>Website logo</b><small>Upload a square or horizontal PNG, JPG, WebP or SVG. Maximum 750 KB.</small>
            <div><label className="website-logo-upload">Choose logo<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg" onChange={uploadLogo}/></label>{logoPreview && <button type="button" onClick={() => setLogoPreview("")}>Remove</button>}</div>
          </div>
        </div>
        <div className="website-field-grid">
          <label><span>Website name</span><input name="brandName" defaultValue={settings.brandName} required/></label>
          <label><span>Hero label</span><input name="heroLabel" defaultValue={settings.heroLabel} required/></label>
          <label><span>Hero editor note</span><input name="heroNote" defaultValue={settings.heroNote}/></label>
          <label><span>Featured hero movie</span><select name="featuredMovieId" defaultValue={settings.featuredMovieId}><option value="">Automatic — first published movie</option>{movies.map(movie => <option value={movie.id} key={movie.id}>{movie.title}</option>)}</select></label>
          <label><span>Top titles heading</span><input name="topRowTitle" defaultValue={settings.topRowTitle}/></label>
          <label><span>Trending heading</span><input name="trendingTitle" defaultValue={settings.trendingTitle}/></label>
          <label><span>New releases heading</span><input name="newReleasesTitle" defaultValue={settings.newReleasesTitle}/></label>
          <label><span>Announcement</span><input name="announcement" defaultValue={settings.announcement} placeholder="Optional message shown above the navigation"/></label>
        </div>
      </section>

      <section className="panel website-settings-card">
        <div className="settings-heading"><h2>Public page information</h2><p>Manage user-facing copy without editing source files.</p></div>
        <div className="website-field-grid">
          <label><span>Contact email</span><input name="contactEmail" type="email" defaultValue={settings.contactEmail} required/></label>
          <label><span>Business location</span><input name="location" defaultValue={settings.location}/></label>
          <label className="wide"><span>Footer description</span><textarea name="footerTagline" rows="3" defaultValue={settings.footerTagline}/></label>
          <label><span>About page heading</span><input name="aboutHeading" defaultValue={settings.aboutHeading}/></label>
          <label><span>Contact page heading</span><input name="contactHeading" defaultValue={settings.contactHeading}/></label>
          <label className="wide"><span>About page description</span><textarea name="aboutCopy" rows="3" defaultValue={settings.aboutCopy}/></label>
          <label className="wide"><span>Contact page description</span><textarea name="contactCopy" rows="3" defaultValue={settings.contactCopy}/></label>
          <label className="wide"><span>Newsletter heading</span><input name="newsletterTitle" defaultValue={settings.newsletterTitle}/></label>
          <label className="wide"><span>Newsletter description</span><textarea name="newsletterCopy" rows="2" defaultValue={settings.newsletterCopy}/></label>
        </div>
      </section>

      <section className="panel website-settings-card">
        <div className="settings-heading"><h2>Homepage sections</h2><p>Choose which content visitors can see.</p></div>
        <div className="website-switches">
          {visibility.map(([title, copy, key]) => <label key={key}><span><b>{title}</b><small>{copy}</small></span><input name={key} type="checkbox" defaultChecked={settings[key]}/><i/></label>)}
        </div>
      </section>

      <footer className="website-editor-actions">
        <button type="button" className="website-reset" onClick={onReset}>Restore defaults</button>
        <span className={saved ? "show" : ""}>✓ Website updated</span>
        <button className="workspace-primary">Save website</button>
      </footer>
    </form>
  </>;
}

function WorkspaceHeader({ active, action }) {
  const [title, copy] = sectionCopy[active];
  return <section className="workspace-header"><div><p className="admin-kicker">CineVault Studio</p><h1>{title}</h1><span>{copy}</span></div>{action}</section>;
}

export default function AdminDashboard() {
  const { session, logout } = useContext(AuthContext);
  const { allMovies: movies, addMovie, updateMovie, deleteMovie, deleteAllMovies, restoreSeedMovies, importMovies, reviews, moderateReview, preferences, setPreferences, messages, updateMessageStatus, deleteMessage, subscribers, siteSettings, updateSiteSettings, resetSiteSettings } = useMovies();
  const [active, setActive] = useState("Overview");
  const [range, setRange] = useState("30d");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const rankedMovies = useMemo(() =>
    [...movies]
      .filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5), [query]);

  const average = movies.length ? (movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length).toFixed(1) : "0.0";
  const genreStats = genres.map(genre => ({
    genre,
    count: movies.filter(movie => movie.genre === genre).length,
  })).sort((a, b) => b.count - a.count);

  const exportReport = () => {
    const rows = [["Title", "Genre", "Year", "Rating"], ...movies.map(m => [m.title, m.genre, m.year, m.rating])];
    const csv = rows.map(row => row.map(value => `"${value}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "cinevault-movie-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const signOut = () => {
    logout();
    window.location.replace("/login");
  };

  const saveSettings = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const saveWebsite = (details) => {
    updateSiteSettings(details);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const resetWebsite = () => {
    if (!window.confirm("Restore all public website text and section visibility to the defaults?")) return;
    resetSiteSettings();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const openEditor = (movie = null) => {
    setEditingMovie(movie);
    setEditorOpen(true);
  };

  const saveMovie = (details) => {
    if (editingMovie) updateMovie(editingMovie.id, details);
    else addMovie(details);
    setEditorOpen(false);
    setEditingMovie(null);
  };

  const removeMovie = (movie) => {
    if (window.confirm(`Delete “${movie.title}”? This cannot be undone.`)) deleteMovie(movie.id);
  };

  const removeAllMovies = () => {
    if (window.confirm("Delete every movie in the catalogue? Favourites and watchlists will also be cleared.")) deleteAllMovies();
  };

  const restoreMovies = () => {
    if (window.confirm("Replace the current catalogue with the original seed data?")) restoreSeedMovies();
  };

  const exportData = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(movies, null, 2)], { type: "application/json" }));
    link.download = "cinevault-movies.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importData = async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      importMovies(JSON.parse(await file.text()));
    } catch (error) {
      window.alert(error.message || "Could not import this file.");
    }
    event.target.value = "";
  };

  return <div className="admin-shell">
    <button className={`dash-backdrop ${menuOpen ? "show" : ""}`} aria-label="Close menu" onClick={() => setMenuOpen(false)}/>
    <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
      <a className="admin-brand" href="/">
        <span className="admin-brand-mark has-logo"><img src={siteSettings.logo} alt=""/></span>
        <span>{siteSettings.brandName}<small>Studio</small></span>
      </a>
      <nav className="admin-nav">
        {navGroups.map(group => <div className="admin-nav-group" key={group.label}>
          <p>{group.label}</p>
          {group.items.map(([icon, label]) => <button
            className={active === label ? "active" : ""}
            key={label}
            onClick={() => { setActive(label); setMenuOpen(false); }}
          >
            <Icon name={icon}/><span>{label}</span>{label === "Reviews" && reviews.some(review => review.status === "pending") && <b>{reviews.filter(review => review.status === "pending").length}</b>}{label === "Inbox" && messages.some(message => message.status === "new") && <b>{messages.filter(message => message.status === "new").length}</b>}
          </button>)}
        </div>)}
      </nav>
      <div className="admin-upgrade">
        <span><Icon name="star" size={17}/></span>
        <b>Unlock studio insights</b>
        <p>Get deeper audience analytics and forecasting.</p>
        <button onClick={() => setActive("Settings")}>Open settings</button>
      </div>
      <div className="admin-profile">
        <span className={`admin-avatar${session?.avatar ? " has-avatar" : ""}`}>{session?.avatar ? <img src={session.avatar} alt=""/> : session?.name?.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || "AM"}</span>
        <span><b>{session?.name || "Alex Morgan"}</b><small>{session?.role || "Administrator"}</small></span>
        <button className="admin-logout" onClick={signOut} aria-label="Sign out" title="Sign out"><Icon name="logout" size={16}/></button>
      </div>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar">
        <button className="admin-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu"/></button>
        <label className="admin-search">
          <Icon name="search"/>
          <input ref={searchInputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, genres, people…"/>
          <kbd>⌘ K</kbd>
        </label>
        <div className="admin-top-actions">
          <button className="notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(open => !open)}><Icon name="bell"/>{(messages.length > 0 || reviews.some(review => review.status === "pending")) && <i/>}</button>
          <button className="export-button" onClick={exportReport}><Icon name="download" size={17}/> Export report</button>
          {notificationsOpen && <div className="notification-menu">
            <header><b>Notifications</b><span>{messages.length + reviews.filter(review => review.status === "pending").length} new</span></header>
            {reviews.filter(review => review.status === "pending").slice(0, 2).map(review => <button key={`review-${review.id}`} onClick={() => { setActive("Reviews"); setNotificationsOpen(false); }}><Icon name="star" size={15}/><span><b>Review waiting</b><small>{review.movie} · {review.author}</small></span></button>)}
            {messages.filter(message => message.status === "new").slice(0, 2).map(message => <button key={`message-${message.id}`} onClick={() => { setActive("Inbox"); setNotificationsOpen(false); }}><Icon name="message" size={15}/><span><b>New contact message</b><small>{message.name} · {message.email}</small></span></button>)}
            {!messages.length && !reviews.some(review => review.status === "pending") && <p>You’re all caught up.</p>}
            <footer>{subscribers.length} newsletter subscribers</footer>
          </div>}
        </div>
      </header>

      <div className="admin-content">
        {active === "Overview" ? <>
        <section className="admin-welcome">
          <div><p className="admin-kicker">Saturday, July 25</p><h1>Good evening, Alex.</h1><span>Here’s what’s happening with your catalogue today.</span></div>
          <div className="live-pill"><i/> All systems operational</div>
        </section>

        <section className="metric-grid" aria-label="Key performance metrics">
          {[
            ["Total views", "1.24M", "+12.5%", "eye", "coral"],
            ["Watch time", "86.4K h", "+8.2%", "play", "violet"],
            ["Avg. rating", average, "+0.4%", "star", "amber"],
            ["Active viewers", "24.8K", "+18.7%", "users", "blue"],
          ].map(([label, value, delta, icon, color]) => <article className="metric-card" key={label}>
            <div className={`metric-icon ${color}`}><Icon name={icon}/></div>
            <span>{label}</span>
            <strong>{value}</strong>
            <p><b>{delta}</b> vs last month</p>
          </article>)}
        </section>

        <section className="dashboard-grid">
          <article className="panel performance-panel">
            <div className="panel-heading">
              <div><h2>Viewing performance</h2><p>Unique views across all published titles</p></div>
              <div className="range-tabs">
                {["7d", "30d", "90d"].map(item => <button className={range === item ? "active" : ""} onClick={() => setRange(item)} key={item}>{item}</button>)}
              </div>
            </div>
            <div className="chart-summary"><strong>{range === "7d" ? "286,410" : range === "30d" ? "842,670" : "2,418,290"}</strong><span>+14.8%</span></div>
            <TrendChart range={range}/>
          </article>

          <article className="panel genre-panel">
            <div className="panel-heading"><div><h2>Genre breakdown</h2><p>Titles in your catalogue</p></div><button className="more-button">•••</button></div>
            <div className="genre-total"><strong>{movies.length}</strong><span>total titles</span></div>
            <div className="genre-bar">
              {genreStats.map(({ genre, count }, index) => <i key={genre} style={{ width: `${count / Math.max(movies.length, 1) * 100}%` }} className={`genre-${index}`}/>)}
            </div>
            <div className="genre-list">
              {genreStats.map(({ genre, count }, index) => <div key={genre}><i className={`genre-${index}`}/><span>{genre}</span><b>{count}</b><small>{Math.round(count / Math.max(movies.length, 1) * 100)}%</small></div>)}
            </div>
          </article>

          <article className="panel titles-panel">
            <div className="panel-heading"><div><h2>Top performing titles</h2><p>Ranked by audience score and engagement</p></div><a href="/movies">View all <Icon name="chevron" size={15}/></a></div>
            <div className="title-table-head"><span>Title</span><span>Views</span><span>Rating</span><span>Trend</span></div>
            <div className="title-list">
              {rankedMovies.length ? rankedMovies.map((movie, index) => <a className="title-row" href={`/movie?id=${movie.id}`} key={movie.id}>
                <span className="movie-rank">0{index + 1}</span>
                <img src={moviePoster(movie)} alt=""/>
                <span className="movie-name"><b>{movie.title}</b><small>{movie.genre} · {movie.year}</small></span>
                <span className="movie-views">{["248K", "192K", "174K", "143K", "118K"][index]}</span>
                <span className="movie-rating"><Icon name="star" size={14}/>{movie.rating}</span>
                <span className="movie-trend">+{[24, 18, 13, 9, 7][index]}%</span>
                <Icon name="chevron" size={16}/>
              </a>) : <div className="dashboard-empty">No titles match “{query}”.</div>}
            </div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-heading"><div><h2>Recent activity</h2><p>Latest catalogue updates</p></div></div>
            <div className="activity-list">
              {[
                ["film", "Beyond the Horizon", "Published to catalogue", "8 min ago", "coral"],
                ["star", "The Last Signal", "Received a 5-star review", "42 min ago", "amber"],
                ["users", "Audience milestone", "Passed 24K active viewers", "2 hrs ago", "blue"],
                ["message", "Neon Abyss", "New critic review added", "4 hrs ago", "violet"],
              ].map(([icon, title, copy, time, color]) => <div className="activity-item" key={title}>
                <span className={`activity-icon ${color}`}><Icon name={icon} size={16}/></span>
                <span><b>{title}</b><small>{copy}</small></span><time>{time}</time>
              </div>)}
            </div>
          </article>
        </section>
        </> : <WorkspacePage active={active} movies={movies} query={query} range={range} setRange={setRange} reviews={reviews} moderateReview={moderateReview} messages={messages} updateMessageStatus={updateMessageStatus} deleteMessage={deleteMessage} preferences={preferences} setPreferences={setPreferences} siteSettings={siteSettings} saveWebsite={saveWebsite} resetWebsite={resetWebsite} saved={saved} saveSettings={saveSettings} onAdd={() => openEditor()} onEdit={openEditor} onDelete={removeMovie} onDeleteAll={removeAllMovies} onRestore={restoreMovies} onImport={importData} onExport={exportData}/>}
      </div>
    </main>
    {editorOpen && <MovieEditor movie={editingMovie} onSave={saveMovie} onClose={() => { setEditorOpen(false); setEditingMovie(null); }}/>}
  </div>;
}

function MovieEditor({ movie, onSave, onClose }) {
  const [posterPreview, setPosterPreview] = useState(moviePoster(movie || {}));
  const [filePoster, setFilePoster] = useState(movie?.poster?.startsWith("data:") ? movie.poster : "");
  const [fileTrailer, setFileTrailer] = useState(movie?.trailerUrl?.startsWith("data:video/") ? movie.trailerUrl : "");
  const [trailerFileName, setTrailerFileName] = useState(movie?.trailerUrl?.startsWith("data:video/") ? "Uploaded trailer" : "");

  const handlePosterFile = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    if (file.size > 1_500_000) {
      window.alert("Please choose an image smaller than 1.5 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFilePoster(String(reader.result));
      setPosterPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleTrailerFile = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const supportedTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!supportedTypes.includes(file.type)) {
      window.alert("Choose an MP4, WebM or OGG video file.");
      event.target.value = "";
      return;
    }
    if (file.size > 2_000_000) {
      window.alert("Uploaded trailers must be smaller than 2 MB. For larger videos, paste a YouTube, Vimeo or hosted video URL.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileTrailer(String(reader.result));
      setTrailerFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const posterUrl = values.poster.trim();
    const trailerUrl = values.trailerUrl.trim();
    const videoUrl = values.videoUrl.trim();
    if (posterUrl && !/^https?:\/\//i.test(posterUrl)) {
      window.alert("Poster URL must start with http:// or https://.");
      return;
    }
    if (!fileTrailer && trailerUrl && !/^https?:\/\//i.test(trailerUrl)) {
      window.alert("Trailer URL must start with http:// or https://.");
      return;
    }
    if (videoUrl && !/^https?:\/\//i.test(videoUrl)) {
      window.alert("Full movie URL must start with http:// or https://.");
      return;
    }
    onSave({
      title: values.title.trim(),
      year: Number(values.year),
      duration: values.duration.trim(),
      genre: values.genre,
      rating: Number(values.rating),
      poster: filePoster || posterUrl,
      image: movie?.image || "",
      trailerUrl: fileTrailer || trailerUrl,
      videoUrl,
      description: values.description.trim(),
      director: values.director.trim(),
      cast: values.cast.trim(),
      status: values.status,
    });
  };

  return <div className="movie-editor-backdrop" role="dialog" aria-modal="true" aria-label={movie ? "Edit movie" : "Add movie"}>
    <form className="movie-editor" onSubmit={submit}>
      <header><div><span>{movie ? "Edit catalogue title" : "New catalogue title"}</span><h2>{movie ? movie.title : "Add a movie"}</h2></div><button type="button" onClick={onClose}>×</button></header>
      <div className="movie-editor-body">
        <aside>
          <img src={posterPreview} alt="Poster preview" onError={event => { event.currentTarget.src = "/images/movies/movie-1.webp"; }}/>
          <label className="poster-upload">Upload poster<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePosterFile}/></label>
          <small>JPG, PNG or WebP · max 1.5 MB</small>
        </aside>
        <div className="movie-fields">
          <label className="wide"><span>Movie title *</span><input name="title" defaultValue={movie?.title || ""} required/></label>
          <label><span>Release year *</span><input name="year" type="number" min="1888" max="2100" defaultValue={movie?.year || new Date().getFullYear()} required/></label>
          <label><span>Runtime *</span><input name="duration" placeholder="2h 05m" defaultValue={movie?.duration || ""} required/></label>
          <label><span>Genre *</span><select name="genre" defaultValue={movie?.genre || genres[0]}>{genres.map(genre => <option key={genre}>{genre}</option>)}</select></label>
          <label><span>Rating *</span><input name="rating" type="number" min="0" max="10" step=".1" defaultValue={movie?.rating ?? 8} required/></label>
          <label className="wide"><span>Poster URL</span><input name="poster" placeholder="https://example.com/poster.jpg" defaultValue={movie?.poster?.startsWith("data:") ? "" : movie?.poster || ""} onChange={event => { setFilePoster(""); setPosterPreview(event.target.value || moviePoster(movie || {})); }}/></label>
          <div className="wide trailer-source-field">
            <label><span>Trailer URL</span><input name="trailerUrl" type="url" placeholder="YouTube, Vimeo, .mp4, .webm or .ogg URL" defaultValue={movie?.trailerUrl?.startsWith("data:video/") ? "" : movie?.trailerUrl || ""} onChange={() => { setFileTrailer(""); setTrailerFileName(""); }}/></label>
            <div className="trailer-source-divider"><span>or</span></div>
            <label className="trailer-upload"><b>Upload trailer file</b><small>{trailerFileName || "MP4, WebM or OGG · max 2 MB"}</small><input type="file" accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg" onChange={handleTrailerFile}/></label>
            {fileTrailer && <button className="clear-trailer-file" type="button" onClick={() => { setFileTrailer(""); setTrailerFileName(""); }}>Remove uploaded file</button>}
          </div>
          <label className="wide"><span>Full movie video URL</span><input name="videoUrl" type="url" placeholder="YouTube, Vimeo, hosted .mp4, .webm or .ogg URL" defaultValue={movie?.videoUrl || ""}/><small className="field-help">Use a hosted URL for full movies. Large movie files cannot be stored directly in the browser.</small></label>
          <label className="wide"><span>Description *</span><textarea name="description" rows="4" defaultValue={movie?.description || ""} required/></label>
          <label><span>Director</span><input name="director" defaultValue={movie?.director || ""}/></label>
          <label><span>Cast</span><input name="cast" defaultValue={movie?.cast || ""}/></label>
          <label className="wide"><span>Publishing status</span><select name="status" defaultValue={movie?.status || "published"}><option value="published">Published — visible on website</option><option value="draft">Draft — admin only</option></select></label>
        </div>
      </div>
      <footer><button type="button" onClick={onClose}>Cancel</button><button className="save-movie-button">{movie ? "Save changes" : "Add movie"}</button></footer>
    </form>
  </div>;
}
