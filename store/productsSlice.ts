'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  inStock: boolean;
};

type Filters = {
  categories: string[];
  inStockOnly: boolean;
};

type ProductsState = {
  products: Product[];
  filters: Filters;
};

const initialState: ProductsState = {
  products: [
    {
      "id": "1",
      "name": "Smartphone",
      "category": "Electronics",
      "stock": 25,
      "price": 499.99,
      "inStock": true
    },
    {
      "id": "2",
      "name": "Laptop",
      "category": "Electronics",
      "stock": 15,
      "price": 899.99,
      "inStock": true
    },
    {
      "id": "3",
      "name": "Jeans",
      "category": "Apparel",
      "stock": 30,
      "price": 39.99,
      "inStock": true
    },
    {
      "id": "4",
      "name": "T-shirt",
      "category": "Apparel",
      "stock": 50,
      "price": 19.99,
      "inStock": true
    },
    {
      "id": "5",
      "name": "Pizza",
      "category": "Food",
      "stock": 0,
      "price": 9.99,
      "inStock": false
    },
    {
      "id": "6",
      "name": "Coffee Maker",
      "category": "Electronics",
      "stock": 5,
      "price": 99.99,
      "inStock": true
    },
    {
      "id": "7",
      "name": "Smart Watch",
      "category": "Electronics",
      "stock": 10,
      "price": 199.99,
      "inStock": true
    },
    {
      "id": "8",
      "name": "Running Shoes",
      "category": "Apparel",
      "stock": 18,
      "price": 49.99,
      "inStock": true
    },
    {
      "id": "9",
      "name": "Salad",
      "category": "Food",
      "stock": 12,
      "price": 7.99,
      "inStock": true
    },
    {
      "id": "10",
      "name": "Blender",
      "category": "Electronics",
      "stock": 8,
      "price": 49.99,
      "inStock": true
    }
  ]
  ,
  filters: {
    categories: [],
    inStockOnly: false,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    editProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    batchDeleteProducts(state, action: PayloadAction<string[]>) {
      state.products = state.products.filter((p) => !action.payload.includes(p.id));
    },
    setCategoryFilter(state, action: PayloadAction<string[]>) {
      state.filters.categories = action.payload;
    },
    setInStockFilter(state, action: PayloadAction<boolean>) {
      state.filters.inStockOnly = action.payload;
    },
  },
});

export const {
  addProduct,
  editProduct,
  deleteProduct,
  batchDeleteProducts,
  setCategoryFilter,
  setInStockFilter,
} = productsSlice.actions;

export default productsSlice.reducer;
