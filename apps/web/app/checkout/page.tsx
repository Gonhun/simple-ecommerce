'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/cart');
    }
    setCart(savedCart);
  }, [router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingAddress: address
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.removeItem('cart');
      alert('Order placed successfully!');
      router.push('/orders');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout Order</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Shipping Information</h5>
              <form onSubmit={handleCheckout}>
                <div className="mb-3">
                  <label className="form-label">Full Shipping Address</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    required 
                    placeholder="Enter your detailed shipping address..."
                  />
                </div>
                <div className="mb-4">
                  <small className="text-muted">Payment Method: Manual (Bank Transfer). Your order will be processed after payment verification.</small>
                </div>
                <button type="submit" className="btn btn-success btn-lg w-100" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              {cart.map(item => (
                <div key={item.productId} className="d-flex justify-content-between mb-2">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between font-weight-bold">
                <strong>Total Payment</strong>
                <strong>Rp {total.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
