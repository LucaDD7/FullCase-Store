import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import './Navbar.css';

function Navbar({ onSearch, suggestions }) {
  const [showModal, setShowModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const cartCount = cart.length;

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);



  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-5 py-0 fixed-top d-flex align-items-center">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center" onClick={handleLogoClick}>
  <img src="/images/FullCase_img-removebg-preview.png" height="70" className="me-2" />
  <span className="brand-text">FullCase</span>
</Link>


        {/* Menú horizontal */}
        <div className="navbar-center-menu d-flex">
          <ul className="navbar-nav">
            {/* MODELO */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="modeloDropdownLg" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                MODELO
              </a>
              <ul className="dropdown-menu" aria-labelledby="modeloDropdownLg">
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 11 pro"); }}>Iphone 11 pro</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 13"); }}>Iphone 13</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 13 pro"); }}>Iphone 13 pro</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 14"); }}>Iphone 14</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 14 pro"); }}>Iphone 14 pro</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 15"); }}>Iphone 15</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 15 pro"); }}>Iphone 15 pro</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 16"); }}>Iphone 16</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Iphone 17"); }}>Iphone 17</a></li>
              </ul>
            </li>

            {/* CUERO */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="cueroDropdownLg" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                CUERO
              </a>
              <ul className="dropdown-menu" aria-labelledby="cueroDropdownLg">
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Tarjetero"); }}>Tarjetero</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Premium"); }}>Premium</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Magnética"); }}>Magnética</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Elegante"); }}>Elegante</a></li>
              </ul>
            </li>

            {/* PERSONALIZADO */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="personalizadoDropdownLg" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                PERSONALIZADO
              </a>
              <ul className="dropdown-menu" aria-labelledby="personalizadoDropdownLg">
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Formula 1"); }}>Formula 1</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSearch("Transparente"); }}>Transparente</a></li>
              </ul>
            </li>

            {/* MI CUENTA */}
            <li className="nav-item">
              <button
                className="nav-link fw-semibold"
                style={{ border: "none", background: "none", cursor: "pointer" }}
                onClick={() => setShowAccountModal(true)}
              >
                <i className="bi bi-person-circle me-1"></i>Mi Cuenta
              </button>
            </li>
          </ul>
        </div>

        <div className="navbar-buttons d-flex align-items-center">
          {/* Botón lupa con texto */}
          <button className="btn btn-dark me-2 d-flex align-items-center" onClick={() => setShowModal(true)}>
            <i className="bi bi-search me-2"></i>
            <span>Buscar</span>
          </button>

            {/* Botón carrito */}
            <Link to="/cart" className="btn btn-dark position-relative">
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

      {/* Modal de búsqueda */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Buscar productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Escribe para buscar..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {searchTerm && suggestions.length > 0 && (
            <>
              <ul className="list-group mb-3">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      const modelMatch = s.match(/\((.*?)\)/);
                      const searchValue = modelMatch ? modelMatch[1] : s;
                      setSearchTerm(searchValue);
                      onSearch(searchValue);
                      setShowModal(false);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>

              {suggestions.length > 1 && (
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => {
                    onSearch(searchTerm);
                    setShowModal(false);
                  }}
                >
                  Ver todos los productos similares
                </button>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de Registro */}
      <Modal show={showAccountModal} onHide={() => setShowAccountModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => {
                alert(`Registro: ${email}`);
                setEmail("");
                setPassword("");
                setShowAccountModal(false);
              }}
            >
              Registrarse
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;