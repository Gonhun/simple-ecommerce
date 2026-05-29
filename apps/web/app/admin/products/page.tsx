'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function RegisterProduct() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [carCompatibility, setCarCompatibility] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/categories').then(r => r.json()).then(setCategories);
    fetch('http://localhost:5000/api/products/brands').then(r => r.json()).then(setBrands);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedBrand) {
      alert('Please select Category and Brand first!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('categoryId', selectedCategory.value);
    formData.append('brandId', selectedBrand.value);
    formData.append('carCompatibility', carCompatibility);
    if (image) {
      formData.append('image', image);
    }

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Product successfully registered! SKU / Part Number is auto-generated.');
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCarCompatibility('');
      setSelectedCategory(null);
      setSelectedBrand(null);
      setImage(null);
    } else {
      const data = await res.json();
      alert('Failed: ' + data.error);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const brandOptions = brands.map(b => ({ value: b.id, label: b.name }));

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white py-3">
          <h4 className="mb-0">Register New Product / Spare Part</h4>
        </div>
        <div className="card-body p-4 bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Part Name</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required placeholder="Example: Front Brake Pads" />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-bold">Category</label>
                <Select options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} placeholder="Select Category..." />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-bold">Brand</label>
                <Select options={brandOptions} value={selectedBrand} onChange={setSelectedBrand} placeholder="Select Brand..." />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Price (Rp)</label>
                <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required min="0" placeholder="150000" />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Initial Stock</label>
                <input type="number" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required min="0" placeholder="10" />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Car Compatibility (Comma separated)</label>
                <input type="text" className="form-control" value={carCompatibility} onChange={e => setCarCompatibility(e.target.value)} placeholder="Example: Toyota Camry 2020, Honda Civic" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Full Description</label>
              <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe specifications, warranty, or other part details..."/>
            </div>

            <div className="mb-4 bg-white p-3 border rounded">
              <label className="form-label fw-bold">Upload Product Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} />
              <div className="form-text mt-2 text-info">
                <i className="bi bi-info-circle"></i> The system will automatically rename the image file based on the generated SKU (Part Number).
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100">Save Product to Catalog</button>
          </form>
        </div>
      </div>
    </div>
  );
}
