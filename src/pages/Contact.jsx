import ContactForm from "../components/forms/ContactForm";
import useMovies from "../hooks/useMovies";

export default function Contact() {
  const { siteSettings } = useMovies();
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">Start a conversation</span><h1>{siteSettings.contactHeading}</h1><p>{siteSettings.contactCopy}</p></header>
    <section className="split-page contact-layout"><div className="contact-details"><span className="eyebrow">Get in touch</span><h2>We’d love to<br />hear from you.</h2><p>{siteSettings.contactCopy}</p><div className="contact-line"><small>Email</small><a href={`mailto:${siteSettings.contactEmail}`}>{siteSettings.contactEmail} ↗</a></div><div className="contact-line"><small>Based in</small><span>{siteSettings.location}</span></div></div><div className="content-card"><ContactForm /></div></section>
  </div></main>;
}
