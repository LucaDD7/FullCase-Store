import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

function SkeletonCard() {
  return (
    <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="placeholder-glow">
          <div className="placeholder bg-secondary rounded-top" style={{ height: '200px', width: '100%', display: 'block' }} />
        </div>
        <div className="card-body d-flex flex-column gap-2">
          <p className="placeholder-glow mb-1"><span className="placeholder col-10" /></p>
          <p className="placeholder-glow mb-1"><span className="placeholder col-6" /></p>
          <p className="placeholder-glow mb-2"><span className="placeholder col-4" /></p>
          <span className="placeholder col-12 btn btn-primary disabled mt-auto" />
        </div>
      </div>
    </div>
  );
}

function Catalog({ searchTerm, searchTitle, setSuggestions, onClearSearch }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomImage, setZoomImage] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceLimit, setPriceLimit] = useState(0);
  const { cart, cartVersion, addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("Error al traer productos:", error);
    } else {
      setProducts(data);
      if (data.length > 0) {
        const max = Math.max(...data.map(p => Number(p.price)));
        setMaxPrice(max);
        setPriceLimit(prev => prev === 0 ? max : prev);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [cartVersion]);

  useEffect(() => {
    if (searchTerm) {
      const matches = products
        .filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(p => `${p.name} (${p.model})`);
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products, setSuggestions]);

  if (loading) {
    return (
      <div className="row">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const termLower = searchTerm.toLowerCase();
  const isExactModel = products.some(p => p.model.toLowerCase() === termLower);

  let filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(termLower);
    const modelMatch = isExactModel
      ? p.model.toLowerCase() === termLower
      : p.model.toLowerCase().includes(termLower);
    return (nameMatch || modelMatch) && Number(p.price) <= priceLimit;
  });

  if (sortBy === 'price-asc') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

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
                      <img src={product.image_url} className="card-img-top" alt={product.name}
                        style={{ objectFit: 'cover', height: '320px', cursor: 'zoom-in' }}
                        onClick={() => setZoomImage(product)} />
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

      {/* Controles: ordenar + precio */}
      <div className="d-flex flex-wrap align-items-end gap-3 mb-4">
        <div>
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Ordenar por</label>
          <select className="form-select form-select-sm" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ minWidth: '180px' }}>
            <option value="default">Por defecto</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
        {maxPrice > 0 && (
          <div className="flex-grow-1" style={{ minWidth: '200px' }}>
            <label className="form-label mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>
              Precio máximo: <strong>${priceLimit.toLocaleString()}</strong>
            </label>
            <input
              type="range"
              className="form-range"
              min={0}
              max={maxPrice}
              step={50}
              value={priceLimit}
              onChange={e => setPriceLimit(Number(e.target.value))}
            />
          </div>
        )}
      </div>

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
                    style={{ objectFit: 'cover', height: '320px', cursor: 'zoom-in' }}
                    onClick={() => setZoomImage(product)}
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

      <Modal show={!!zoomImage} onHide={() => setZoomImage(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>{zoomImage?.name} — {zoomImage?.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {zoomImage?.image_url && (
            <img src={zoomImage.image_url} alt={zoomImage.name} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Catalog;
