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
  <>
    {/* Primer footer: suscripción + redes */}
    <footer className="footer-top pt-5 bg-dark text-white">
      <div className="container">
        {/* Suscripción */}
        <div className="row mb-5 text-center">
          <div className="col-md-3">
            <h5>Suscribite aquí:</h5>
            <br />
            <form className="d-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="TU EMAIL:"
              />
              <button type="submit" className="btn btn-warning">
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="row pt-4">
          <div className="col text-center social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="me-3">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://wa.me/598XXXXXXXX" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>

    {/* Segundo footer: logo + pagos + copyright */}
    <footer className="custom-footer bg-black pt-5 text-white">
      <div className="container">
        {/* Logo y medios de pago */}
        <div className="row mb-5">
          <div className="col text-center">
            <img src="/images/FullCase img.png" alt="FullCase Logo" height="50" className="me-2"/>
            <strong className="text-white" >FullCase</strong>
            <div className="d-flex justify-content-center flex-wrap payment-logos mt-3">
              <img src="/images/visa.png" alt="Visa" />
              <img src="/images/mastercard.png" alt="Mastercard" />
              <img src="/images/oca.png" alt="OCA" />
              <img src="/images/paypal.png" alt="Scotiabank" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col text-center">
            <p className="mb-0">© Copyright 2026 / FullCase Store</p>
          </div>
        </div>
      </div>
    </footer>
  </>
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