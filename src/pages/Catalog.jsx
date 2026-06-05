import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

function Catalog({ searchTerm, setSuggestions }) {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Error al traer productos:", error);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const matches = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((p) => `${p.name} (${p.model})`);
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products, setSuggestions]);

  if (products.length === 0) return <p>No hay productos disponibles.</p>;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="row">
      {filteredProducts.map((product) => {
        const inCart = cart.some((p) => p.id === product.id);
        const noStock = product.stock <= 0 || inCart;

        return (
          <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
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
                <p className="card-text"><strong>Modelo:</strong> {product.model}</p>
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