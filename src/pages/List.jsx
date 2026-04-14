import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchItems, deleteProduct } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./List.css";

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star star--filled" : "star"}>★</span>
      ))}
      <span className="rating-value">{rating?.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ item, index, isLocal, isAdmin, onDelete }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      if (!isLocal && item.id) await deleteProduct(item.id);
      onDelete(item.id ?? `local-${index}`);
    } catch {
      setDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${item.id ?? `local-${index}`}`);
  };

  return (
    <div
      className={`product-card ${isLocal ? "product-card--local" : ""}`}
      style={{ animationDelay: `${index * 0.06}s`, position: "relative" }}
    >
      {isAdmin && (
        <div className="product-card__admin-bar">
          <button
            className="product-card__admin-btn product-card__admin-btn--edit"
            onClick={handleEdit}
            title="Редактировать"
          >✎</button>
          <button
            className={`product-card__admin-btn product-card__admin-btn--delete ${confirmDelete ? "product-card__admin-btn--confirm" : ""}`}
            onClick={handleDelete}
            disabled={deleting}
            title={confirmDelete ? "Нажмите ещё раз для подтверждения" : "Удалить"}
          >
            {deleting ? "…" : confirmDelete ? "Удалить?" : "✕"}
          </button>
        </div>
      )}

      <Link
        to={isLocal ? "#" : `/details/${item.id}`}
        className="product-card__link-area"
        onClick={isLocal ? (e) => e.preventDefault() : undefined}
      >
        <div className="product-card__img-wrap">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="product-card__img" loading="lazy" />
          ) : (
            <div className="product-card__img-placeholder">✿</div>
          )}
          <div className="product-card__overlay">
            <span className="product-card__cta">{isLocal ? "Новинка" : "Подробнее"}</span>
          </div>
          {isLocal && <span className="product-card__badge product-card__badge--new">NEW</span>}
          {!isLocal && item.discountPercentage > 10 && (
            <span className="product-card__badge">-{Math.round(item.discountPercentage)}%</span>
          )}
        </div>
        <div className="product-card__body">
          <p className="product-card__brand">{item.brand || "LUMIÈRE"}</p>
          <h3 className="product-card__title">{item.title}</h3>
          {item.rating && <StarRating rating={item.rating} />}
          <div className="product-card__footer">
            <span className="product-card__price">${item.price || "—"}</span>
            <span className="product-card__tag">{item.category || "beauty"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="product-card product-card--skeleton">
      <div className="skeleton" style={{ height: 240 }} />
      <div className="product-card__body">
        <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 18, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 16, width: "30%" }} />
      </div>
    </div>
  );
}

export default function List({ localProducts = [] }) {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchItems()
      .then(setData)
      .catch(() => setError("Не удалось загрузить товары. Проверьте соединение с интернетом."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (idToRemove) => {
    setDeletedIds((prev) => new Set([...prev, String(idToRemove)]));
  };

  const allProducts = [...localProducts, ...data];
  const visible = allProducts.filter((p) => !deletedIds.has(String(p.id ?? "")));
  const categories = ["all", ...new Set(visible.map((p) => p.category).filter(Boolean))];

  let filtered = visible.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="page-wrapper">
      <div className="list-page container">
        <div className="list-page__header">
          <p className="list-page__eyebrow">Коллекция</p>
          <h1 className="list-page__title">Каталог <em>косметики</em></h1>
          <p className="list-page__subtitle">
            {loading ? "" : `${visible.length} продуктов в наличии`}
          </p>
        </div>

        {!loading && !error && (
          <div className="list-page__controls">
            <div className="list-page__search-wrap">
              <input
                className="list-page__search"
                type="text"
                placeholder="Поиск по названию или бренду..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="list-page__search-icon">⌕</span>
            </div>
            <select
              className="list-page__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Сортировка</option>
              <option value="name">По названию А-Я</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        )}

        {!loading && !error && (
          <div className="list-page__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`list-page__filter-btn ${category === cat ? "list-page__filter-btn--active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "all" ? "Все" : cat}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="list-page__error">
            <span className="list-page__error-icon">✕</span>
            <p>{error}</p>
          </div>
        )}

        <div className="product-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
            ? filtered.map((item, i) => {
                const isLocal = !item.id || localProducts.includes(item);
                return (
                  <ProductCard
                    key={item.id ?? `local-${i}`}
                    item={item}
                    index={i}
                    isLocal={isLocal}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                  />
                );
              })
            : (
              <div className="list-page__empty">
                <p>{search || category !== "all" ? "По вашему запросу ничего не найдено" : "Каталог пуст"}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
