import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";
import MercadoPagoPayment from "../components/MercadoPagoPayment";
import "./Checkout.css";

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
  const [showPayment, setShowPayment] = useState(false);

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

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPayment(true);
      setError("");
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    setLoading(true);
    setError("");

    if (cart.length === 0) {
      setError("El carrito está vacío");
      setLoading(false);
      return;
    }

    const { error: supabaseError } = await supabase.from("orders").insert([
      {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_address: formData.address,
        total: cartTotal,
        items: cart,
        payment_id: paymentIntentId,
        payment_status: "completed",
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
        <>
          <div className="row">
            <div className="col-md-8">
              {!showPayment ? (
                <form onSubmit={handleContinueToPayment} className="row g-3">
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
                    <button type="submit" className="btn btn-primary">
                      Continuar con el pago
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h4 className="mb-4">Información de pago</h4>
                  <MercadoPagoPayment
                    cartTotal={cartTotal}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => {
                      setError(err);
                      setShowPayment(false);
                    }}
                    loading={loading}
                  />
                  <button
                    className="btn btn-secondary mt-3"
                    onClick={() => setShowPayment(false)}
                  >
                    Volver
                  </button>
                </>
              )}
            </div>

            {/* Resumen de orden */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Resumen de orden</h5>
                  <hr />
                  <div className="mb-3">
                    <h6>Cliente:</h6>
                    <p className="text-muted">{formData.name || "Nombre no especificado"}</p>
                  </div>
                  <div className="mb-3">
                    <h6>Email:</h6>
                    <p className="text-muted">{formData.email || "Email no especificado"}</p>
                  </div>
                  <div className="mb-3">
                    <h6>Dirección:</h6>
                    <p className="text-muted">{formData.address || "Dirección no especificada"}</p>
                  </div>
                  <hr />
                  <h6 className="mb-3">Artículos:</h6>
                  {cart.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between mb-2 small">
                      <span>{item.name} x{item.quantity || 1}</span>
                      <span>${(item.price * (item.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>${cartTotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
