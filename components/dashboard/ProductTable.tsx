'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/store/productsSlice';

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
};

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, onBatchDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<keyof Product | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'in' | 'out'>('in');

  const handleRowSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    onBatchDelete(selectedIds);
    setSelectedIds([]);
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (filterCategory) {
      data = data.filter(product => product.category === filterCategory);
    }

    if (filterStock === 'in') {
      data = data.filter(product => product.stock > 0);
    } else if (filterStock === 'out') {
      data = data.filter(product => product.stock === 0);
    }

    if (sortField) {
      data.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return data;
  }, [products, filterCategory, filterStock, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg p-4 text-white">
      {/* Filters */}
      <div className="flex flex-wrap mb-4 gap-4">
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value)
            setCurrentPage(1)
          }}
          className="bg-gray-700 p-2 rounded"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((p) => p.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* <select
          value={filterStock}
          onChange={(e) => {
            setFilterStock(e.target.value as "all" | "in" | "out")
            setCurrentPage(1)
          }}
          className="bg-gray-700 p-2 rounded"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select> */}
        <div className="flex items-center gap-2">
          <label htmlFor="inStock" className="block text-base font-medium color text-white">
            In Stock
          </label>
          <input
            id="inStock"
            type="checkbox"
            checked={filterStock === "in" ? true : false}
            onChange={(e) => {
              setFilterStock(e.target.checked ? "in" : "out")
            }}
            // className="mt-1"
          />
        </div>

        {selectedIds.length > 0 && (
          <button onClick={handleBatchDelete} className="bg-red-600 px-4 py-2 rounded">
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-700 text-left">Select</th>
            <th className="px-4 py-2 bg-gray-700 text-left cursor-pointer" onClick={() => handleSort("name")}>
              Product Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-2 bg-gray-700 text-left cursor-pointer" onClick={() => handleSort("category")}>
              Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-2 bg-gray-700 text-left cursor-pointer" onClick={() => handleSort("stock")}>
              Stock {sortField === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-2 bg-gray-700 text-left cursor-pointer" onClick={() => handleSort("price")}>
              Price {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-2 bg-gray-700 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.id} className="border-b border-gray-600">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => handleRowSelect(product.id)}
                />
              </td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">
                {product.stock}
                {product.stock <= 5 && ( // <= 5 means low stock
                  <span className="text-red-500 ml-2 text-xs font-semibold">Low Stock</span>
                )}
              </td>
              <td className="px-4 py-2">${product.price}</td>
              <td className="px-4 py-2">
                <button onClick={() => onEdit(product)} className="bg-blue-500 px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => onDelete(product.id)} className="bg-red-500 px-3 py-1 rounded ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {paginatedProducts.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default ProductTable;


// 'use client';

// import React from 'react';
// import { Product } from '@/store/productsSlice';

// type ProductTableProps = {
//   products: Product[];
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
//   onBatchDelete: (ids: string[]) => void;
// };

// const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, onBatchDelete }) => {
//   const handleRowSelect = (id: string) => {
//     // Handle row selection logic
//   };

//   return (
//     <div className="overflow-x-autobg-gray-800 shadow-md rounded-lg p-4">
//       <table className="min-w-full table-auto text-white">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 bg-gray-700 text-left">Select</th>
//             <th className="px-4 py-2 bg-gray-700 text-left">Product Name</th>
//             <th className="px-4 py-2 bg-gray-700 text-left">Category</th>
//             <th className="px-4 py-2 bg-gray-700 text-left">Stock</th>
//             <th className="px-4 py-2 bg-gray-700 text-left">Price</th>
//             <th className="px-4 py-2 bg-gray-700 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr key={product.id} className="border-b border-gray-600">
//               <td className="px-4 py-2">
//                 <input type="checkbox" onChange={() => handleRowSelect(product.id)} />
//               </td>
//               <td className="px-4 py-2">{product.name}</td>
//               <td className="px-4 py-2">{product.category}</td>
//               <td className="px-4 py-2">{product.stock}</td>
//               <td className="px-4 py-2">${product.price}</td>
//               <td className="px-4 py-2">
//                 <button onClick={() => onEdit(product)} className="bg-blue-500 text-white px-4 py-2 rounded">
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => onDelete(product.id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded ml-2"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductTable;
