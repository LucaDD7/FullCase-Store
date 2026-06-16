import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, model, image_url))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data ?? []);
      setFetching(false);
    };

    fetchOrders();
  }, [user]);

  if (loading || fetching) return <p className="text-center my-5">Cargando...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Mis Pedidos</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Aún no tenés pedidos. <a href="/">Empezá a comprar</a>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.customer_name} className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                {new Date(order.created_at).toLocaleDateString('es-UY', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
              <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                {order.status === 'completed' ? 'Pagado' : order.status}
              </span>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>Nombre:</strong> {order.name}</p>
              <p className="mb-1"><strong>Email:</strong> {order.email}</p>
              <p className="mb-3"><strong>Dirección:</strong> {order.address}</p>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Modelo</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.order_items ?? []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.products?.name ?? '—'}</td>
                      <td>{item.products?.model ?? '—'}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">Total</td>
                    <td className="text-end fw-bold">${Number(order.total).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
