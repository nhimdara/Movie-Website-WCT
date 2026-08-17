import useMovies from "../../hooks/useMovies";

function getEmbedUrl(url = "") {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com"))
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v") || parsed.pathname.split("/").at(-1)}`;
    if (parsed.hostname.includes("vimeo.com"))
      return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).at(-1)}`;
  } catch {
    return "";
  }
  return "";
}

export default function MovieTrailer() {
  const { trailer, closeTrailer } = useMovies();
  if (!trailer) return null;
  const source = trailer.playerUrl || trailer.trailerUrl || "";
  const mediaType = trailer.playerType || "Trailer";
  const embedUrl = getEmbedUrl(source);
  const isVideoFile =
    /^data:video\//i.test(source) || /\.(mp4|webm|ogg)(\?.*)?$/i.test(source);

  return (
    <div
      className="modal open"
      role="dialog"
      aria-modal="true"
      aria-label={`${trailer.title} ${mediaType.toLowerCase()}`}
      onClick={(event) =>
        event.target === event.currentTarget && closeTrailer()
      }
    >
      <div className="modal-box trailer-modal-box">
        <button
          className="modal-close"
          onClick={closeTrailer}
          aria-label="Close trailer"
        >
          ×
        </button>
        {embedUrl && (
          <iframe
            src={embedUrl}
            title={`${trailer.title} ${mediaType.toLowerCase()}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
        {!embedUrl && isVideoFile && <video src={source} controls autoPlay />}
        {!embedUrl && !isVideoFile && (
          <div className="trailer-fallback">
            <span>▶</span>
            <h3>{trailer.title}</h3>
            <p>
              {source
                ? `Open this ${mediaType.toLowerCase()} using the link below.`
                : `No ${mediaType.toLowerCase()} has been added for this title yet.`}
            </p>
            {source && (
              <a href={source} target="_blank" rel="noreferrer">
                Open {mediaType.toLowerCase()} ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
