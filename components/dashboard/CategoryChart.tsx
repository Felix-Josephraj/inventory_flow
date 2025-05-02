'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';
import { Product } from '@/store/productsSlice';

type CategoryChartProps = {
  products: Product[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#8866EE'];

const CategoryChart: React.FC<CategoryChartProps> = ({ products }) => {
  // Group products by category
  const categoryData = Object.values(
    products.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || { name: product.category, value: 0 };
      acc[product.category].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full h-[300px] mb-12">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Products by Category</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
