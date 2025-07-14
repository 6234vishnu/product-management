import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductEditPage from "./components/ProductEditing";
import ProductDashboard from "./pages/ProductDashboard";
import ProductList from "./pages/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/create-product" element={<ProductForm />} />
          <Route path="/edit-product" element={<ProductEditPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
