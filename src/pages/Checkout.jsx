import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email inválido");
      return false;
    }
    if (!formData.address.trim()) {
      setError("La dirección es requerida");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cart.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    setLoading(true);
    setError("");

    const { error: supabaseError } = await supabase.from("orders").insert([
      {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_address: formData.address,
        total: cartTotal,
        items: cart,
      },
    ]);

    setLoading(false);

    if (supabaseError) {
      setError("Hubo un problema al procesar tu compra. Intenta de nuevo.");
    } else {
      setSuccess(true);
      clearCart();
    }
  };

  if (success) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-success" role="alert">
          <h3>¡Gracias por tu compra!</h3>
          <p>Te enviamos un correo con los detalles de tu orden.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/")}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Checkout</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {cart.length === 0 ? (
        <div className="alert alert-warning">
          Tu carrito está vacío. <a href="/">Continúa comprando</a>
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <h4>Total: ${cartTotal.toLocaleString()}</h4>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Procesando..." : "Finalizar compra"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Checkout;
