import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Fullcase Store</Link>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Catálogo</Link></li>
          <li className="nav-item position-relative">
            <Link className="nav-link" to="/cart">
              <i className="bi bi-bag"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;