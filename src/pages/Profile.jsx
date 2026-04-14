import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFavorites, toggleFavorite } from "../api/api";
import "./Profile.css";

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => getFavorites());

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRemoveFav = (product) => {
    const result = toggleFavorite(product);
    setFavorites(result.favorites);
  };

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page page-wrapper">
      <div className="profile-page__bg">
        <div className="profile-blob profile-blob--1" />
        <div className="profile-blob profile-blob--2" />
      </div>

      <div className="container">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className={`profile-avatar ${isAdmin ? "profile-avatar--admin" : ""}`}>
              <span className="profile-avatar__initials">{initials}</span>
              {isAdmin && <span className="profile-avatar__crown">✦</span>}
            </div>
            <div className="profile-header__info">
              <p className={`profile-role-badge ${isAdmin ? "profile-role-badge--admin" : ""}`}>
                {isAdmin ? "✦ Администратор" : "◈ Пользователь"}
              </p>
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-username">@{user?.username}</p>
            </div>
          </div>

          <div className="profile-divider" />

          {/* Details */}
          <div className="profile-section">
            <h2 className="profile-section__title">Информация об аккаунте</h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-item__label">Имя</span>
                <span className="profile-info-item__val">{user?.name}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-item__label">Логин</span>
                <span className="profile-info-item__val">@{user?.username}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-item__label">Роль</span>
                <span className={`profile-info-item__val ${isAdmin ? "profile-info-item__val--admin" : ""}`}>
                  {isAdmin ? "Администратор" : "Пользователь"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-item__label">Статус</span>
                <span className="profile-info-item__val profile-info-item__val--active">● Активен</span>
              </div>
            </div>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <>
              <div className="profile-divider" />
              <div className="profile-section">
                <h2 className="profile-section__title">Панель администратора</h2>
                <div className="profile-admin-actions">
                  <button
                    className="profile-admin-btn"
                    onClick={() => navigate("/create")}
                  >
                    <span className="profile-admin-btn__icon">＋</span>
                    <div>
                      <p className="profile-admin-btn__title">Добавить товар</p>
                      <p className="profile-admin-btn__desc">Создать новый продукт в каталоге</p>
                    </div>
                  </button>
                  <button
                    className="profile-admin-btn"
                    onClick={() => navigate("/admin")}
                  >
                    <span className="profile-admin-btn__icon">⚙</span>
                    <div>
                      <p className="profile-admin-btn__title">Панель администратора</p>
                      <p className="profile-admin-btn__desc">Управление товарами каталога</p>
                    </div>
                  </button>
                  <button
                    className="profile-admin-btn"
                    onClick={() => navigate("/dashboard")}
                  >
                    <span className="profile-admin-btn__icon">◈</span>
                    <div>
                      <p className="profile-admin-btn__title">Дашборд</p>
                      <p className="profile-admin-btn__desc">Статистика и обзор магазина</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Favorites section */}
          {!isAdmin && (
            <>
              <div className="profile-divider" />
              <div className="profile-section">
                <h2 className="profile-section__title">
                  Избранное
                  {favorites.length > 0 && (
                    <span className="profile-fav-count">{favorites.length}</span>
                  )}
                </h2>

                {favorites.length === 0 ? (
                  <div className="profile-fav-empty">
                    <span className="profile-fav-empty__icon">♡</span>
                    <p className="profile-fav-empty__text">
                      У вас пока нет избранных товаров
                    </p>
                    <Link to="/list" className="profile-fav-empty__link">
                      Перейти в каталог →
                    </Link>
                  </div>
                ) : (
                  <div className="profile-fav-grid">
                    {favorites.map((item) => (
                      <div key={item.id} className="profile-fav-card">
                        <Link to={`/details/${item.id}`} className="profile-fav-card__img-wrap">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="profile-fav-card__img" />
                          ) : (
                            <div className="profile-fav-card__placeholder">✿</div>
                          )}
                        </Link>
                        <div className="profile-fav-card__body">
                          <p className="profile-fav-card__brand">{item.brand || "LUMIÈRE"}</p>
                          <Link to={`/details/${item.id}`} className="profile-fav-card__title">
                            {item.title}
                          </Link>
                          <p className="profile-fav-card__price">${item.price}</p>
                        </div>
                        <button
                          className="profile-fav-card__remove"
                          onClick={() => handleRemoveFav(item)}
                          title="Убрать из избранного"
                        >
                          ♥
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Quick links for user */}
          {!isAdmin && (
            <>
              <div className="profile-divider" />
              <div className="profile-section">
                <h2 className="profile-section__title">Быстрые действия</h2>
                <div className="profile-admin-actions">
                  <button
                    className="profile-admin-btn"
                    onClick={() => navigate("/cart")}
                  >
                    <span className="profile-admin-btn__icon">🛒</span>
                    <div>
                      <p className="profile-admin-btn__title">Корзина</p>
                      <p className="profile-admin-btn__desc">Просмотрите ваши покупки</p>
                    </div>
                  </button>
                  <button
                    className="profile-admin-btn"
                    onClick={() => navigate("/dashboard")}
                  >
                    <span className="profile-admin-btn__icon">◈</span>
                    <div>
                      <p className="profile-admin-btn__title">Дашборд</p>
                      <p className="profile-admin-btn__desc">Ваш персональный обзор</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="profile-divider" />

          {/* Footer actions */}
          <div className="profile-footer">
            <button className="profile-btn profile-btn--secondary" onClick={() => navigate(-1)}>
              ← Назад
            </button>
            <button className="profile-btn profile-btn--logout" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
