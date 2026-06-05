import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import './Navbar.css';

function Navbar({ onSearch, suggestions }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler ms-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>



        <div className="collapse navbar-collapse" id="navbarContent">
  <ul className="navbar-nav mx-auto">
    {/* MODELO */}
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="modeloDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        MODELO
      </a>
      <ul className="dropdown-menu" aria-labelledby="modeloDropdown">
        <li><a className="dropdown-item" href="#">Iphone 11 pro</a></li>
        <li><a className="dropdown-item" href="#">Iphone 13</a></li>
        <li><a className="dropdown-item" href="#">Iphone 13 pro</a></li>
        <li><a className="dropdown-item" href="#">Iphone 14</a></li>
        <li><a className="dropdown-item" href="#">Iphone 14 pro</a></li>
        <li><a className="dropdown-item" href="#">Iphone 15</a></li>
        <li><a className="dropdown-item" href="#">Iphone 15 pro</a></li>
        <li><a className="dropdown-item" href="#">Iphone 16</a></li>
        <li><a className="dropdown-item" href="#">Iphone 17</a></li>
      </ul>
    </li>

    {/* CUERO */}
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="cueroDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        CUERO
      </a>
      <ul className="dropdown-menu" aria-labelledby="cueroDropdown">
        <li><a className="dropdown-item" href="#">Tarjetero</a></li>
        <li><a className="dropdown-item" href="#">Premium</a></li>
        <li><a className="dropdown-item" href="#">Magnética</a></li>
        <li><a className="dropdown-item" href="#">Elegante</a></li>
      </ul>
    </li>

    {/* PERSONALIZADO */}
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="personalizadoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        PERSONALIZADO
      </a>
      <ul className="dropdown-menu" aria-labelledby="personalizadoDropdown">
        <li><a className="dropdown-item" href="#">Formula 1</a></li>
        <li><a className="dropdown-item" href="#">Transparente</a></li>
      </ul>
    </li>
  </ul>

          <div className="navbar-buttons ms-auto d-flex align-items-center">
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
                      setSearchTerm(s);
                      onSearch(s);
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

          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
              setShowModal(false);
            }}
          >
            Ver todos los productos
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar;