import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Input change handler ──
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const res = await loginUser(formData);

      // Backend se { user, token } expect kar rahe hain
      const { user, token } = res.data;

      login(user, token);     // AuthContext mein save — yahi context update hota hai
      navigate("/");           // Home page pe bhejo
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid email or password"
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

        <h1 className="auth-card__title">Sign in to your account</h1>

        {serverError && <p className="auth-card__server-error">{serverError}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
              className={errors.password ? "auth-form__input--error" : ""}
            />
            {errors.password && <span className="auth-form__error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;