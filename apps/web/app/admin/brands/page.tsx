'use client';
import React, { useState, useEffect } from 'react';

export default function ManageBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [name, setName] = useState('');

  const fetchBrands = () => {
    fetch('http://localhost:5000/api/products/brands')
      .then(res => res.json())
      .then(setBrands);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/ /g, '-');
    await fetch('http://localhost:5000/api/products/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug })
    });
    setName('');
    fetchBrands();
    alert('Brand successfully added!');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Brands</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Brand Name</label>
                  <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <button className="btn btn-primary w-100">Add Brand</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <ul className="list-group shadow-sm">
            {brands.map(b => (
              <li key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
                {b.name}
                <span className="badge bg-secondary rounded-pill">{b.slug}</span>
              </li>
            ))}
            {brands.length === 0 && <li className="list-group-item text-muted">No brands registered yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
