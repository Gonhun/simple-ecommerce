'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty. <Link href="/products">Start Shopping</Link></div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <ul className="list-group list-group-flush">
                {cart.map((item, index) => (
                  <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="mb-0 text-muted">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(index, -1)}>-</button>
                      <span className="mx-3">{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(index, 1)}>+</button>
                      <button className="btn btn-danger btn-sm ms-4" onClick={() => removeItem(index)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4 mt-4 mt-md-0">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <strong>Rp {total.toLocaleString()}</strong>
                </div>
                <Link href="/checkout" className="btn btn-primary w-100 btn-lg">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
