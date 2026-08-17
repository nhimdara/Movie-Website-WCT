import ContactForm from "../components/forms/ContactForm";
import useMovies from "../hooks/useMovies";
import useLanguage from "../hooks/useLanguage";

export default function Contact() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();
  return (
    <main className="page-shell">
      <div className="container">
        <header className="page-intro">
          <span className="eyebrow">
            {t("startConversation", "Start a conversation")}
          </span>
          <h1>{t("contactHeading", siteSettings.contactHeading)}</h1>
          <p>{t("contactCopy", siteSettings.contactCopy)}</p>
        </header>
        <section className="split-page contact-layout">
          <div className="contact-details">
            <span className="eyebrow">{t("getInTouch", "Get in touch")}</span>
            <h2>{t("loveToHear", "We’d love to hear from you.")}</h2>
            <p>{t("contactCopy", siteSettings.contactCopy)}</p>
            <div className="contact-line">
              <small>Email</small>
              <a href={`mailto:${siteSettings.contactEmail}`}>
                {siteSettings.contactEmail} ↗
              </a>
            </div>
            <div className="contact-line">
              <small>{t("basedIn", "Based in")}</small>
              <span>{siteSettings.location}</span>
            </div>
          </div>
          <div className="content-card">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
