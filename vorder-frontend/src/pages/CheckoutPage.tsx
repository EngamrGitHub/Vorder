import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { orderApi } from '../api/order';
import { paymentApi } from '../api/payment';
import { addressApi } from '../api/address';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ErrorBox, Field, SelectField, EmptyState, money, dateFmt } from '../components/ui';
import type { AddressDto, CartItemDto, OrderDto } from '../api/types';

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Cash on delivery', 'Vodafone Cash', 'Fawry'];

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItemDto[]>([]);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [addressId, setAddressId] = useState('');
  const [line, setLine] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('Egypt');
  const [postal, setPostal] = useState('');

  const [placedOrder, setPlacedOrder] = useState<OrderDto | null>(null);
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState(false);

  const { refresh: refreshCartCount } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      const [cartRes, addrRes] = await Promise.all([cartApi.getMyCart(), addressApi.getUserAddresses()]);
      if (cartRes.isSuccess && cartRes.result) setCart(cartRes.result);
      if (addrRes.isSuccess && addrRes.result) setAddresses(addrRes.result);
      setLoaded(true);
    })();
  }, []);

  const cartTotal = cart.reduce((s, i) => s + (i.unitPrice ?? 0) * i.quantity, 0);

  const applyAddress = (id: string) => {
    setAddressId(id);
    const a = addresses.find((x) => x.id === id);
    if (a) {
      setLine(a.addressLine1);
      setCity(a.city);
      setProvince(a.province ?? '');
      setCountry(a.country);
      setPostal(a.postalCode ?? '');
    }
  };

  const placeOrder = async () => {
    setError(null);
    setBusy(true);
    const res = await orderApi.createOrder({
      items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      shippingAddressLine: line.trim(),
      shippingCity: city.trim(),
      shippingProvince: province.trim() || undefined,
      shippingCountry: country.trim(),
      shippingPostalCode: postal.trim() || undefined,
    });
    setBusy(false);
    if (res.isSuccess && res.result) {
      setPlacedOrder(res.result);
      push('success', `Order placed — total ${money(res.result.totalAmount)}`);
      await refreshCartCount();
    } else setError(res.errorMsg ?? 'Could not place order');
  };

  const pay = async () => {
    if (!placedOrder) return;
    setBusy(true);
    const res = await paymentApi.processPayment(placedOrder.id, placedOrder.totalAmount, method);
    setBusy(false);
    if (res.isSuccess) {
      setPaid(true);
      push('success', `Payment completed (${method})`);
    } else setError(res.errorMsg ?? 'Payment failed');
  };

  if (!loaded) return <p className="muted">Loading checkout…</p>;

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="card">
        <EmptyState icon="🛒" title="Nothing to check out" subtitle="Add products to your cart first.">
          <button className="btn btn-primary" onClick={() => navigate('/shops')}>Browse shops</button>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Checkout</h1>
          <p>{placedOrder ? 'Order placed — complete your payment' : 'Shipping details & payment'}</p>
        </div>
      </div>

      <ErrorBox message={error} />

      <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 1.6fr) minmax(270px, 1fr)', alignItems: 'start' }}>
        <div>
          {!placedOrder ? (
            <div className="card card-pad">
              <h3>1 · Shipping details</h3>

              {addresses.length > 0 && (
                <SelectField
                  label="Use a saved address"
                  value={addressId}
                  onChange={applyAddress}
                  placeholder="— Enter manually —"
                  options={addresses.map((a) => ({
                    value: a.id,
                    label: `${a.addressType}: ${a.addressLine1}, ${a.city}`,
                  }))}
                />
              )}

              <Field label="Address line" value={line} onChange={setLine} required placeholder="12 Tahrir St" />
              <div className="form-row">
                <Field label="City" value={city} onChange={setCity} required placeholder="Cairo" />
                <Field label="Province" value={province} onChange={setProvince} />
              </div>
              <div className="form-row">
                <Field label="Country" value={country} onChange={setCountry} required />
                <Field label="Postal code" value={postal} onChange={setPostal} />
              </div>

              <button
                className="btn btn-primary"
                disabled={busy || !line.trim() || !city.trim() || !country.trim()}
                onClick={placeOrder}
              >
                {busy ? 'Placing order…' : `Place order · est. ${money(cartTotal)}`}
              </button>
              <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>
                {cart.length} cart item{cart.length === 1 ? '' : 's'} · the API snapshots live prices and computes the final total.
              </p>
            </div>
          ) : (
            <div className="card card-pad">
              <h3>2 · Payment</h3>
              {paid ? (
                <>
                  <div className="alert alert-success">Payment completed via {method}. Thank you!</div>
                  <button className="btn btn-primary" onClick={() => navigate(`/orders/${placedOrder.id}`)}>
                    View order details
                  </button>
                </>
              ) : (
                <>
                  <SelectField
                    label="Payment method"
                    value={method}
                    onChange={setMethod}
                    options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
                  />
                  <button className="btn btn-primary" disabled={busy} onClick={pay}>
                    {busy ? 'Processing…' : `Pay ${money(placedOrder.totalAmount)}`}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="card card-pad">
          <h3>Order summary</h3>
          {!placedOrder
            ? cart.map((i) => (
                <div key={i.id} className="summary-row">
                  <span className="muted">{i.productName || 'Product'} × {i.quantity}</span>
                  <strong>{i.unitPrice != null ? money(i.unitPrice * i.quantity) : '—'}</strong>
                </div>
              ))
            : placedOrder.items.map((i, idx) => (
                <div key={idx} className="summary-row">
                  <span className="muted">{i.productName || 'Product'} × {i.quantity}</span>
                  <strong>{money(i.unitPrice * i.quantity)}</strong>
                </div>
              ))}
          <div className="summary-row summary-total">
            <span>Total{placedOrder ? '' : ' (est.)'}</span>
            <span className="price" style={{ fontSize: 20 }}>{money(placedOrder ? placedOrder.totalAmount : cartTotal)}</span>
          </div>
          {placedOrder && (
            <p className="small muted" style={{ marginBottom: 0 }}>
              Order #{placedOrder.id.slice(0, 8)} · {dateFmt(placedOrder.orderDate)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
