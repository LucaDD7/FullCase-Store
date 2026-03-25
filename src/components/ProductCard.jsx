export default function ProductCard({ product, addToCart }) {
  const noStock = product.stock <= 0;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        {product.image_url && (
          <img
            src={product.image_url}
            className="card-img-top"
            alt={product.name}
            style={{ objectFit: "cover", height: "220px" }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
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
}