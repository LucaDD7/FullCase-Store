export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image_url} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">${product.price}</p>
        <button className="btn btn-primary">Agregar al carrito</button>
      </div>
    </div>
  )
}