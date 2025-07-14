import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import api from "../api/axiosInstance";
import SuccessModal from "./SuccessMessage";
import ErrorModal from "./ErrorMessage";
import SideBar from "./Sidebar";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
  date: z.string(),
  image: z.instanceof(File).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "active",
      date: "",
    },
  });

  const [preview, setPreview] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const response = await api.post("/api/Products", formData);

      if (response.data.success) {
        setSuccessMessage("Product created successfully!");
        setSuccessModal(true);
        return setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Something went wrong!");
      setErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                Create Product
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                encType="multipart/form-data"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Title
                  </label>
                  <input
                    {...register("title")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black bg-white"
                    placeholder="Enter product title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black bg-white resize-none"
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black bg-white"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white file:bg-blue-50 file:text-blue-700 file:py-2 file:px-4 file:rounded-md hover:file:bg-blue-100"
                  />
                  {preview && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-md shadow"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-black text-white hover:bg-white hover:text-black py-2 px-4 rounded-md transition duration-200 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Creating..." : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

export default ProductForm;
