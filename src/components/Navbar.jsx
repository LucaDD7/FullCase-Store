import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "react-bootstrap";

function Navbar({ onSearch, suggestions }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/"); // ir a inicio
    window.scrollTo({ top: 0, behavior: "smooth" }); // volver arriba
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Texto centralizado */}
          <Link
            to="/"
            className="navbar-brand mx-auto fw-bold fs-4"
            onClick={handleLogoClick}
          >
            FullCase Store
          </Link>

          {/* Bloque lupa primero y carrito al lado (derecha) */}
          <div className="d-flex align-items-center ms-auto">
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-search"></i>
            </button>
            <Link to="/cart" className="btn btn-outline-light">
              <i className="bi bi-cart"></i>
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
            <ul className="list-group mb-3">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setShowModal(false);
                    navigate(`/product/${s.id}`);
                  }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
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