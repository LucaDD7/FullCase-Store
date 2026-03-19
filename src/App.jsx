import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import Cart from "./components/Cart";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <header className="bg-primary text-white text-center py-5">
          <h1>Bienvenido a Fullcase Store</h1>
          <p>Las mejores fundas para tu celular</p>
        </header>
        <main className="container my-5">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <footer className="bg-dark text-white text-center py-3">
          <p>© 2026 Fullcase Store - Todos los derechos reservados</p>
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;