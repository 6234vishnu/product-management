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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Floating Header with Glassmorphism Effect */}
        <div
          className={`mb-8 relative transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-gray-800/5 to-black/10 animate-gradient-x"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-black/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-gray-800/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                    Product Management
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium">
                    Streamline your inventory with intelligent design
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staggered Stats Cards with Unique Layouts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isEven ? 'hover:rotate-1' : 'hover:-rotate-1'
                } overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-black/10 to-transparent rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br from-black to-gray-800 rounded-xl shadow-lg group-hover:scale-125 transition-transform duration-500 ${
                      isEven ? 'group-hover:rotate-12' : 'group-hover:-rotate-12'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-black text-black mb-1 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-1 bg-gradient-to-r from-black via-gray-600 to-gray-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hexagonal Quick Actions Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Quick Actions</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-black to-gray-800 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 rounded-full blur-lg opacity-20 scale-110"></div>
                      <div className="relative p-4 bg-gradient-to-br from-black to-gray-800 rounded-full shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-center text-gray-900 group-hover:text-black transition-colors duration-300">
                      {action.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Section with Modern Card Design */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Enhanced Header */}
            <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100 p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5"></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Products</h2>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Manage your product inventory with precision</p>
                </div>
                <button
                  onClick={() => navigate("/product-list")}
                  className="group relative bg-gradient-to-r from-black to-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    View All Products
                    <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  </span>
                </button>
              </div>
            </div>

            {/* Enhanced No Products State */}
            {products.length === 0 ? (
              <div className="text-center py-16 sm:py-20 px-6">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative">
                    <Package className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-400 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-full blur-2xl"></div>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 text-sm sm:text-base max-w-md mx-auto">Start building your inventory by adding your first product</p>
                <button
                  onClick={() => navigate("/create-product")}
                  className="group relative bg-gradient-to-r from-black to-gray-800 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Add Product</span>
                </button>
              </div>
            ) : (
              /* Revolutionary Table Design */
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left py-5 px-6 font-black text-gray-900 uppercase tracking-wide text-xs sm:text-sm">Product</th>
                      <th className="text-left py-5 px-6 font-black text-gray-900 uppercase tracking-wide text-xs sm:text-sm">Status</th>
                      <th className="text-left py-5 px-6 font-black text-gray-900 uppercase tracking-wide text-xs sm:text-sm">Date Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.slice(0, 5).map((product, index) => (
                      <tr
                        key={index}
                        className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300 hover:shadow-lg"
                      >
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover rounded-2xl"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 line-clamp-1 mb-1 text-sm sm:text-base group-hover:text-black transition-colors duration-300">
                                {product.title}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 group-hover:text-gray-600 transition-colors duration-300">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="relative">
                            <span
                              className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                                product.status === "active"
                                  ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800 group-hover:bg-gray-200"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                product.status === "active" ? "bg-green-500" : "bg-gray-500"
                              } group-hover:scale-150 transition-transform duration-300`}></span>
                              {product.status?.charAt(0).toUpperCase() +
                                product.status?.slice(1) || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-xs sm:text-sm text-gray-500 font-semibold group-hover:text-gray-700 transition-colors duration-300">
                            {product.date}
                          </span>
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
