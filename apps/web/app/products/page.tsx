'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Product Catalog</h2>
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No products available yet.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {product.imageUrl && (
                  <img src={`http://localhost:5000${product.imageUrl}`} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">SKU: {product.partNumber}</h6>
                  <p className="card-text text-truncate">{product.description}</p>
                  <p className="card-text"><strong>Rp {product.price.toLocaleString()}</strong></p>
                  <Link href={`/products/${product.id}`} className="btn btn-primary w-100">View Details</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
