import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Form.css";

export default function Login() {
  const navigate = useNavigate();
  const { loginAsAdmin, loginAsUser } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }
    setLoading(true);
    setError("");

    // Сначала проверяем — вдруг это администратор
    const isAdmin = loginAsAdmin(form.username, form.password);
    if (isAdmin) {
      setSuccess("Добро пожаловать, Администратор! Перенаправляем...");
      setTimeout(() => navigate("/dashboard"), 1200);
      setLoading(false);
      return;
    }

    // Обычный пользователь — идём в API
    try {
      const data = await loginUser(form);
      loginAsUser(data);
      setSuccess(`Добро пожаловать, ${data.firstName}! Перенаправляем...`);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Неверный логин или пароль.");
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

      <div className="form-card">
        <p className="form-card__eyebrow">Добро пожаловать</p>
        <h1 className="form-card__title">Войти в <em>аккаунт</em></h1>

        {error && (
          <div className="form-error">
            <span className="form-error__icon">!</span>
            {error}
          </div>
        )}
        {success && (
          <div className="form-success">✓ {success}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Логин</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Введите логин"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`form-submit ${loading ? "form-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="form-divider">или</div>

        <p className="form-alt-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
