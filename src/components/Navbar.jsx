import { Link } from "react-router-dom";
import { useState } from "react";
import { Modal } from "react-bootstrap";

function Navbar({ onSearch, suggestions }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
        <Link className="navbar-brand mx-auto" to="/">
          <strong>FullCase Store</strong>
        </Link>
        <div className="ms-auto d-flex align-items-center">
          {/* Botón lupa */}
          <button
            className="btn btn-outline-light me-2"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-search"></i>
          </button>

          {/* Botón carrito */}
          <Link to="/cart" className="btn btn-outline-light">
            <i className="bi bi-cart"></i>
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
                      setShowModal(false); // cerrar modal al elegir
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>

              {/* Botón para ver todos los productos similares SOLO si hay más de 1 sugerencia */}
              {suggestions.length > 1 && (
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => {
                    onSearch(searchTerm); // mantiene el filtro
                    setShowModal(false);  // cierra el modal
                  }}
                >
                  Ver todos los productos similares
                </button>
              )}
            </>
          )}

          {/* Botón para resetear y ver todo */}
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