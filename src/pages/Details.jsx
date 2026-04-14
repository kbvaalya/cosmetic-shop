import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchItem, addToCart, toggleFavorite, isFavorite } from "../api/api";
import "./Details.css";

function StarRating({ rating }) {
  return (
    <div className="detail-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star star--filled" : "star"}>★</span>
      ))}
      <span className="detail-stars__val">{rating?.toFixed(1)} / 5</span>
    </div>
  );
}

export default function Details() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setItem(null);
    setError("");
    setActiveImg(0);
    fetchItem(id)
      .then((data) => {
        setItem(data);
        setFav(isFavorite(data.id));
      })
      .catch(() => setError("Не удалось загрузить товар."));
  }, [id]);

  const handleAddToCart = () => {
    if (!item) return;
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleToggleFav = () => {
    if (!item) return;
    const result = toggleFavorite(item);
    setFav(result.added);
  };

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="detail-error container">
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <Link to="/list" className="btn btn--primary">← Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page-wrapper">
        <div className="detail-loading container">
          <div className="detail-skeleton">
            <div className="detail-skeleton__gallery">
              <div className="skeleton" style={{ height: 480, borderRadius: 12 }} />
              <div className="detail-skeleton__thumbs">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 80, borderRadius: 8 }} />
                ))}
              </div>
            </div>
            <div className="detail-skeleton__info">
              <div className="skeleton" style={{ height: 14, width: "30%", marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 40, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 40, width: "60%", marginBottom: 24 }} />
              <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 32 }} />
              <div className="skeleton" style={{ height: 52, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = item.images?.length ? item.images : [item.thumbnail];
  const discountedPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);

  return (
    <div className="page-wrapper">
      <div className="detail-page container">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link to="/">Главная</Link>
          <span>›</span>
          <Link to="/list">Каталог</Link>
          <span>›</span>
          <span>{item.title}</span>
        </nav>

        <div className="detail-grid">
          {/* Gallery */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              <img
                src={images[activeImg]}
                alt={item.title}
                className="detail-gallery__img"
                key={activeImg}
              />
              {item.discountPercentage > 5 && (
                <span className="detail-badge">-{Math.round(item.discountPercentage)}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-thumb ${i === activeImg ? "detail-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${item.title} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <p className="detail-brand">{item.brand || "LUMIÈRE Beauty"}</p>
            <h1 className="detail-title">{item.title}</h1>
            <StarRating rating={item.rating} />

            <div className="detail-price-block">
              <span className="detail-price">${discountedPrice}</span>
              {item.discountPercentage > 1 && (
                <span className="detail-price-original">${item.price}</span>
              )}
            </div>

            <p className="detail-desc">{item.description}</p>

            <div className="detail-meta">
              <div className="detail-meta-row">
                <span className="detail-meta-label">Категория</span>
                <span className="detail-meta-val">{item.category}</span>
              </div>
              <div className="detail-meta-row">
                <span className="detail-meta-label">В наличии</span>
                <span className={`detail-meta-val ${item.stock > 0 ? "detail-meta-val--green" : "detail-meta-val--red"}`}>
                  {item.stock > 0 ? `${item.stock} шт.` : "Нет в наличии"}
                </span>
              </div>
              {item.sku && (
                <div className="detail-meta-row">
                  <span className="detail-meta-label">Артикул</span>
                  <span className="detail-meta-val">{item.sku}</span>
                </div>
              )}
            </div>

            <div className="detail-actions">
              <button
                className={`detail-btn-cart ${added ? "detail-btn-cart--added" : ""}`}
                onClick={handleAddToCart}
                disabled={item.stock === 0}
              >
                {added ? "✓ Добавлено в корзину" : "Добавить в корзину"}
              </button>
              <button
                className={`detail-btn-wish ${fav ? "detail-btn-wish--active" : ""}`}
                aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
                onClick={handleToggleFav}
              >
                {fav ? "♥" : "♡"}
              </button>
            </div>

            <div className="detail-perks">
              <span>✦ Бесплатная доставка от $50</span>
              <span>◈ Возврат в течение 30 дней</span>
              <span>◇ Оригинальный товар</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="detail-back">
          <Link to="/list" className="detail-back-link">← Вернуться в каталог</Link>
        </div>
      </div>
    </div>
  );
}
