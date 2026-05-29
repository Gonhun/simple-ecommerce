'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });
import Link from 'next/link';

const options = [
  { value: 'engine', label: 'Engine Parts' },
  { value: 'brakes', label: 'Brakes & Rotors' },
  { value: 'suspension', label: 'Suspension' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const chartOption = {
    title: { text: 'Sales by Category' },
    tooltip: {},
    xAxis: { data: ['Engine', 'Brakes', 'Suspension'] },
    yAxis: {},
    series: [{ name: 'Sales', type: 'bar', data: [120, 200, 150] }]
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to Spare Parts E-Commerce</h1>
        <div>
          <Link href="/login" className="btn btn-outline-primary me-2">Login</Link>
          <Link href="/register" className="btn btn-primary">Register</Link>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Search Category (Autocomplete):</label>
          <Select 
            options={options} 
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Select category..."
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <ReactECharts option={chartOption} />
          </div>
        </div>
      </div>
    </div>
  );
}
