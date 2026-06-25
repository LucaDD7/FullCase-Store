import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import './Navbar.css';

function Navbar({ onSearch, onTitle, suggestions, activeFilter = "" }) {
  const [showModal, setShowModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user, profile, signIn, signUp, signOut, resetPassword } = useAuth();
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);



  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    onSearch("");
    onTitle("");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="navbar navbar-light bg-white px-3 px-lg-5 py-0 d-flex align-items-center sticky-top">

        {/* Tres puntos — solo mobile */}
        <button
          className="nav-btn nav-btn-menu d-lg-none me-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
        >
          <i className="bi bi-three-dots-vertical"></i>
        </button>

        {/* Sidebar offcanvas — mobile */}
        <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="sidebarMenu" style={{ maxWidth: '260px' }}>
          <div className="offcanvas-header border-bottom border-secondary">
            <button
              className="btn text-white d-flex align-items-center gap-2 p-0"
              onClick={() => setShowAccountModal(true)}
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-person-circle fs-5"></i>
              <span className="fw-semibold">{user?.user_metadata?.full_name || profile?.full_name || "Mi cuenta"}</span>
            </button>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body p-0">
            <ul className="navbar-nav">
              <li className="nav-item dropdown border-bottom border-secondary">
                <a className="nav-link dropdown-toggle text-white fw-bold px-4 py-3" href="#" data-bs-toggle="dropdown">
                  MODELO
                </a>
                <ul className="dropdown-menu dropdown-menu-dark border-0 rounded-0">
                  {["iPhone 11 Pro","iPhone 13","iPhone 13 Pro","iPhone 14","iPhone 14 Pro","iPhone 15","iPhone 15 Pro","iPhone 16","iPhone 16 Pro","iPhone 17","iPhone 17 Pro"].map((m) => (
                    <li key={m}><a className={`dropdown-item ${activeFilter.toLowerCase() === m.toLowerCase() ? 'fw-bold text-decoration-underline' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onSearch(m); onTitle(m); }} data-bs-dismiss="offcanvas">{m}</a></li>
                  ))}
                </ul>
              </li>
              <li className="nav-item dropdown border-bottom border-secondary">
                <a className="nav-link dropdown-toggle text-white fw-bold px-4 py-3" href="#" data-bs-toggle="dropdown">
                  CUERO
                </a>
                <ul className="dropdown-menu dropdown-menu-dark border-0 rounded-0">
                  {["Tarjetero","Premium","Magnética","Elegante"].map((m) => (
                    <li key={m}><a className={`dropdown-item ${activeFilter.toLowerCase() === m.toLowerCase() ? 'fw-bold text-decoration-underline' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onSearch(m); onTitle(m); }} data-bs-dismiss="offcanvas">{m}</a></li>
                  ))}
                </ul>
              </li>
              <li className="nav-item dropdown border-bottom border-secondary">
                <a className="nav-link dropdown-toggle text-white fw-bold px-4 py-3" href="#" data-bs-toggle="dropdown">
                  PERSONALIZADO
                </a>
                <ul className="dropdown-menu dropdown-menu-dark border-0 rounded-0">
                  {["Formula 1","Transparente"].map((m) => (
                    <li key={m}><a className={`dropdown-item ${activeFilter.toLowerCase() === m.toLowerCase() ? 'fw-bold text-decoration-underline' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onSearch(m); onTitle(m); }} data-bs-dismiss="offcanvas">{m}</a></li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center me-auto mx-lg-0" onClick={handleLogoClick}>
          <img src="/images/FullCase_img-removebg-preview.png" height="70" className="me-2" />
          <span className="brand-text">FullCase</span>
        </Link>

        {/* Menú horizontal — solo desktop */}
        <div className="navbar-center-menu d-none d-lg-flex">
          <ul className="navbar-nav flex-row">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="modeloDropdownLg" role="button" data-bs-toggle="dropdown">MODELO</a>
              <ul className="dropdown-menu">
                {["iPhone 11 Pro","iPhone 13","iPhone 13 Pro","iPhone 14","iPhone 14 Pro","iPhone 15","iPhone 15 Pro","iPhone 16","iPhone 16 Pro","iPhone 17","iPhone 17 Pro"].map((m) => (
                  <li key={m}><a className={`dropdown-item ${activeFilter.toLowerCase() === m.toLowerCase() ? 'fw-bold text-decoration-underline' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onSearch(m); onTitle(m); }}>{m}</a></li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="cueroDropdownLg" role="button" data-bs-toggle="dropdown">CUERO</a>
              <ul className="dropdown-menu">
                {["Tarjetero","Premium","Magnética","Elegante"].map((m) => (
                  <li key={m}><a className={`dropdown-item ${activeFilter.toLowerCase() === m.toLowerCase() ? 'fw-bold text-decoration-underline' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onSearch(m); onTitle(m); }}>{m}</a></li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="personalizadoDropdownLg" role="button" data-bs-toggle="dropdown">PERSONALIZADO</a>
              <ul className="dropdown-menu">
                {["Formula 1","Transparente"].map((m) => (
                  <li key={m}><a className={`dropdown-item ${activeFilter.toLowerCase() === m.toLowerCase() ? 'fw-bold text-decoration-underline' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onSearch(m); onTitle(m); }}>{m}</a></li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        {/* Botones */}
        <div className="navbar-buttons d-flex align-items-center ms-auto ms-lg-0">
          {/* Mi Cuenta — solo desktop */}
          <button className="nav-btn me-2 d-none d-lg-flex" onClick={() => setShowAccountModal(true)}>
            <i className="bi bi-person-circle"></i>
            <span>{user?.user_metadata?.full_name || profile?.full_name || "Mi cuenta"}</span>
          </button>

          {/* Buscar */}
          <button className="nav-btn me-2" onClick={() => setShowModal(true)}>
            <i className="bi bi-search"></i>
            <span className="d-none d-lg-inline">Buscar</span>
          </button>

          {/* Botón carrito */}
          <Link to="/cart" className="nav-btn nav-btn-cart position-relative">
            <i className="bi bi-cart"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
            <span className="fw-bold">${cartTotal.toLocaleString()}</span>
          </Link>
          </div>
      </nav>

      {/* Barra de búsqueda overlay */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1055 }}>
          {/* Fondo oscuro */}
          <div
            onClick={() => { setShowModal(false); setSearchTerm(""); }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)' }}
          />
          {/* Barra */}
          <div style={{ position: 'relative', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
            <div className="container-fluid px-4 py-3 d-flex align-items-center gap-3">
              <i className="bi bi-search text-muted" style={{ fontSize: '1.1rem' }} />
              <input
                type="text"
                className="form-control border-0 shadow-none p-0"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                autoFocus
                style={{ fontSize: '1rem' }}
              />
              <button
                className="btn p-0 text-muted"
                onClick={() => { setShowModal(false); setSearchTerm(""); }}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {searchTerm && suggestions.length > 0 && (
              <div className="border-top">
                <ul className="list-group list-group-flush">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action px-4 py-2"
                      style={{ cursor: 'pointer', fontSize: '0.95rem' }}
                      onClick={() => {
                        const nameMatch = s.match(/^(.*?)\s*\(/);
                        const productName = nameMatch ? nameMatch[1].trim() : s;
                        onSearch(s);
                        onTitle(productName);
                        setSearchTerm("");
                        setShowModal(false);
                      }}
                    >
                      <i className="bi bi-search me-2 text-muted" style={{ fontSize: '0.8rem' }} />
                      {s}
                    </li>
                  ))}
                </ul>
                {suggestions.length > 1 && (
                  <div className="px-4 py-2 border-top">
                    <button
                      className="btn btn-link p-0 text-primary"
                      style={{ fontSize: '0.9rem' }}
                      onClick={() => {
                        onSearch(searchTerm);
                        onTitle(`Resultados de la búsqueda "${searchTerm}"`);
                        setSearchTerm("");
                        setShowModal(false);
                      }}
                    >
                      Ver todos los productos similares →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Mi Cuenta */}
      <Modal show={showAccountModal} onHide={() => { setShowAccountModal(false); setAuthError(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{user ? "Mi Cuenta" : "Acceder"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <div className="text-center">
              {profile?.full_name && <p className="mb-0 fw-bold">{profile.full_name}</p>}
              <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>{user.email}</p>
              <Link
                to="/mi-cuenta"
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={() => setShowAccountModal(false)}
              >
                <i className="bi bi-person me-2"></i>Editar perfil
              </Link>
              <Link
                to="/mis-pedidos"
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => setShowAccountModal(false)}
              >
                <i className="bi bi-bag me-2"></i>Mis Pedidos
              </Link>
              <button
                className="btn btn-danger w-100"
                onClick={async () => { await signOut(); setShowAccountModal(false); }}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              {authError && <div className="alert alert-danger py-2">{authError}</div>}
              <Tabs defaultActiveKey="login" className="mb-3" onSelect={() => setAuthError("")}>
                <Tab eventKey="login" title="Ingresar">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setAuthLoading(true);
                    setAuthError("");
                    const { error } = await signIn(email, password);
                    setAuthLoading(false);
                    if (error) { setAuthError(error.message); }
                    else { setShowAccountModal(false); setEmail(""); setPassword(""); }
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={authLoading}>
                      {authLoading ? "Ingresando..." : "Ingresar"}
                    </button>
                  </form>
                  <div className="text-center mt-3">
                    {!showReset ? (
                      <button className="btn btn-link btn-sm p-0 text-muted" onClick={() => { setShowReset(true); setResetStatus(null); }}>
                        ¿Olvidaste tu contraseña?
                      </button>
                    ) : (
                      <div className="mt-2">
                        <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>Te enviamos un link para resetearla</p>
                        <div className="input-group input-group-sm">
                          <input type="email" className="form-control" placeholder="tu@email.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
                          <button className="btn btn-outline-secondary" onClick={async () => {
                            const { error } = await resetPassword(resetEmail);
                            setResetStatus(error ? 'error' : 'ok');
                          }}>Enviar</button>
                        </div>
                        {resetStatus === 'ok' && <p className="text-success mt-1 mb-0" style={{ fontSize: '0.8rem' }}>¡Revisá tu email!</p>}
                        {resetStatus === 'error' && <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.8rem' }}>Hubo un error, intentá de nuevo.</p>}
                        <button className="btn btn-link btn-sm p-0 text-muted mt-1" onClick={() => setShowReset(false)}>Volver</button>
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="register" title="Registrarse">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setAuthLoading(true);
                    setAuthError("");
                    const { error } = await signUp(email, password, fullName);
                    setAuthLoading(false);
                    if (error) { setAuthError(error.message); }
                    else { setShowAccountModal(false); setEmail(""); setPassword(""); setFullName(""); }
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" placeholder="Tu nombre" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input type="password" className="form-control" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <button type="submit" className="btn btn-success w-100" disabled={authLoading}>
                      {authLoading ? "Registrando..." : "Crear cuenta"}
                    </button>
                  </form>
                </Tab>
              </Tabs>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;