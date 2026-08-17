import { useState } from "react";
import useMovies from "../../hooks/useMovies";
import useLanguage from "../../hooks/useLanguage";
import { validateContact } from "../../utils/validation";

export default function ContactForm() {
  const { sendMessage } = useMovies();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const message = validateContact(values);
    if (message) return setError(message);
    setError("");
    sendMessage(values);
    event.currentTarget.reset();
  };
  return (
    <form className="form-grid" onSubmit={submit}>
      <Field label={t("name", "Name")} name="name" minLength="2" />
      <Field label="Email" name="email" type="email" />
      <div className="form-group">
        <label htmlFor="message">{t("message", "Message")}</label>
        <textarea id="message" name="message" required minLength="10" />
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary">
        {t("sendMessage", "Send message")} →
      </button>
    </form>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{label}</label>
      <input id={props.name} required {...props} />
    </div>
  );
}
