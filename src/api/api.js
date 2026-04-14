// ── localStorage keys ─────────────────────────────────────
const PRODUCTS_KEY = "lumiere_products";
const USERS_KEY = "lumiere_users";
const ID_SEQ_KEY = "lumiere_id_seq";

// ── Seed data (used on first load) ────────────────────────
const SEED_PRODUCTS = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description:
      "Тушь для ресниц Lash Princess от Essence придаёт объём и удлинение для драматического взгляда.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    brand: "Essence",
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
    ],
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    description:
      "Палетка теней с зеркалом — универсальная коллекция оттенков для создания выразительного макияжа.",
    category: "beauty",
    price: 19.99,
    discountPercentage: 5.5,
    rating: 3.28,
    stock: 44,
    brand: "Glamour Beauty",
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png",
    ],
  },
  {
    id: 3,
    title: "Powder Canister",
    description:
      "Компактная пудра для матового финиша и естественного покрытия на весь день.",
    category: "beauty",
    price: 14.99,
    discountPercentage: 18.14,
    rating: 3.82,
    stock: 59,
    brand: "Velvet Touch",
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png",
    ],
  },
  {
    id: 4,
    title: "Red Lipstick",
    description:
      "Классическая красная помада с кремовой текстурой и насыщенной пигментацией для стойкого образа.",
    category: "beauty",
    price: 12.99,
    discountPercentage: 19.03,
    rating: 2.51,
    stock: 68,
    brand: "Chic Cosmetics",
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png",
    ],
  },
  {
    id: 5,
    title: "Red Nail Polish",
    description:
      "Лак для ногтей насыщенного красного оттенка с глянцевым блеском и стойким покрытием.",
    category: "beauty",
    price: 8.99,
    discountPercentage: 2.46,
    rating: 3.91,
    stock: 71,
    brand: "Nail Couture",
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png",
    ],
  },
  {
    id: 6,
    title: "Calvin Klein CK One",
    description:
      "CK One — культовый унисекс-аромат с лёгкими цитрусовыми нотами, идеальный на каждый день.",
    category: "fragrances",
    price: 49.99,
    discountPercentage: 0.32,
    rating: 4.85,
    stock: 17,
    brand: "Calvin Klein",
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png",
    ],
  },
  {
    id: 7,
    title: "Chanel Coco Noir Eau De",
    description:
      "Chanel Coco Noir — интенсивный вечерний аромат с нотами грейпфрута, розы и сандала.",
    category: "fragrances",
    price: 129.99,
    discountPercentage: 18.64,
    rating: 2.76,
    stock: 41,
    brand: "Chanel",
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png",
    ],
  },
  {
    id: 8,
    title: "Dior J'adore",
    description:
      "Dior J'adore — роскошный цветочный аромат с нотами жасмина, розы и иланг-иланга.",
    category: "fragrances",
    price: 89.99,
    discountPercentage: 17.44,
    rating: 3.31,
    stock: 91,
    brand: "Dior",
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/1.png",
    ],
  },
  {
    id: 9,
    title: "Gucci Bloom Eau de Parfum",
    description:
      "Gucci Bloom — свежий цветочный аромат с нотами жасмина и туберозы для современной женщины.",
    category: "fragrances",
    price: 79.99,
    discountPercentage: 8.9,
    rating: 2.69,
    stock: 93,
    brand: "Gucci",
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/1.png",
    ],
  },
  {
    id: 10,
    title: "Moisturizing Cream Ultra",
    description:
      "Увлажняющий крем для лица с гиалуроновой кислотой и витамином E. Глубокое увлажнение на 24 часа.",
    category: "skincare",
    price: 24.99,
    discountPercentage: 12.0,
    rating: 4.52,
    stock: 33,
    brand: "LUMIÈRE",
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
    images: [],
  },
];

