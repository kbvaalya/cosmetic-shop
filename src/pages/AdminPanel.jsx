import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchItems, deleteProduct, getAdminNotifications, markNotificationsRead } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./AdminPanel.css";

function ConfirmModal({ product, onConfirm, onCancel, deleting }) {
  return (
    <div className="ap-modal-overlay" onClick={onCancel}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__icon">✕</div>
        <h3 className="ap-modal__title">Удалить товар?</h3>
        <p className="ap-modal__desc">
          Вы уверены, что хотите удалить <strong>«{product?.title}»</strong>?
          Это действие нельзя отменить.
        </p>
        <div className="ap-modal__actions">
          <button className="ap-modal__btn ap-modal__btn--cancel" onClick={onCancel} disabled={deleting}>Отмена</button>
          <button className="ap-modal__btn ap-modal__btn--confirm" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Удаляем..." : "Да, удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Notification Card ──────────────────────────────────── */
function NotifCard({ notif }) {
  const [open, setOpen] = useState(false);
  const isPickup = notif.delivery?.type === "pickup";

  return (
    <div className={`ap-notif ${notif.read ? "ap-notif--read" : "ap-notif--new"}`}>
      <div className="ap-notif__top" onClick={() => setOpen(!open)}>
        <div className="ap-notif__left">
          {!notif.read && <span className="ap-notif__dot" />}
          <span className="ap-notif__icon">{isPickup ? "🏪" : "🚚"}</span>
          <div>
            <p className="ap-notif__user">
              <strong>{notif.userName}</strong>
              <span className="ap-notif__tag">{isPickup ? "Самовывоз" : "Доставка"}</span>
            </p>
            <p className="ap-notif__meta">
              {notif.orderId} · {notif.itemsCount} товар(а) · <strong>${notif.total}</strong>
            </p>
            <p className="ap-notif__date">{notif.date}</p>
          </div>
        </div>
        <button className="ap-notif__toggle">{open ? "▲" : "▼"}</button>
      </div>

      {open && (
        <div className="ap-notif__body">
          <div className="ap-notif__delivery">
            {isPickup ? (
              <>
                <span className="ap-notif__delivery-label">📅 Дата самовывоза:</span>
                <strong>{new Date(notif.delivery.pickupDate).toLocaleDateString("ru-RU", {day:"numeric",month:"long",year:"numeric"})}</strong>
              </>
            ) : (
              <>
                <span className="ap-notif__delivery-label">📍 Адрес доставки:</span>
                <strong>{notif.delivery.address}</strong>
              </>
            )}
          </div>

          <p className="ap-notif__items-title">Состав заказа:</p>
          <div className="ap-notif__items">
            {notif.items.map((item, i) => (
              <div key={i} className="ap-notif__item">
                <span className="ap-notif__item-name">{item.title}</span>
                <span className="ap-notif__item-qty">×{item.qty}</span>
                <span className="ap-notif__item-price">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="ap-notif__total">
            <span>Итого заказа</span>
            <strong>${notif.total}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Admin Panel ────────────────────────────────────────── */
export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [sortBy, setSortBy]         = useState("default");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [notifications, setNotifs]  = useState([]);
  const [notifsOpen, setNotifsOpen] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    fetchItems()
      .then(setProducts)
      .catch(() => setError("Не удалось загрузить товары."))
      .finally(() => setLoading(false));

    // Load notifications
    const notifs = getAdminNotifications();
    setNotifs(notifs);
    // Mark as read after 2 s (give time to notice badge first)
    const timer = setTimeout(() => {
      markNotificationsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      // Trigger navbar re-render
      window.dispatchEvent(new Event("lumiere_notif_read"));
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setSuccessMsg(`«${deleteTarget.title}» удалён из каталога.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch {
      setError("Ошибка при удалении.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  let filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase())
  );
  if (sortBy === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name")       filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "rating")     filtered = [...filtered].sort((a, b) => (b.rating||0) - (a.rating||0));

  const stats = {
    total:      products.length,
    avgPrice:   products.length ? (products.reduce((s,p)=>s+p.price,0)/products.length).toFixed(2) : "—",
    categories: new Set(products.map((p)=>p.category)).size,
    totalStock: products.reduce((s,p)=>s+(p.stock||0),0),
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="ap-page page-wrapper">
      <div className="ap-bg">
        <div className="ap-blob ap-blob--1" />
        <div className="ap-blob ap-blob--2" />
      </div>

      <div className="container ap-container">
        {/* Header */}
        <div className="ap-header">
          <div>
            <p className="ap-eyebrow">✦ Только для администратора</p>
            <h1 className="ap-title">Панель <em>управления</em></h1>
            <p className="ap-sub">Управление товарами каталога LUMIÈRE Beauty</p>
          </div>
          <Link to="/create" className="ap-add-btn">＋ Добавить товар</Link>
        </div>

        {/* ── Notifications ── */}
        <div className="ap-notifs-section">
          <div className="ap-notifs-header" onClick={() => setNotifsOpen(!notifsOpen)}>
            <div className="ap-notifs-header__left">
              <span className="ap-notifs-header__icon">🔔</span>
              <h2 className="ap-notifs-header__title">Новые заказы</h2>
              {unread > 0 && (
                <span className="ap-notifs-header__badge">{unread} новых</span>
              )}
              {notifications.length > 0 && unread === 0 && (
                <span className="ap-notifs-header__all">{notifications.length} заказов</span>
              )}
            </div>
            <button className="ap-notifs-header__toggle">{notifsOpen ? "▲ Скрыть" : "▼ Показать"}</button>
          </div>

          {notifsOpen && (
            <div className="ap-notifs-list">
              {notifications.length === 0 ? (
                <div className="ap-notifs-empty">
                  <span>🔕</span>
                  <p>Заказов пока нет. Они появятся здесь, когда пользователи оформят покупки.</p>
                </div>
              ) : (
                notifications.map((n) => <NotifCard key={n.id} notif={n} />)
              )}
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div className="ap-stats">
          <div className="ap-stat-item">
            <span className="ap-stat-val">{loading ? "—" : stats.total}</span>
            <span className="ap-stat-label">Товаров</span>
          </div>
          <div className="ap-stat-divider" />
          <div className="ap-stat-item">
            <span className="ap-stat-val">{loading ? "—" : stats.categories}</span>
            <span className="ap-stat-label">Категорий</span>
          </div>
          <div className="ap-stat-divider" />
          <div className="ap-stat-item">
            <span className="ap-stat-val">{loading ? "—" : `$${stats.avgPrice}`}</span>
            <span className="ap-stat-label">Средняя цена</span>
          </div>
          <div className="ap-stat-divider" />
          <div className="ap-stat-item">
            <span className="ap-stat-val">{loading ? "—" : stats.totalStock.toLocaleString()}</span>
            <span className="ap-stat-label">На складе</span>
          </div>
        </div>

        {/* Messages */}
        {successMsg && <div className="ap-success">✓ {successMsg}</div>}
        {error && <div className="ap-error">✕ {error}</div>}

        {/* Toolbar */}
        <div className="ap-toolbar">
          <div className="ap-search-wrap">
            <input
              className="ap-search" type="text"
              placeholder="Поиск по названию, бренду или категории..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <span className="ap-search-icon">⌕</span>
          </div>
          <select className="ap-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Сортировка</option>
            <option value="name">По названию А-Я</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>

        {/* Table */}
        <div className="ap-table-wrap">
          {loading ? (
            <div className="ap-table-skeleton">
              {Array.from({length:6}).map((_,i) => (
                <div key={i} className="ap-skel-row">
                  <div className="skeleton" style={{height:44,width:44,borderRadius:8,flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div className="skeleton" style={{height:13,width:"60%",marginBottom:6}} />
                    <div className="skeleton" style={{height:11,width:"30%"}} />
                  </div>
                  <div className="skeleton" style={{height:13,width:60}} />
                  <div className="skeleton" style={{height:32,width:90,borderRadius:6}} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="ap-empty">
              <p className="ap-empty__icon">◈</p>
              <p>{search ? `По запросу «${search}» ничего не найдено` : "Каталог пуст"}</p>
            </div>
          ) : (
            <table className="ap-table">
              <thead>
                <tr className="ap-table__head">
                  <th>Товар</th><th>Категория</th><th>Цена</th><th>Рейтинг</th><th>Склад</th><th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="ap-table__row">
                    <td>
                      <div className="ap-product-cell">
                        <div className="ap-product-img">
                          {p.thumbnail ? <img src={p.thumbnail} alt={p.title} /> : <span>✿</span>}
                        </div>
                        <div>
                          <p className="ap-product-name">{p.title}</p>
                          <p className="ap-product-brand">{p.brand || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="ap-category-badge">{p.category}</span></td>
                    <td><span className="ap-price">${p.price}</span></td>
                    <td><span className="ap-rating">★ {p.rating?.toFixed(1)||"—"}</span></td>
                    <td>
                      <span className={`ap-stock ${p.stock>0?"ap-stock--ok":"ap-stock--out"}`}>
                        {p.stock>0?`${p.stock} шт.`:"Нет"}
                      </span>
                    </td>
                    <td>
                      <div className="ap-row-actions">
                        <button className="ap-action-btn ap-action-btn--view" onClick={()=>navigate(`/details/${p.id}`)} title="Просмотреть">◈</button>
                        <button className="ap-action-btn ap-action-btn--edit" onClick={()=>navigate(`/edit/${p.id}`)} title="Редактировать">✎</button>
                        <button className="ap-action-btn ap-action-btn--delete" onClick={()=>setDeleteTarget(p)} title="Удалить">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="ap-count">{!loading && `Показано: ${filtered.length} из ${products.length} товаров`}</p>
      </div>

      {deleteTarget && (
        <ConfirmModal
          product={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
