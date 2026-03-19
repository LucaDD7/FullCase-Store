import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

function Catalog() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error("Error al traer productos:", error);
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (products.length === 0) return <p>No hay productos disponibles.</p>;

  return (
    <div className="row">
      {products.map(product => {
        const inCart = cart.some(p => p.id === product.id); // 👈 chequeo si está en carrito
        const noStock = product.stock <= 0 || inCart;       // 👈 bloqueo si stock 0 o ya en carrito

        return (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              {product.image_url && (
                <img
                  src={product.image_url}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: 'cover', height: '250px' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Modelo: {product.model}</p>
                <p className="card-text fw-bold">${product.price}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => addToCart(product)}
                  disabled={noStock}
                >
                  {noStock ? "Sin stock" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Catalog;