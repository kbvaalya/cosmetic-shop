import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import "./Form.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, username, password, confirmPassword } = form;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await registerUser({ firstName, lastName, email, username, password });
      setSuccess("Аккаунт создан! Перенаправляем на страницу входа...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || "Ошибка регистрации. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-page__bg">
        <div className="form-page__blob form-page__blob--1" />
        <div className="form-page__blob form-page__blob--2" />
      </div>

      <div className="form-card form-card--wide">
        <p className="form-card__eyebrow">LUMIÈRE Beauty</p>
        <h1 className="form-card__title">Регистрация</h1>
        <p className="form-card__sub">Создайте аккаунт и откройте мир красоты</p>

        {error && (
          <div className="form-error">
            <span className="form-error__icon">!</span>
            {error}
          </div>
        )}
        {success && (
          <div className="form-success">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <div className="form-group__row">
              <div>
                <label className="form-label" htmlFor="firstName">Имя</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-input"
                  placeholder="Анна"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="lastName">Фамилия</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-input"
                  placeholder="Смирнова"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="anna@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Логин</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="anna_beauty"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <div className="form-group__row">
              <div>
                <label className="form-label" htmlFor="password">Пароль</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <p className="form-hint">Минимум 6 символов</p>
              </div>
              <div>
                <label className="form-label" htmlFor="confirmPassword">Подтверждение</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`form-submit ${loading ? "form-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Создаём аккаунт..." : "Создать аккаунт"}
          </button>
        </form>

        <div className="form-divider">или</div>

        <p className="form-alt-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
