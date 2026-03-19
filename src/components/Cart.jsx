import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart, subtotal, discount, total } = useCart();

  if (cart.length === 0) {
    return <p className="text-center my-5">Aún no has agregado productos a tu compra.</p>;
  }

  return (
    <div className="container my-5">
      <h2>Carrito de compras</h2>
      <ul className="list-group mb-3">
        {cart.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{item.name} - ${item.price}</span>
            <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
      {discount > 0 && (
        <h5 className="text-success">Descuento aplicado (15%): -${discount.toFixed(2)}</h5>
      )}
      <h3>Total a pagar: ${total.toFixed(2)}</h3>

      <button className="btn btn-secondary me-2" onClick={clearCart}>Vaciar carrito</button>
      <button className="btn btn-success">Finalizar compra</button>
    </div>
  );
}

export default Cart;