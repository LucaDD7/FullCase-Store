import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient.js"
import ProductCard from "../components/ProductCard"

const { data, error } = await supabase.from("products").select("*")

export default function Catalog() {
  const [products, setProducts] = useState([])

  useEffect(() => {
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*")
    if (error) {
      console.error("Error cargando productos:", error)
    } else {
      console.log("Productos:", data)
    }
  }
  fetchProducts()
}, [])


  return (
    <div className="container mt-4">
      <h2>Catálogo de Fundas</h2>
      <div className="row">
        {products.map(p => (
          <div className="col-md-4" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}