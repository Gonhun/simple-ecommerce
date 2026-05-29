'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(console.error);
  }, [params.id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    router.push('/cart');
  };

  if (!product) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/products">Products</a></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>
      <div className="row mt-4">
        <div className="col-md-6">
          {product.imageUrl ? (
            <img src={`http://localhost:5000${product.imageUrl}`} className="img-fluid rounded shadow-sm w-100" alt={product.name} style={{ maxHeight: '500px', objectFit: 'cover' }} />
          ) : (
            <div className="bg-light p-5 text-center rounded h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
              <span className="text-muted">No Image</span>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <span className="badge bg-secondary mb-2 me-2">{product.brand?.name || 'No Brand'}</span>
          <span className="badge bg-info mb-2">{product.category?.name || 'No Category'}</span>
          
          <h3 className="text-primary mt-3">Rp {product.price.toLocaleString()}</h3>
          <p className="mt-4"><strong>SKU/Part Number:</strong> {product.partNumber}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          
          {product.carCompatibility && (
            <div className="alert alert-info mt-3">
              <strong>Car Compatibility:</strong> {product.carCompatibility}
            </div>
          )}

          <p className="mt-4">{product.description}</p>
          
          <button className="btn btn-success btn-lg mt-3 w-100" onClick={addToCart} disabled={product.stock < 1}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
