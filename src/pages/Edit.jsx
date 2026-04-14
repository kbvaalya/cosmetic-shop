import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItem, updateProduct, deleteProduct } from "../api/api";
import "./Form.css";
import "./Edit.css";

const CATEGORIES = ["beauty", "skincare", "makeup", "fragrances", "haircare", "bodycare"];

export default function Edit({ localProducts = [], onUpdate, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const local = localProducts.find(
      (p) => String(p.id) === String(id) || String(p.localId) === String(id)
    );
    if (local) {
      setForm({
        title: local.title || "",
        brand: local.brand || "",
        price: local.price || "",
        category: local.category || "beauty",
        description: local.description || "",
        thumbnail: local.thumbnail || "",
      });
      setLoading(false);
      return;
    }

    fetchItem(id)
      .then((item) => {
        setForm({
          title: item.title || "",
          brand: item.brand || "",
          price: item.price || "",
          category: item.category || "beauty",
          description: item.description || "",
          thumbnail: item.thumbnail || "",
        });
      })
      .catch(() => setError("Не удалось загрузить товар."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, brand, price } = form;
    if (!title.trim() || !brand.trim() || !price) {
      setError("Заполните обязательные поля: название, бренд и цена.");
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError("Введите корректную цену.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = { ...form, price: Number(price) };
      await updateProduct(id, updated);
      if (onUpdate) onUpdate(id, updated);
      setSuccess(`Товар «${form.title}» успешно обновлён!`);
      setTimeout(() => navigate("/list"), 1500);
    } catch {
      setError("Ошибка при сохранении изменений.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const isLocal = localProducts.some(
        (p) => String(p.id) === String(id) || String(p.localId) === String(id)
      );
      if (!isLocal) await deleteProduct(id);
      if (onDelete) onDelete(id);
      navigate("/list");
    } catch {
      setError("Ошибка при удалении товара.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-page__bg">
          <div className="form-page__blob form-page__blob--1" />
          <div className="form-page__blob form-page__blob--2" />
        </div>
        <div className="form-card form-card--wide edit-skeleton">
          <div className="skeleton" style={{ height: 14, width: "30%", marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 40, marginBottom: 32 }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 48, marginBottom: 16, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-page__bg">
        <div className="form-page__blob form-page__blob--1" />
        <div className="form-page__blob form-page__blob--2" />
      </div>

      <div className="form-card form-card--wide">
        <p className="form-card__eyebrow">
          <span className="edit-admin-badge">✦ Администратор</span>
        </p>
        <h1 className="form-card__title">Редактировать <em>товар</em></h1>
        <p className="form-card__sub">Измените нужные поля и сохраните изменения</p>

        {error && (
          <div className="form-error">
            <span className="form-error__icon">!</span>
            {error}
          </div>
        )}
        {success && <div className="form-success">✓ {success}</div>}

        {form?.thumbnail && (
          <div className="edit-preview">
            <img src={form.thumbnail} alt="Preview" className="edit-preview__img" />
          </div>
        )}

        {form && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="thumbnail">
                URL изображения <span className="form-optional">(необязательно)</span>
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="url"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={form.thumbnail}
                onChange={handleChange}
              />
              <p className="form-hint">Вставьте новую ссылку, чтобы заменить фото</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Название <span className="form-required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="Увлажняющий крем для лица"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <div className="form-group__row">
                <div>
                  <label className="form-label" htmlFor="brand">
                    Бренд <span className="form-required">*</span>
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    className="form-input"
                    placeholder="LUMIÈRE"
                    value={form.brand}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="price">
                    Цена ($) <span className="form-required">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="29.99"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Категория</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="Описание товара..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="edit-actions">
              <button
                type="button"
                className="edit-btn-delete"
                onClick={() => setShowDeleteModal(true)}
              >
                ✕ Удалить
              </button>
              <button
                type="button"
                className="edit-btn-cancel"
                onClick={() => navigate(-1)}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={`form-submit edit-btn-save ${saving ? "form-submit--loading" : ""}`}
                disabled={saving}
              >
                {saving ? "Сохраняем..." : "Сохранить →"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal__icon">✕</div>
            <h3 className="delete-modal__title">Удалить товар?</h3>
            <p className="delete-modal__desc">
              Вы уверены, что хотите удалить{" "}
              <strong>«{form?.title}»</strong>?<br />
              Это действие нельзя отменить.
            </p>
            <div className="delete-modal__actions">
              <button
                className="delete-modal__btn delete-modal__btn--cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Отмена
              </button>
              <button
                className="delete-modal__btn delete-modal__btn--confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Удаляем..." : "Да, удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
