import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../api/order';
import { paymentApi } from '../api/payment';
import { ErrorBox, Spinner, money, dateFmt } from '../components/ui';
import type { OrderDto, PaymentDto } from '../api/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const [ordRes, payRes] = await Promise.all([
        orderApi.getOrderById(id),
        paymentApi.getOrderPayments(id),
      ]);
      if (ordRes.isSuccess && ordRes.result) setOrder(ordRes.result);
      else setError(ordRes.errorMsg ?? 'Order not found');
      if (payRes.isSuccess && payRes.result) setPayments(payRes.result);
    })();
  }, [id]);

  if (error) return <ErrorBox message={error} />;
  if (!order) return <Spinner label="Loading order…" />;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Order #{order.id.slice(0, 8)}</h1>
          <p>Placed {dateFmt(order.orderDate)}</p>
        </div>
        <span className={`badge ${order.status === 'Completed' || payments.length > 0 ? 'badge-success' : 'badge-warning'}`}>
          {payments.length > 0 ? 'Paid' : order.status || 'Pending payment'}
        </span>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-pad">
          <h3>Items</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Unit price</th><th>Line total</th></tr>
              </thead>
              <tbody>
                {order.items.map((i, idx) => (
                  <tr key={idx}>
                    <td>
                      <Link to={`/products/${i.productId}`} style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}>
                        {i.productName || `Product ${i.productId.slice(0, 8)}…`}
                      </Link>
                    </td>
                    <td>{i.quantity}</td>
                    <td>{money(i.unitPrice)}</td>
                    <td><strong>{money(i.unitPrice * i.quantity)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span className="price" style={{ fontSize: 20 }}>{money(order.totalAmount)}</span>
          </div>
        </div>

        <div>
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <h3>Shipping to</h3>
            <p style={{ margin: 0 }}>
              {order.shippingAddressLine}<br />
              {order.shippingCity}<br />
              {order.shippingCountry}
            </p>
          </div>

          <div className="card card-pad">
            <h3>Payments ({payments.length})</h3>
            {payments.length === 0 && (
              <p className="muted" style={{ margin: 0 }}>
                No payments yet — <Link to="/checkout" style={{ color: 'var(--primary)', fontWeight: 700 }}>complete payment</Link>.
              </p>
            )}
            {payments.map((p) => (
              <div key={p.id} className="review-item">
                <div className="review-head">
                  <span className="review-author">{p.paymentMethod}</span>
                  <span className={`badge ${p.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span>
                </div>
                <p className="review-text">{money(p.amount)} · {dateFmt(p.paymentDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
