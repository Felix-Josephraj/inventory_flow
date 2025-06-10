'use client';

import React, { useState, useEffect } from 'react';
import { addProduct, editProduct, Product } from '@/store/productsSlice';
import { useAppDispatch } from '@/store';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, initialData }) => {
  const [product, setProduct] = useState<Product>({ id: '', name: '', category: '', stock: 0, price: 0, inStock: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    } else {
      setProduct({ id: '', name: '', category: '', stock: 0, price: 0, inStock: false });
    }
    setErrors({}); // Reset errors when modal opens
  }, [initialData, isOpen]);

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' ? Number(value) : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '', // Clear error message when user types
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!product.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!product.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (product.stock < 0) {
      newErrors.stock = 'Stock must be greater than or equal to 0';
    }
    if (product.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const newProduct = {
      ...product,
      id: product.id || Date.now().toString(), // Generate id if not editing
      inStock: product.stock > 0,
    };

    dispatch(initialData ? editProduct(newProduct): addProduct(newProduct));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50" role='dialog'>
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4 text-gray-600">{initialData ? 'Edit Product' : 'Add Product modal'}</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={`mt-1 p-2 border rounded-md w-full text-gray-800 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter Product Name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className={`mt-1 p-2 border rounded-md w-full text-gray-800 ${errors.category ? 'border-red-500' : ''}`}
            placeholder="Enter Product Category"
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            min="0"
            onChange={handleChange}
            className={`mt-1 p-2 border rounded-md w-full text-gray-800 ${errors.stock ? 'border-red-500' : ''}`}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            min="0"
            onChange={handleChange}
            className={`mt-1 p-2 border rounded-md w-full text-gray-800 ${errors.price ? 'border-red-500' : ''}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            {initialData ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
