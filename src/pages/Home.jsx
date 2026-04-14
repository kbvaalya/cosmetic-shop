import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__circle hero__circle--1" />
          <div className="hero__circle hero__circle--2" />
          <div className="hero__circle hero__circle--3" />
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">Новая коллекция 2025</p>
          <h1 className="hero__title">
            Искусство<br />
            <em>красоты</em>
          </h1>
          <p className="hero__subtitle">
            Откройте для себя мир изысканной косметики, созданной для тех, кто ценит качество и утончённость.
          </p>
          <div className="hero__actions">
            <Link to="/list" className="btn btn--primary">Смотреть каталог</Link>
            <Link to="/list" className="btn btn--ghost">Узнать больше</Link>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card hero__card--1">
            <div className="hero__card-img hero__card-img--rose" />
            <span>Уход за кожей</span>
          </div>
          <div className="hero__card hero__card--2">
            <div className="hero__card-img hero__card-img--gold" />
            <span>Макияж</span>
          </div>
          <div className="hero__card hero__card--3">
            <div className="hero__card-img hero__card-img--blush" />
            <span>Ароматы</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features container">
        <div className="features__grid">
          {[
            { icon: "✦", title: "Премиум качество", desc: "Только лучшие ингредиенты от проверенных производителей." },
            { icon: "◈", title: "Быстрая доставка", desc: "Доставим ваш заказ в течение 2-3 рабочих дней." },
            { icon: "◇", title: "Натуральный состав", desc: "Без вредных химикатов и парабенов." },
            { icon: "✿", title: "Не тестируется на животных", desc: "Cruelty-free продукция, которой можно доверять." },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="feature-card__icon">{f.icon}</span>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-banner__inner container">
          <div className="cta-banner__text">
            <h2 className="cta-banner__title">Откройте каталог красоты</h2>
            <p className="cta-banner__sub">Более 20 продуктов для вашего идеального образа</p>
          </div>
          <Link to="/list" className="btn btn--light">Перейти в каталог →</Link>
        </div>
      </section>
    </div>
  );
}
