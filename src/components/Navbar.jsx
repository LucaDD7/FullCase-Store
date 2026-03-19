import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar({ onSearch, suggestions }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">FullCase Store</Link>

      <div className="ms-auto d-flex align-items-center">
        {/* Buscador con lupa */}
        <div className="position-relative me-3" style={{ maxWidth: "250px" }}>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Lista de sugerencias */}
          {searchTerm && suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSearchTerm(s);
                    onSearch(s);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botón carrito */}
        <Link to="/cart" className="btn btn-outline-light">
          <i className="bi bi-cart"></i> Carrito
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;