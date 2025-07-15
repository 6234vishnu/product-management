import React, { useState, useMemo, useEffect } from "react";
import { Edit, Trash2, Search, Filter } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/productSlice";
import api from "../api/axiosInstance";
import Pagination from "../components/Pagination";
import ErrorModal from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessMessage";
import LoadingSpinner from "../components/Loader";
import SideBar from "../components/Sidebar";

interface Product {
  _id: any;
  title: string;
  description: string;
  status: "active" | "inactive";
  date: string;
  image?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | any>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/Products`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(Math.ceil((res.data.products || []).length / limit));
          setLoading(false);
        } else {
          setErrorMessage(res.data.message || "Something went wrong");
          setErrorModal(true);
        }
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || "Server error");
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  // Handle edit action
  const handleEdit = (product: any) => {
    dispatch(setSelectedProduct(product));
    navigate("/edit-product");
  };

  const confirmDelete = (producId: any) => {
    setDeleteModal(true);
    setProductId(producId);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/api/Products/${productId}`);
      if (res.data.success) {
        setSuccessMessage("Product Deleted Successfully");
        setSuccessModal(true);
        // Remove the deleted product from state
        setProducts(products.filter((product) => product._id !== productId));
        // Recalculate total pages
        setTotalPages(Math.ceil((products.length - 1) / limit));
      } else {
        setErrorMessage(res.data.message || "Something went wrong");
        setErrorModal(true);
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Server error");
      setErrorModal(true);
    } finally {
      setDeleteModal(false);
    }
  };

  // Filter products based on status and date range
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Status filter
      if (statusFilter && product.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (startDate && product.date < startDate) {
        return false;
      }
      if (endDate && product.date > endDate) {
        return false;
      }

      return true;
    });
  }, [products, statusFilter, startDate, endDate]);

  // Get paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredProducts.slice(startIndex, startIndex + limit);
  }, [filteredProducts, page, limit]);

  // Update total pages when filtered products change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / limit));
    // Reset to page 1 when filters change
    setPage(1);
  }, [filteredProducts, limit]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
  };

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  if (loading || products.length === 0) {
    return (
      <>
        <SideBar />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Product List</h1>
            <p className="text-gray-600">
              Manage your products with filtering and actions
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Start Date Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              {/* End Date Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products (out of {products.length} total)
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-[0_6px_10px_-2px_rgba(0,0,0,0.2)] border border-gray-200 overflow-hidden hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] transition-shadow"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="w-full h-48 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Product Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-black">
                      {product.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-gray-500 text-sm mb-4">
                    Date: {new Date(product.date).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination - Only show if there are products */}
          {filteredProducts.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setPage((prev) => prev + 1)}
            />
          )}
        </div>
      </div>
      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}
      {successModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}
      {deleteModal && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold text-black mb-3">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Do you want to delete this item?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setDeleteModal(false);
                }}
                className="px-4 py-2 rounded-md bg-white text-black border border-gray-300 shadow hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white shadow hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
