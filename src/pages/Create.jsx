import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/api";
import "./Form.css";
import "./Create.css";

const CATEGORIES = ["beauty", "skincare", "makeup", "fragrances", "haircare", "bodycare"];

export default function Create({ addProduct }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    category: "beauty",
    description: "",
    thumbnail: "",
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
    const { title, brand, price, category, description } = form;

    if (!title || !brand || !price || !category || !description) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError("Введите корректную цену.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await createProduct({
        title,
        brand,
        price: Number(price),
        category,
        description,
        thumbnail: form.thumbnail || null,
        rating: 4.5,
        stock: 100,
      });

      // Add to local list with the API response + our form data
      addProduct({ ...result, ...form, price: Number(price) });

      setSuccess(`Товар «${title}» успешно добавлен!`);
      setTimeout(() => navigate("/list"), 1500);
    } catch (err) {
      setError(err.message || "Ошибка при создании товара.");
    } finally {
      setLoading(false);
    }
  };

  const preview = form.thumbnail;

  return (
    <div className="form-page">
      <div className="form-page__bg">
        <div className="form-page__blob form-page__blob--1" />
        <div className="form-page__blob form-page__blob--2" />
      </div>

      <div className="form-card form-card--wide">
        <p className="form-card__eyebrow"><span className="create-admin-badge">✦ Администратор</span></p>
        <h1 className="form-card__title">Добавить <em>товар</em></h1>
        <p className="form-card__sub">Заполните форму, чтобы добавить продукт в каталог</p>

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

        {/* Image preview */}
        {preview && (
          <div className="create-preview">
            <img src={preview} alt="Preview" className="create-preview__img" />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Название <span className="form-required">*</span></label>
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
                <label className="form-label" htmlFor="brand">Бренд <span className="form-required">*</span></label>
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
                <label className="form-label" htmlFor="price">Цена ($) <span className="form-required">*</span></label>
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
            <label className="form-label" htmlFor="category">Категория <span className="form-required">*</span></label>
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
            <label className="form-label" htmlFor="description">Описание <span className="form-required">*</span></label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Подробное описание продукта, его состав и преимущества..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="thumbnail">URL изображения <span className="form-optional">(необязательно)</span></label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={form.thumbnail}
              onChange={handleChange}
            />
            <p className="form-hint">Вставьте ссылку на изображение товара</p>
          </div>

          <button
            type="submit"
            className={`form-submit ${loading ? "form-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Добавляем товар..." : "Добавить в каталог →"}
          </button>
        </form>
      </div>
    </div>
  );
}
