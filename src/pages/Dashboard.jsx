import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchItems } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`dash-stat ${accent ? "dash-stat--accent" : ""}`}>
      <div className="dash-stat__icon">{icon}</div>
      <div className="dash-stat__info">
        <p className="dash-stat__val">{value}</p>
        <p className="dash-stat__label">{label}</p>
        {sub && <p className="dash-stat__sub">{sub}</p>}
      </div>
    </div>
  );
}

function MiniCard({ item }) {
  return (
    <Link to={`/details/${item.id}`} className="dash-mini-card">
      <div className="dash-mini-card__img-wrap">
        {item.thumbnail
          ? <img src={item.thumbnail} alt={item.title} className="dash-mini-card__img" loading="lazy" />
          : <div className="dash-mini-card__placeholder">✿</div>}
      </div>
      <div className="dash-mini-card__body">
        <p className="dash-mini-card__brand">{item.brand || "LUMIÈRE"}</p>
        <p className="dash-mini-card__title">{item.title}</p>
        <p className="dash-mini-card__price">${item.price}</p>
      </div>
      <span className="dash-mini-card__arrow">→</span>
    </Link>
  );
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems()
      .then(setProducts)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const avgPrice = products.length
    ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)
    : "—";
  const topRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  const categories = [...new Set(products.map((p) => p.category))];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";

  return (
    <div className="dash-page page-wrapper">
      <div className="dash-bg">
        <div className="dash-blob dash-blob--1" />
        <div className="dash-blob dash-blob--2" />
      </div>

      <div className="container dash-container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">{greeting},</p>
            <h1 className="dash-title">
              {user?.name} <span className="dash-title__wave">✦</span>
            </h1>
            <p className="dash-sub">
              {isAdmin ? "Панель управления магазином LUMIÈRE" : "Ваш личный дашборд"}
            </p>
          </div>
          <div className="dash-header__actions">
            <Link to="/list" className="dash-btn dash-btn--ghost">Каталог →</Link>
            {isAdmin && <Link to="/create" className="dash-btn dash-btn--primary">＋ Добавить товар</Link>}
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <StatCard icon="◈" label="Товаров в каталоге" value={loading ? "—" : products.length} sub="Из локального каталога" accent />
          <StatCard icon="♡" label="Категорий" value={loading ? "—" : categories.length} />
          <StatCard icon="✦" label="Средняя цена" value={loading ? "—" : `$${avgPrice}`} />
          <StatCard icon="◇" label="Единиц на складе" value={loading ? "—" : totalStock.toLocaleString()} />
        </div>

        <div className="dash-grid">
          {/* Recent products */}
          <section className="dash-section">
            <div className="dash-section__head">
              <h2 className="dash-section__title">Топ по рейтингу</h2>
              <Link to="/list" className="dash-section__link">Все товары →</Link>
            </div>
            {loading ? (
              <div className="dash-mini-skeleton">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="dash-mini-skel-item">
                    <div className="skeleton" style={{ height: 56, width: 56, borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 11, width: "40%", marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 14, marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 11, width: "25%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dash-mini-list">
                {topRated.map(item => <MiniCard key={item.id} item={item} />)}
              </div>
            )}
          </section>

          {/* Right column */}
          <div className="dash-aside">
            {/* Quick actions */}
            <section className="dash-section">
              <h2 className="dash-section__title">Быстрые действия</h2>
              <div className="dash-actions">
                <Link to="/list" className="dash-action">
                  <span className="dash-action__icon">◈</span>
                  <div>
                    <p className="dash-action__label">Каталог товаров</p>
                    <p className="dash-action__desc">Просмотр и поиск</p>
                  </div>
                </Link>
                <Link to="/profile" className="dash-action">
                  <span className="dash-action__icon">✦</span>
                  <div>
                    <p className="dash-action__label">Мой профиль</p>
                    <p className="dash-action__desc">Настройки аккаунта</p>
                  </div>
                </Link>
                {isAdmin && (
                  <>
                    <Link to="/create" className="dash-action dash-action--admin">
                      <span className="dash-action__icon">＋</span>
                      <div>
                        <p className="dash-action__label">Добавить товар</p>
                        <p className="dash-action__desc">Создать новый продукт</p>
                      </div>
                    </Link>
                    <Link to="/admin" className="dash-action dash-action--admin">
                      <span className="dash-action__icon">⚙</span>
                      <div>
                        <p className="dash-action__label">Панель администратора</p>
                        <p className="dash-action__desc">Управление магазином</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </section>

            {/* Categories */}
            {!loading && (
              <section className="dash-section">
                <h2 className="dash-section__title">Категории</h2>
                <div className="dash-categories">
                  {categories.map(cat => (
                    <Link key={cat} to={`/list?category=${cat}`} className="dash-category-tag">
                      {cat}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
