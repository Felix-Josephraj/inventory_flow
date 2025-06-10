import { configure, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page';
import { configureStore } from '@reduxjs/toolkit';
// Update the import path below if the actual path is different
import productsReducer from '../../store/productsSlice';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

const renderWithStore = (ui: React.ReactElement) => {
const store = configureStore({reducer: {products : productsReducer},
preloadedState:{
 products : {
  products: [],
  filters: {
    categories: [],
    inStockOnly: false,
  },
 }
}})

return render(<Provider store={store}>{ui}</Provider>)

}


describe('DashboardPage', () => {
 it('renders the dashboard page', () => {
  renderWithStore(<DashboardPage />);
  expect(screen.getByText(('Inventory Management Dashboard'))).toBeInTheDocument();
 })
 it("opens product modal when add product button is clicked", async ()=>{
  const user = userEvent.setup();
  renderWithStore(<DashboardPage />);
  // const addButton = screen.getByText("Add Product")
  const addButton = screen.getByRole("button",{name : /add product/i})
  await user.click(addButton)
  expect(screen.getByText(("Add Product modal"))).toBeInTheDocument()
 })
})