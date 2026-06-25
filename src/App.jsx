import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./supabaseClient";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Account from "./pages/Account";

function Layout({ searchTerm, setSearchTerm, searchTitle, setSearchTitle, suggestions, setSuggestions }) {
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    const { error } = await supabase.from("subscribers").insert([{ email: subEmail.trim() }]);
    if (error?.code === "23505") {
      setSubStatus("ya_suscripto");
    } else if (error) {
      setSubStatus("error");
    } else {
      setSubStatus("ok");
      setSubEmail("");
    }
  };
  const location = useLocation();

  return (
    <>
      {/* Navbar solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <Navbar onSearch={setSearchTerm} onTitle={setSearchTitle} suggestions={suggestions} activeFilter={searchTerm} />
      )}
      {/* Carrusel solo si NO estamos en /cart o /checkout */}
      {!["/cart", "/checkout", "/mis-pedidos", "/mi-cuenta"].includes(location.pathname) && !searchTerm && (
        <div id="headerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-wrap="true" data-bs-pause="false">
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="3000">
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/mobile1.png" />
                <img src="/images/Fondo1.png" className="d-block w-100" alt="Banner 1" />
              </picture>
            </div>
            <div className="carousel-item" data-bs-interval="3000">
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/mobile2.png" />
                <img src="/images/Fondo2.png" className="d-block w-100" alt="Banner 2" />
              </picture>
            </div>
            <div className="carousel-item" data-bs-interval="3000">
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/mobile3.png" />
                <img src="/images/Fondo3.png" className="d-block w-100" alt="Banner 3" />
              </picture>
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

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/59891902046"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1050,
          background: '#25D366', color: '#fff', borderRadius: '50%',
          width: '56px', height: '56px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          fontSize: '1.8rem', textDecoration: 'none',
        }}
        title="Contactanos por WhatsApp"
      >
        <i className="bi bi-whatsapp" />
      </a>

      <main className="container my-5">
        <Routes>
          <Route
            path="/"
            element={<Catalog searchTerm={searchTerm} searchTitle={searchTitle} setSuggestions={setSuggestions} onClearSearch={() => { setSearchTerm(""); setSearchTitle(""); }} />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mis-pedidos" element={<Orders />} />
          <Route path="/mi-cuenta" element={<Account />} />
          <Route path="*" element={
            <div className="text-center py-5">
              <h1 style={{ fontSize: '5rem', fontWeight: 800 }}>404</h1>
              <h4 className="text-muted mb-4">Página no encontrada</h4>
              <a href="/" className="btn btn-dark px-4 rounded-pill">Volver al inicio</a>
            </div>
          } />
        </Routes>
      </main>

      {/* Footers solo si NO estamos en /cart */}
      {location.pathname !== "/cart" && (
        <>
        <footer className="footer-top bg-secondary text-white py-5">
  <div className="container-fluid px-2 px-sm-4">
    <div className="row justify-content-center text-center g-0">
      {/* Suscripción */}
      <div className="col-12 col-sm-8 col-md-6 mb-4 px-0 px-sm-3">
        <h5 className="mb-3">Suscribite aquí:</h5>
        <form className="mx-auto" style={{ maxWidth: '480px' }} onSubmit={handleSubscribe}>
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              placeholder="TU EMAIL:"
              value={subEmail}
              onChange={(e) => { setSubEmail(e.target.value); setSubStatus(null); }}
              required
            />
            <button type="submit" className="btn btn-warning fw-bold px-4">
              ENVIAR
            </button>
          </div>
          {subStatus === "ok" && <p className="text-success mt-2 mb-0" style={{ fontSize: '0.85rem' }}>¡Gracias por suscribirte!</p>}
          {subStatus === "ya_suscripto" && <p className="text-warning mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Este email ya está suscripto.</p>}
          {subStatus === "error" && <p className="text-danger mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Hubo un error, intentá de nuevo.</p>}
        </form>
      </div>

      {/* Redes sociales */}
      <div className="col-12 col-md-8">
        <h5 className="mb-3">Nuestras redes:</h5>
        <div className="d-flex justify-content-center">
          <a href="https://www.instagram.com/full.caseuy/" target="_blank" rel="noopener noreferrer" className="me-3 fs-4 text-white">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://wa.me/59891902046" target="_blank" rel="noopener noreferrer" className="fs-4 text-white">
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
  const [searchTitle, setSearchTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <AuthProvider>
    <CartProvider>
      <Router>
        <Layout
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;