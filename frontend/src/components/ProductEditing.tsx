import React, { useState, useEffect } from "react";
import { Save, X, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import SideBar from "./Sidebar";
import LoadingSpinner from "./Loader";
import SuccessModal from "./SuccessMessage";
import api from "../api/axiosInstance";
import ErrorModal from "./ErrorMessage";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  title: string;
  description: string;
  status: "active" | "inactive";
  date: string;
  image?: string;
}

const ProductEditPage: React.FC = () => {
  const selectedProduct = useSelector(
    (state: RootState) => state.product.selectedProduct
  );

  const [formData, setFormData] = useState<Product | null | any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Populate form when product is available
  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
      setImagePreview(selectedProduct.image || null);
    }
  }, [selectedProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // For preview
      setFormData((prev: any) => (prev ? { ...prev, image: file } : null)); // Important: store File object
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    const formToSend = new FormData();

    formToSend.append("title", formData.title);
    formToSend.append("description", formData.description);
    formToSend.append("status", formData.status);
    formToSend.append("date", formData.date);

    // Append the image only if it's a File
    if (formData.image instanceof File) {
      formToSend.append("image", formData.image);
    }

    try {
      const response = await api.put(
        `/api/Products/${formData._id}`,
        formToSend
      );
      if (response.data.success) {
        setSuccessMessage("Product updated successfully!");
        setSuccessModal(true);
        setTimeout(() => {
          navigate("/product-list");
        }, 500);
        return;
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (error: any) {
      return setErrorMessage(error?.response?.data?.message);
    } finally {
      setSuccessModal(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (selectedProduct) {
      setFormData(selectedProduct);
      setImagePreview(selectedProduct.image || null);
    }
  };

  if (!formData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SideBar />

      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}

          <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
          <p className="text-gray-600">
            Update product information and settings
          </p>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2"
                  >
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Enter product title"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-vertical"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-2"
                  >
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Date Field */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium mb-2"
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Image
                  </label>

                  {/* Image Preview */}
                  <div className="mb-4">
                    {imagePreview ? (
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData((prev: any) =>
                                prev ? { ...prev, image: "" } : null
                              );
                            }}
                            className="bg-black text-white hover:bg-white hover:text-black p-1 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No image selected</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Upload Button */}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-white hover:text-black rounded-md transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Current Status Display */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium mb-3">Current Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          formData.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Last Updated:
                      </span>
                      <span className="text-sm text-gray-900">
                        {new Date(formData.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-white hover:text-black rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Information
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Images should be in JPG, PNG, or WebP format</li>
            <li>
              • Changes will be saved immediately after clicking "Save Changes"
            </li>
            <li>
              • You can cancel at any time to revert to the original values
            </li>
          </ul>
        </div>
      </div>
      {successModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}
      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
};

export default ProductEditPage;
