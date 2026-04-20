import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import List from "./pages/List";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

function App() {
  const [localProducts, setLocalProducts] = useState([]);

  const addProduct = (product) => {
    setLocalProducts((prev) => [product, ...prev]);
  };

  const updateLocalProduct = (id, updated) => {
    setLocalProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(id) || String(p.localId) === String(id)
          ? { ...p, ...updated }
          : p
      )
    );
  };

  const deleteLocalProduct = (id) => {
    setLocalProducts((prev) =>
      prev.filter(
        (p) => String(p.id) !== String(id) && String(p.localId) !== String(id)
      )
    );
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List localProducts={localProducts} />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected: logged in users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Protected: admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute adminOnly>
                <Create addProduct={addProduct} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <Edit
                  localProducts={localProducts}
                  onUpdate={updateLocalProduct}
                  onDelete={deleteLocalProduct}
                />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
