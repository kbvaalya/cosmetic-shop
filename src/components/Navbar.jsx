import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCart, getUnreadNotificationCount } from "../api/api";
import "./Navbar.css";

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount,  setCartCount]  = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  const refreshCounts = () => {
    if (isLoggedIn) setCartCount(getCart().reduce((s,c)=>s+(c.qty||1),0));
    if (isAdmin)    setNotifCount(getUnreadNotificationCount());
  };

  // Refresh on every route change
  useEffect(refreshCounts, [location, isLoggedIn, isAdmin]);

  // Listen for "read" events dispatched by AdminPanel
  useEffect(() => {
    const handler = () => setNotifCount(0);
    window.addEventListener("lumiere_notif_read", handler);
    return () => window.removeEventListener("lumiere_notif_read", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">LUMIÈRE</span>
          <span className="navbar__logo-sub">Beauty</span>
        </Link>

        <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
          <Link to="/" className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}>Главная</Link>
          <Link to="/list" className={`navbar__link ${isActive("/list") ? "navbar__link--active" : ""}`}>Каталог</Link>

          {isLoggedIn && (
            <Link to="/dashboard" className={`navbar__link ${isActive("/dashboard") ? "navbar__link--active" : ""}`}>
              Дашборд
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/cart" className={`navbar__link navbar__cart-link ${isActive("/cart") ? "navbar__link--active" : ""}`}>
              🛒
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAdmin && (
            <>
              {/* Notification bell */}
              <Link
                to="/admin"
                className={`navbar__link navbar__notif-link ${isActive("/admin") ? "navbar__link--active" : ""}`}
                title="Панель администратора"
              >
                🔔
                {notifCount > 0 && (
                  <span className="navbar__notif-badge">{notifCount}</span>
                )}
              </Link>
              <Link to="/create" className={`navbar__link navbar__link--admin ${isActive("/create") ? "navbar__link--active" : ""}`}>
                ✦ Добавить
              </Link>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className={`navbar__link ${isActive("/login") ? "navbar__link--active" : ""}`}>Войти</Link>
              <Link to="/register" className="navbar__cta">Регистрация</Link>
            </>
          )}

          {isLoggedIn && (
            <div className="navbar__user">
              <Link to="/profile" className="navbar__user-info navbar__profile-link" title="Перейти в профиль">
                <span className={`navbar__user-avatar ${isAdmin ? "navbar__user-avatar--admin" : ""}`}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="navbar__user-text">
                  <span className="navbar__user-name">{user.name}</span>
                  <span className={`navbar__user-role ${isAdmin ? "navbar__user-role--admin" : ""}`}>
                    {isAdmin ? "Администратор" : "Пользователь"}
                  </span>
                </div>
              </Link>
              <button className="navbar__logout" onClick={handleLogout}>Выйти</button>
            </div>
          )}
        </nav>

        <button
          className={`navbar__burger ${menuOpen ? "navbar__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
