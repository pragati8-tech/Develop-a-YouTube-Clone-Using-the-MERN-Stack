import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
// import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Input change handler ──
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Type karte hi error hat jaaye
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      await registerUser(formData);
      // Assignment requirement: success ke baad login page pe redirect
      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-card__logo">
          ▶️ YouTube
        </Link>

        <h1 className="auth-card__title">Create your account</h1>

        {serverError && <p className="auth-card__server-error">{serverError}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="JohnDoe"
              className={errors.username ? "auth-form__input--error" : ""}
            />
            {errors.username && <span className="auth-form__error">{errors.username}</span>}
          </div>

          <div className="auth-form__group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={errors.email ? "auth-form__input--error" : ""}
            />
            {errors.email && <span className="auth-form__error">{errors.email}</span>}
          </div>

          <div className="auth-form__group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={errors.password ? "auth-form__input--error" : ""}
            />
            {errors.password && <span className="auth-form__error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;