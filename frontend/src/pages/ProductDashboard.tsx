import React, { useState, useEffect } from "react";
import { Package, Plus, Star, Zap, Eye } from "lucide-react";
import SideBar from "../components/Sidebar";
import api from "../api/axiosInstance";
import LoadingSpinner from "../components/Loader";
import ErrorModal from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  status: "active" | "inactive";
  date: string;
}

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading true
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/api/Products`);

        if (res.data.success) {
          setProducts(res.data.products.slice(0, 3));
        } else {
          setErrorMessage(res.data.message || "Failed to load products");
          setErrorModal(true);
        }
      } catch (err: any) {
        setErrorMessage(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to connect to server"
        );
        setErrorModal(true);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    getProduct();
  }, []);

  // Calculate stats based on actual products data
  const stats = [
    {
      value: products.length,
      label: "Total Products",
      icon: Package,
    },
    {
      value: products.filter((p) => p.status === "active").length,
      label: "Active Products",
      icon: Zap,
    },
    {
      value: "4.8",
      label: "Average Rating",
      icon: Star,
    },
    {
      value: "2,345",
      label: "Views Today",
      icon: Eye,
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Add Product",
      action: () => navigate("/create-product"),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
  <>
    <SideBar />
    <div className="min-h-screen bg-white text-black">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`mb-6 sm:mb-8 transition-all duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            Product Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your product inventory and listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <div className="p-2 bg-black rounded-full">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-black rounded-full">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium whitespace-nowrap">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products List */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Products</h2>
            <button
              onClick={() => navigate("/product-list")}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              View All Products
            </button>
          </div>

          {/* Show message if no products */}
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm">Add your first product to get started</p>
              <button
                onClick={() => navigate("/create-product")}
                className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
              >
                Add Product
              </button>
            </div>
          ) : (
            /* Table Wrapper for overflow */
            <div className="w-full overflow-x-auto">
              <table className="min-w-full w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4">Product</th>
                    <th className="text-left py-3 px-2 sm:px-4">Category</th>
                    <th className="text-left py-3 px-2 sm:px-4">Brand</th>
                    <th className="text-left py-3 px-2 sm:px-4">Price</th>
                    <th className="text-left py-3 px-2 sm:px-4">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4">Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-md flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                // Fallback for broken images
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="min-w-[120px]">
                            <p className="font-medium text-sm sm:text-base line-clamp-1">
                              {product.title}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-sm sm:text-base">
                        {product.brand}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-sm sm:text-base">
                        ${product.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs sm:text-sm ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status?.charAt(0).toUpperCase() +
                            product.status?.slice(1) || "Unknown"}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-500">
                        {product.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    {errorModal && (
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorModal(false)}
      />
    )}
  </>
);
};

export default ProductDashboard;
