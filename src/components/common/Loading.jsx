import useLanguage from "../../hooks/useLanguage";

export default function Loading() {
  const { t } = useLanguage();
  return (
    <div className="empty-state" role="status">
      <b>{t("loading", "Loading CineVault…")}</b>
      <p>{t("preparing", "Preparing the collection.")}</p>
    </div>
  );
}
