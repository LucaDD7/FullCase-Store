import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import Cart from "./components/Cart";

function Layout({ searchTerm, setSearchTerm, suggestions, setSuggestions }) {
  const location = useLocation();

  return (
    <>
      {/* Navbar solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <Navbar onSearch={setSearchTerm} suggestions={suggestions} />
      )}
      <br />
      <br />
      {/* Header solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <header className="bg-primary text-white text-center py-5">
          <br />
          <br />
          <h1>Bienvenido a FullCase Store</h1>
          <p>Las mejores fundas para tu celular</p>
        </header>
      )}

      <main className="container my-5">
        <Routes>
          <Route
            path="/"
            element={<Catalog searchTerm={searchTerm} setSuggestions={setSuggestions} />}
          />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      {/* Footer solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <footer className="bg-dark text-white text-center py-3">
          <p>© Copyright 2026 / FullCase Store </p>
        </footer>
      )}
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <CartProvider>
      <Router>
        <Layout
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
      </Router>
    </CartProvider>
  );
}

export default App;