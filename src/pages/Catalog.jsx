import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

function Catalog({ searchTerm, searchTitle, setSuggestions, onClearSearch }) {
  const [products, setProducts] = useState([]);
  const { cart, cartVersion, addToCart } = useCart();

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("Error al traer productos:", error);
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [cartVersion]);

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

  const termLower = searchTerm.toLowerCase();
  const isExactModel = products.some(p => p.model.toLowerCase() === termLower);

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(termLower);
    const modelMatch = isExactModel
      ? p.model.toLowerCase() === termLower
      : p.model.toLowerCase().includes(termLower);
    return nameMatch || modelMatch;
  });

  const noResults = filteredProducts.length === 0;
  const sinStock = !noResults && filteredProducts.every(p => p.stock <= 0);

  const destacados = products.filter(p => p.featured && p.stock > 0);

  return (
    <>
    {!searchTerm && destacados.length > 0 && (
      <div className="mb-5">
        <div className="py-3 px-4 mb-4" style={{ background: '#222', borderRadius: '8px', textAlign: 'center' }}>
          <h4 className="text-white mb-0 fw-bold">Destacados del mes</h4>
        </div>
        <div className="row">
          {destacados.map((product) => {
            const cartItem = cart.find(p => p.id === product.id);
            const quantityInCart = cartItem?.quantity ?? 0;
            const agotado = product.stock <= 0 || quantityInCart >= product.stock;
            return (
              <div className="col-6 col-md-3 mb-3" key={product.id}>
                <div className="card h-100 shadow-sm">
                  {product.image_url && (
                    <img src={product.image_url} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: '320px' }} />
                  )}
                  <div className="card-body d-flex flex-column p-2">
                    <p className="card-title fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{product.name}</p>
                    <p className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{product.model}</p>
                    <p className="fw-bold mb-2">${product.price}</p>
                    <button className="btn btn-primary btn-sm mt-auto" onClick={() => addToCart(product)} disabled={agotado}>
                      {agotado ? "Agotado" : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="py-3 px-4 mb-4" style={{ background: '#222', borderRadius: '8px', textAlign: 'center' }}>
          <h4 className="text-white mb-0 fw-bold">Todos los productos</h4>
        </div>
      </div>
    )}
    {searchTerm && (
      <>
        {searchTitle && <h2 className="mb-2">{searchTitle}</h2>}
        <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
          <span className="text-muted text-nowrap">Filtrando por:</span>
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1" style={{ fontSize: '0.9rem', padding: '6px 10px', maxWidth: '70vw', overflow: 'hidden' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{searchTerm}</span>
            <button
              className="btn-close ms-1 flex-shrink-0"
              style={{ fontSize: '0.6rem' }}
              onClick={onClearSearch}
              aria-label="Quitar filtro"
            />
          </span>
        </div>
      </>
    )}
    {(noResults || sinStock) && (
      <div className="alert alert-warning mt-2">
        No hay stock disponible para <strong>{searchTerm || "este producto"}</strong> en este momento.
      </div>
    )}
    <div className="row">
      {filteredProducts.map((product) => {
        const cartItem = cart.find((p) => p.id === product.id);
        const quantityInCart = cartItem?.quantity ?? 0;
        const noStock = product.stock <= 0 || quantityInCart >= product.stock;

        return (
          <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              {product.image_url && (
                <img
                  src={product.image_url}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: 'cover', height: '320px' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="fw-bold mb-2">{product.model}</p>
                <p className="fw-bold">${product.price}</p>
                <p className="fw-bold">Stock: {product.stock}</p>
                {quantityInCart > 0 && (
                  <p className="card-text text-primary">En carrito: {quantityInCart}</p>
                )}
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => addToCart(product)}
                  disabled={noStock}
                >
                  {noStock ? "Agotado" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}

export default Catalog;