// ── Helpers ───────────────────────────────────────────────
function getProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted data — reset */
  }
  // First run — seed default products
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(ID_SEQ_KEY, String(SEED_PRODUCTS.length));
  return [...SEED_PRODUCTS];
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function nextId() {
  const current = Number(localStorage.getItem(ID_SEQ_KEY)) || SEED_PRODUCTS.length;
  const next = current + 1;
  localStorage.setItem(ID_SEQ_KEY, String(next));
  return next;
}

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted */
  }
  return [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Products ──────────────────────────────────────────────
export const fetchItems = async () => {
  return getProducts();
};

export const fetchItem = async (id) => {
  const products = getProducts();
  const item = products.find((p) => String(p.id) === String(id));
  if (!item) throw new Error("Товар не найден");
  return item;
};

export const createProduct = async (productData) => {
  const products = getProducts();
  const newProduct = { ...productData, id: nextId() };
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = async (id, productData) => {
  const products = getProducts();
  const idx = products.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) throw new Error("Товар не найден");
  products[idx] = { ...products[idx], ...productData, id: products[idx].id };
  saveProducts(products);
  return products[idx];
};

export const deleteProduct = async (id) => {
  let products = getProducts();
  const before = products.length;
  products = products.filter((p) => String(p.id) !== String(id));
  if (products.length === before) throw new Error("Товар не найден");
  saveProducts(products);
  return { id, isDeleted: true };
};

// ── Auth ──────────────────────────────────────────────────
export const loginUser = async ({ username, password }) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("Неверный логин или пароль");
  // Return shape compatible with what Login.jsx expects
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token: "local-token-" + Date.now(),
  };
};

export const registerUser = async (userData) => {
  const users = getUsers();
  if (users.some((u) => u.username === userData.username)) {
    throw new Error("Пользователь с таким логином уже существует");
  }
  if (users.some((u) => u.email === userData.email)) {
    throw new Error("Пользователь с таким email уже существует");
  }
  const newUser = {
    id: Date.now(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    username: userData.username,
    password: userData.password,
  };
  users.push(newUser);
  saveUsers(users);
  return { ...newUser, password: undefined };
};

// ── Cart ──────────────────────────────────────────────────
const CART_KEY = "lumiere_cart";
const FAVORITES_KEY = "lumiere_favorites";

function readKey(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted */ }
  return [];
}

export const getCart = () => readKey(CART_KEY);

export const addToCart = (product) => {
  const cart = getCart();
  const idx = cart.findIndex((c) => String(c.id) === String(product.id));
  if (idx !== -1) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart().filter((c) => String(c.id) !== String(productId));
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const updateCartQty = (productId, qty) => {
  const cart = getCart();
  const idx = cart.findIndex((c) => String(c.id) === String(productId));
  if (idx !== -1) {
    if (qty <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].qty = qty;
    }
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

// ── Favorites ─────────────────────────────────────────────
export const getFavorites = () => readKey(FAVORITES_KEY);

export const toggleFavorite = (product) => {
  let favs = getFavorites();
  const exists = favs.some((f) => String(f.id) === String(product.id));
  if (exists) {
    favs = favs.filter((f) => String(f.id) !== String(product.id));
  } else {
    favs.push(product);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return { favorites: favs, added: !exists };
};

export const isFavorite = (productId) => {
  return getFavorites().some((f) => String(f.id) === String(productId));
};

// ── Orders & Admin Notifications ──────────────────────────
const ORDERS_KEY        = "lumiere_orders";
const NOTIFICATIONS_KEY = "lumiere_notifications";

export const getOrders = (username) => {
  const all = readKey(ORDERS_KEY);
  return username ? all.filter((o) => o.username === username) : all;
};

export const getAdminNotifications = () => readKey(NOTIFICATIONS_KEY);

export const getUnreadNotificationCount = () =>
  readKey(NOTIFICATIONS_KEY).filter((n) => !n.read).length;

export const markNotificationsRead = () => {
  const list = readKey(NOTIFICATIONS_KEY).map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
};

export const placeOrder = ({ user, cart, delivery }) => {
  // Build order
  const order = {
    id: "ORD-" + Date.now(),
    username:  user.username,
    userName:  user.name,
    date:      new Date().toLocaleString("ru-RU"),
    items:     cart,
    total:     cart.reduce((s, c) => s + c.price * (c.qty || 1), 0).toFixed(2),
    delivery,           // { type: "delivery"|"pickup", address?, pickupDate? }
  };

  // Save to orders list
  const orders = readKey(ORDERS_KEY);
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  // Create admin notification
  const notif = {
    id:      Date.now(),
    orderId: order.id,
    read:    false,
    date:    order.date,
    userName: user.name,
    username: user.username,
    total:   order.total,
    itemsCount: cart.reduce((s, c) => s + (c.qty || 1), 0),
    delivery,
    items:   cart.map((c) => ({ title: c.title, qty: c.qty || 1, price: c.price })),
  };
  const notifs = readKey(NOTIFICATIONS_KEY);
  notifs.unshift(notif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));

  // Clear cart
  localStorage.removeItem(CART_KEY);

  return order;
};
