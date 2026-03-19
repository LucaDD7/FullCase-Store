import { useCart } from '../context/CartContext';
import { Link } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, clearCart, subtotal, discount, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center my-5">
        <p>Aún no has agregado productos a tu compra.</p>

        {/* Botón centrado para volver */}
        <div className="mt-4">
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
          <br />
          <Link to="/" className="btn btn-primary">
            ← Cerrar y continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">Tu Carrito de Compras</h2>
      
      <div className="row">
        {cart.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text"><strong>Modelo:</strong> {item.model}</p>
                <p className="card-text">Precio: ${item.price}</p>
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
        <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
        {discount > 0 && (
          <h5 className="text-success">
            Descuento aplicado (15%): -${discount.toFixed(2)}
          </h5>
        )}
        <h3>Total a pagar: ${total.toFixed(2)}</h3>
      </div>

      <div className="mt-3">
        <button className="btn btn-secondary me-2" onClick={clearCart}>
          Vaciar carrito
        </button>
        <button className="btn btn-success">Finalizar compra</button>
      </div>
    </div>
  );
}

export default Cart;