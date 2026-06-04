import { useCart } from '../context/CartContext';
import { Link } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, clearCart, subtotal, discount, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center my-5">
        <h2 className="mb-4">Tu Carrito</h2>
        <p>Aún no has agregado productos a tu compra.</p>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {/* Botón centrado abajo */}
        <div className="mt-5 text-center">
          <Link to="/" className="btn btn-primary">
            ← Cerrar y seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">Tu Carrito</h2>
      
      <div className="row">
        {cart.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={item.image} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text"><strong>Modelo:</strong> {item.model}</p>
                <p className="card-text"><strong>${item.price}</strong></p>
                <button
                  className="btn btn-danger mt-auto"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h5>Subtotal: ${subtotal}</h5>
        {discount > 0 && (
          <h5 className="text-success">
            Descuento aplicado (15%): -${discount}
          </h5>
        )}
        <h3>Importe total: ${total}</h3>
      </div>

      {/* Botones de acción */}
      <div className="mt-3">
        {cart.length > 0 && (
          <button className="btn btn-secondary me-2" onClick={clearCart}>
            Vaciar carrito
          </button>
        )}
        <Link to="/checkout" className="btn btn-success">Finalizar compra</Link>
      </div>

      {/* Botón centrado abajo del todo */}
      <div className="mt-5 text-center">
        <Link to="/" className="btn btn-primary">
          ← Cerrar y seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default Cart;