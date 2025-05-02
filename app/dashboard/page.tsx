'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { deleteProduct, batchDeleteProducts } from '@/store/productsSlice';
import ProductTable from '@/components/dashboard/ProductTable';
import ProductModal from '@/components/dashboard/ProductModal';
import ConfirmationDialog from '@/components/dashboard/ConfirmationDialog';
import { Product } from '@/store/productsSlice';
import CategoryChart from '@/components/dashboard/CategoryChart';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBatchDelete, setIsBatchDelete] = useState(false);

  const products = useAppSelector((state) => state.products.products);
  const filters = useAppSelector((state) => state.products.filters);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedProductIds([id]);
    setIsBatchDelete(false);
    setConfirmOpen(true);
  };

  const handleBatchDelete = (ids: string[]) => {
    setSelectedProductIds(ids);
    setIsBatchDelete(true);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBatchDelete) {
      dispatch(batchDeleteProducts(selectedProductIds));
    } else {
      dispatch(deleteProduct(selectedProductIds[0]));
    }
    setConfirmOpen(false);
    setSelectedProductIds([]);
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.categories.length === 0 || filters.categories.includes(product.category);
    const stockMatch = !filters.inStockOnly || product.stock > 0;
    return categoryMatch && stockMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management Dashboard</h1>
      <CategoryChart products={products} key={"categoryChart"}/>
      <div className="mt-6">
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBatchDelete={handleBatchDelete}
        />
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            setSelectedProduct(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedProduct || undefined}
        // onSave={()=>{}}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Confirm Deletion"
        message={
          isBatchDelete
            ? `Are you sure you want to delete ${selectedProductIds.length} products?`
            : 'Are you sure you want to delete this product?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
