import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";

function Layout({ searchTerm, setSearchTerm, suggestions, setSuggestions }) {
  const location = useLocation();

  return (
    <>
      {/* Navbar solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <Navbar onSearch={setSearchTerm} suggestions={suggestions} />
      )}
      {/* Carrusel solo si NO estamos en /cart o /checkout */}
      {location.pathname !== "/cart" && location.pathname !== "/checkout" && (
        <div id="headerCarousel" className="carousel slide" data-bs-ride="carousel" >
          <div className="carousel-inner" >
            <div className="carousel-item active">
              <img src="/images/Fondo1.png" className="d-block w-100" alt="Banner 1" />
            </div>
            <div className="carousel-item">
              <img src="/images/Fondo2.png" className="d-block w-100" alt="Banner 2" />
            </div>
            <div className="carousel-item">
              <img src="/images/Fondo3.png" className="d-block w-100" alt="Banner 3" />
            </div>
          </div>

          {/* Controles */}
          <button className="carousel-control-prev" type="button" data-bs-target="#headerCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#headerCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      )}

      <main className="container my-5">
        <Routes>
          <Route
            path="/"
            element={<Catalog searchTerm={searchTerm} setSuggestions={setSuggestions} />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {/* Footers solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <>
        <footer className="footer-top bg-secondary text-white py-5">
  <div className="container">
    <div className="row justify-content-center text-center">
      {/* Suscripción */}
      <div className="col-12 col-md-8 mb-4">
        <h5 className="mb-3">Suscribite aquí:</h5>
        <form className="d-flex flex-column flex-sm-row justify-content-center">
          <input
            type="email"
            className="form-control me-sm-2 mb-2 mb-sm-0"
            placeholder="TU EMAIL:"
          />
          <button type="submit" className="btn btn-warning w-100 w-sm-auto">
            Enviar
          </button>
        </form>
      </div>

      {/* Redes sociales */}
      <div className="col-12 col-md-8">
        <h5 className="mb-3">Nuestras redes:</h5>
        <div className="d-flex justify-content-center">
          <a href="https://www.instagram.com/full.caseuy/" target="_blank" rel="noopener noreferrer" className="me-3 fs-4 text-white">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://wa.me/598XXXXXXXX" target="_blank" rel="noopener noreferrer" className="fs-4 text-white">
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

          {/* Segundo footer: logo + pagos + copyright */}
          <footer className="footer-top bg-black text-white pt-5">
  <div className="container">
    <div className="row mb-4">
      <div className="col-12 text-center">
        <img src="/images/FullCase img.png" alt="FullCase Logo" height="50" className="me-2"/>
        <strong className="text-white">FullCase</strong>
        <br />
        <br />
        <div className="d-flex justify-content-center flex-wrap align-items-center gap-3 mt-3">
          {/* Visa */}
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="38" viewBox="0 0 60 38" role="img" aria-label="Visa">
            <rect width="60" height="38" rx="5" fill="#1A1F71"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">VISA</text>
          </svg>
          {/* Mastercard */}
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="38" viewBox="0 0 60 38" role="img" aria-label="Mastercard">
            <rect width="60" height="38" rx="5" fill="#252525"/>
            <circle cx="23" cy="19" r="11" fill="#EB001B"/>
            <circle cx="37" cy="19" r="11" fill="#F79E1B"/>
            <path d="M30 10.5a11 11 0 0 1 0 17A11 11 0 0 1 30 10.5z" fill="#FF5F00"/>
          </svg>
          {/* OCA */}
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="38" viewBox="0 0 60 38" role="img" aria-label="OCA">
            <rect width="60" height="38" rx="5" fill="#003087"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" fontFamily="Arial, sans-serif">OCA</text>
          </svg>
          {/* MercadoPago */}
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="38" viewBox="0 0 60 38" role="img" aria-label="MercadoPago">
            <rect width="60" height="38" rx="5" fill="#00B1EA"/>
            <text x="50%" y="42%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">MERCADO</text>
            <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">PAGO</text>
          </svg>
          {/* Abitab */}
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="38" viewBox="0 0 60 38" role="img" aria-label="Abitab">
            <rect width="60" height="38" rx="5" fill="#E8000D"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">ABITAB</text>
          </svg>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-12 text-center">
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