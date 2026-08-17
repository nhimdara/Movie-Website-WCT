import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useMovies from "../../hooks/useMovies";
import { validateRegistration } from "../../utils/validation";

export default function RegisterForm() {
  const { register } = useContext(AuthContext);
  const { notify } = useMovies();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const message = validateRegistration(values);
    if (message) return setError(message);
    setLoading(true);
    const result = await register(values);
    setLoading(false);
    if (!result.ok) return setError(result.message);
    setError("");
    notify("Account created. You can now sign in.");
    window.location.assign("/login");
  };
  return (
    <form className="form-grid" onSubmit={submit}>
      <Field label="Name" name="name" minLength="2" />
      <Field label="Email" name="email" type="email" />
      <Field label="Password" name="password" type="password" minLength="6" />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Creating account…" : "Create account →"}
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
