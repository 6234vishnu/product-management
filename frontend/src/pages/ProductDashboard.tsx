import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Star,
  Zap,
  Eye,
} from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    const getProduct = async () => {
      try {
        const res = await api.get(`/api/Products`);
        if (res.data.success) {
          setProducts(res.data.products.slice(0, 2));
          setLoading(false);
        } else {
          setErrorMessage(res.data.message || "Something went wrong");
          setErrorModal(true);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err?.response?.data?.message || "Server error");
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, []);

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

  if (loading||!products) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-white text-black">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-600">
              Manage your product inventory and listings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
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
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-black rounded-full">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </button>
              );
            })}
          </div>

          {/* Products List */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Products</h2>
              <button
                onClick={() => navigate("/product-list")}
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                View All Products
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Brand</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">{product.brand}</td>
                      <td className="py-4 px-4">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-md text-sm ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {product.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
