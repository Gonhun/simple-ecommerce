'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5">Loading orders...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found. <Link href="/products">Start Shopping</Link></div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-light">
              <div>
                <strong>Order ID:</strong> {order.id.substring(0, 8).toUpperCase()}
                <br/>
                <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
              </div>
              <div>
                <span className={`badge ${order.status === 'Waiting for Payment' ? 'bg-warning text-dark' : 'bg-success'} p-2`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                {order.orderItems?.map((item: any) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between px-0">
                    <span>{item.product?.name || 'Unknown Product'} (x{item.quantity})</span>
                    <span>Rp {item.priceAtPurchase.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <span className="text-muted">Address: {order.shippingAddress}</span>
                <h5 className="mb-0">Total: <span className="text-primary font-weight-bold">Rp {order.totalAmount.toLocaleString()}</span></h5>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
