import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-page">
      <div className="nf-bg">
        <div className="nf-blob nf-blob--1" />
        <div className="nf-blob nf-blob--2" />
      </div>

      <div className="nf-content">
        <p className="nf-code">404</p>
        <div className="nf-ornament">✦ ◈ ✦</div>
        <h1 className="nf-title">Страница <em>не найдена</em></h1>
        <p className="nf-desc">
          Похоже, эта страница исчезла, как аромат духов на ветру.
          Возможно, она была перемещена или никогда не существовала.
        </p>
        <div className="nf-actions">
          <button className="nf-btn nf-btn--ghost" onClick={() => navigate(-1)}>
            ← Назад
          </button>
          <Link to="/" className="nf-btn nf-btn--primary">
            На главную
          </Link>
          <Link to="/list" className="nf-btn nf-btn--ghost">
            Каталог →
          </Link>
        </div>
        <div className="nf-links">
          <Link to="/login">Войти</Link>
          <span>·</span>
          <Link to="/dashboard">Дашборд</Link>
          <span>·</span>
          <Link to="/profile">Профиль</Link>
        </div>
      </div>
    </div>
  );
}
