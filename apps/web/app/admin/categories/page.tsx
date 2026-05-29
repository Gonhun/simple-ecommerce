'use client';
import React, { useState, useEffect } from 'react';

export default function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  const fetchCategories = () => {
    fetch('http://localhost:5000/api/products/categories')
      .then(res => res.json())
      .then(setCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/ /g, '-');
    await fetch('http://localhost:5000/api/products/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug })
    });
    setName('');
    fetchCategories();
    alert('Category successfully added!');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Categories</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <button className="btn btn-primary w-100">Add Category</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <ul className="list-group shadow-sm">
            {categories.map(c => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                {c.name}
                <span className="badge bg-secondary rounded-pill">{c.slug}</span>
              </li>
            ))}
            {categories.length === 0 && <li className="list-group-item text-muted">No categories registered yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
