import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { CartContext } from "../context/CartContext";


function Navbar({ onSearch, suggestions }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const { cart } = useContext(CartContext);
  const cartCount = cart.length


  // Función para volver al inicio
  const handleLogoClick = (e) => {
    e.preventDefault(); // evita el comportamiento por defecto del Link
    navigate("/");       // asegura que estés en la página principal
    window.scrollTo({ top: 0, behavior: "smooth" }); // hace scroll suave hacia arriba
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-white bg-white px-3 fixed-top">
        {/* Logo + texto centrados */}
        <Link
          to="/"
          className="navbar-brand mx-auto d-flex align-items-center"
          onClick={handleLogoClick}
        >
          <img
            src="/images/FullCase_img-removebg-preview.png"
            height="60"
            className="me-2"
          />
          <strong>FullCase</strong>
        </Link>


        <div className="ms-auto d-flex align-items-center">
          {/* Botón lupa */}
          <button
            className="btn btn-dark me-2"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-search"></i>
          </button>

          {/* Botón carrito */}
          <Link to="/cart" className="btn btn-dark position-relative">
  <i className="bi bi-cart"></i>
  {cartCount > 0 && (
    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      {cartCount}
    </span>
  )}
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