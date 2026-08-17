import useLanguage from "../hooks/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="page-shell">
      <div className="container">
        <div className="empty-state">
          <b>404 — {t("sceneNotFound", "Scene not found")}</b>
          <p>
            {t(
              "pageMissing",
              "The page you requested is outside our collection.",
            )}
          </p>
          <a className="btn btn-primary" href="/">
            {t("returnHome", "Return home")}
          </a>
        </div>
      </div>
    </main>
  );
}
