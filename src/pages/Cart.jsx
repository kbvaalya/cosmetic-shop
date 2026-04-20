import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, updateCartQty, placeOrder } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

/* ─── Checkout Modal ───────────────────────────────────── */
function CheckoutModal({ cart, total, onClose, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep]           = useState("choose");   // "choose" | "form" | "done"
  const [deliveryType, setType]   = useState("");         // "delivery" | "pickup"
  const [address, setAddress]     = useState("");
  const [pickupDate, setDate]     = useState("");
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (deliveryType === "delivery" && !address.trim())
      e.address = "Введите адрес доставки";
    if (deliveryType === "pickup" && !pickupDate)
      e.pickupDate = "Выберите дату самовывоза";
    if (deliveryType === "pickup" && pickupDate) {
      const chosen = new Date(pickupDate);
      const today  = new Date(); today.setHours(0,0,0,0);
      if (chosen < today) e.pickupDate = "Выберите дату не раньше сегодня";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const delivery =
        deliveryType === "delivery"
          ? { type: "delivery", address: address.trim() }
          : { type: "pickup", pickupDate };
      const order = placeOrder({ user, cart, delivery });
      setStep("done");
      onSuccess(order);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Step: choose type ── */}
        {step === "choose" && (
          <>
            <button className="checkout-modal__close" onClick={onClose}>✕</button>
            <p className="checkout-modal__eyebrow">Шаг 1 из 2</p>
            <h2 className="checkout-modal__title">Способ получения</h2>
            <p className="checkout-modal__sub">
              Итого к оплате: <strong>${total}</strong>
              &nbsp;·&nbsp;{cart.reduce((s,c)=>s+(c.qty||1),0)} товар(а)
            </p>

            <div className="checkout-choice">
              <button
                className={`checkout-choice__btn ${deliveryType === "delivery" ? "checkout-choice__btn--active" : ""}`}
                onClick={() => setType("delivery")}
              >
                <span className="checkout-choice__icon">🚚</span>
                <div>
                  <p className="checkout-choice__label">Доставка</p>
                  <p className="checkout-choice__desc">Курьером до вашего адреса</p>
                </div>
                <span className="checkout-choice__check">{deliveryType === "delivery" ? "●" : "○"}</span>
              </button>

              <button
                className={`checkout-choice__btn ${deliveryType === "pickup" ? "checkout-choice__btn--active" : ""}`}
                onClick={() => setType("pickup")}
              >
                <span className="checkout-choice__icon">🏪</span>
                <div>
                  <p className="checkout-choice__label">Самовывоз</p>
                  <p className="checkout-choice__desc">Забрать из нашего магазина</p>
                </div>
                <span className="checkout-choice__check">{deliveryType === "pickup" ? "●" : "○"}</span>
              </button>
            </div>

            <button
              className="checkout-modal__next-btn"
              disabled={!deliveryType}
              onClick={() => deliveryType && setStep("form")}
            >
              Далее →
            </button>
          </>
        )}

        {/* ── Step: fill details ── */}
        {step === "form" && (
          <>
            <button className="checkout-modal__close" onClick={onClose}>✕</button>
            <button className="checkout-modal__back" onClick={() => setStep("choose")}>← Назад</button>
            <p className="checkout-modal__eyebrow">Шаг 2 из 2</p>
            <h2 className="checkout-modal__title">
              {deliveryType === "delivery" ? "Адрес доставки" : "Дата самовывоза"}
            </h2>

            {deliveryType === "delivery" && (
              <div className="checkout-field">
                <label className="checkout-field__label">Адрес доставки *</label>
                <textarea
                  className={`checkout-field__input checkout-field__textarea ${errors.address ? "checkout-field__input--err" : ""}`}
                  placeholder="Город, улица, дом, квартира…"
                  rows={3}
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors({}); }}
                />
                {errors.address && <p className="checkout-field__err">{errors.address}</p>}
                <p className="checkout-field__hint">Доставка от 1 до 3 рабочих дней</p>
              </div>
            )}

            {deliveryType === "pickup" && (
              <div className="checkout-field">
                <label className="checkout-field__label">Дата самовывоза *</label>
                <input
                  type="date"
                  className={`checkout-field__input ${errors.pickupDate ? "checkout-field__input--err" : ""}`}
                  min={today}
                  value={pickupDate}
                  onChange={(e) => { setDate(e.target.value); setErrors({}); }}
                />
                {errors.pickupDate && <p className="checkout-field__err">{errors.pickupDate}</p>}
                <p className="checkout-field__hint">Магазин работает ежедневно с 10:00 до 21:00</p>
              </div>
            )}

            {/* Order summary */}
            <div className="checkout-summary">
              <p className="checkout-summary__title">Состав заказа</p>
              {cart.map((item) => (
                <div key={item.id} className="checkout-summary__row">
                  <span className="checkout-summary__name">{item.title}</span>
                  <span className="checkout-summary__qty">×{item.qty||1}</span>
                  <span className="checkout-summary__price">${(item.price*(item.qty||1)).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-summary__total">
                <span>Итого</span>
                <strong>${total}</strong>
              </div>
            </div>

            <button
              className="checkout-modal__submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Оформляем…" : "✓ Подтвердить заказ"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Cart Page ────────────────────────────────────────── */
export default function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [cart, setCart]             = useState(() => getCart());
  const [showCheckout, setCheckout] = useState(false);
  const [placedOrder, setPlaced]    = useState(null);

  const handleQty = (id, delta) => {
    const item = cart.find((c) => String(c.id) === String(id));
    if (!item) return;
    setCart(updateCartQty(id, (item.qty || 1) + delta));
  };

  const handleRemove = (id) => setCart(removeFromCart(id));

  const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);

  const handleOrderSuccess = (order) => {
    setCart([]);
    setPlaced(order);
    setCheckout(false);
  };

  /* ── Success screen ── */
  if (placedOrder) {
    const isPickup = placedOrder.delivery.type === "pickup";
    return (
      <div className="cart-page page-wrapper">
        <div className="cart-page__bg">
          <div className="cart-blob cart-blob--1" />
          <div className="cart-blob cart-blob--2" />
        </div>
        <div className="container cart-container">
          <div className="cart-success">
            <div className="cart-success__icon">✓</div>
            <h2 className="cart-success__title">Заказ оформлен!</h2>
            <p className="cart-success__id">#{placedOrder.id}</p>
            <div className="cart-success__detail">
              {isPickup ? (
                <>
                  <span className="cart-success__badge">🏪 Самовывоз</span>
                  <p>Дата получения: <strong>{new Date(placedOrder.delivery.pickupDate).toLocaleDateString("ru-RU", {day:"numeric",month:"long",year:"numeric"})}</strong></p>
                </>
              ) : (
                <>
                  <span className="cart-success__badge">🚚 Доставка</span>
                  <p>Адрес: <strong>{placedOrder.delivery.address}</strong></p>
                </>
              )}
              <p className="cart-success__total">Сумма заказа: <strong>${placedOrder.total}</strong></p>
            </div>
            <p className="cart-success__note">Уведомление отправлено администратору магазина</p>
            <div className="cart-success__actions">
              <button className="cart-success__btn" onClick={() => navigate("/list")}>Продолжить покупки</button>
              <button className="cart-success__btn cart-success__btn--ghost" onClick={() => navigate("/dashboard")}>Мой дашборд</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="cart-page__bg">
        <div className="cart-blob cart-blob--1" />
        <div className="cart-blob cart-blob--2" />
      </div>

      <div className="container cart-container">
        <div className="cart-header">
          <p className="cart-eyebrow">Ваш выбор</p>
          <h1 className="cart-title">Корзина <em>покупок</em></h1>
          <p className="cart-sub">
            {cart.length
              ? `${cart.length} ${cart.length === 1 ? "товар" : cart.length < 5 ? "товара" : "товаров"} в корзине`
              : "Корзина пуста"}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty__icon">🛒</span>
            <p className="cart-empty__text">В вашей корзине пока ничего нет</p>
            <Link to="/list" className="cart-empty__btn">Перейти в каталог →</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <Link to={`/details/${item.id}`} className="cart-item__img-wrap">
                    {item.thumbnail
                      ? <img src={item.thumbnail} alt={item.title} className="cart-item__img" />
                      : <div className="cart-item__placeholder">✿</div>}
                  </Link>

                  <div className="cart-item__info">
                    <p className="cart-item__brand">{item.brand || "LUMIÈRE"}</p>
                    <Link to={`/details/${item.id}`} className="cart-item__title">{item.title}</Link>
                    <p className="cart-item__category">{item.category}</p>
                  </div>

                  <div className="cart-item__qty">
                    <button className="cart-qty-btn" onClick={() => handleQty(item.id, -1)} disabled={item.qty <= 1}>−</button>
                    <span className="cart-qty-val">{item.qty || 1}</span>
                    <button className="cart-qty-btn" onClick={() => handleQty(item.id, 1)}>+</button>
                  </div>

                  <div className="cart-item__price">
                    <span className="cart-item__price-total">${(item.price * (item.qty || 1)).toFixed(2)}</span>
                    {(item.qty || 1) > 1 && (
                      <span className="cart-item__price-each">${item.price} × {item.qty}</span>
                    )}
                  </div>

                  <button className="cart-item__remove" onClick={() => handleRemove(item.id)} title="Удалить из корзины">✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Товаров:</span>
                <span>{cart.reduce((s, c) => s + (c.qty || 1), 0)} шт.</span>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Итого:</span>
                <span className="cart-summary__total">${total.toFixed(2)}</span>
              </div>
              {total >= 50 && (
                <p className="cart-summary__perk">✦ Бесплатная доставка включена</p>
              )}
              <button
                className="cart-checkout-btn"
                onClick={() => isLoggedIn ? setCheckout(true) : navigate("/login")}
              >
                Оформить заказ →
              </button>
              <Link to="/list" className="cart-continue-link">← Продолжить покупки</Link>
            </div>
          </>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={total.toFixed(2)}
          onClose={() => setCheckout(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}
