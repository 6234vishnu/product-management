import { Request, Response } from "express";
import Product from "../models/productSchema";
import cloudinary from "../utils/cloudinary";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const getProducts = await Product.find();
    if (getProducts.length == 0)
      return res
        .status(400)
        .json({ success: false, message: "no products found" });
    return res.status(200).json({ success: true, products: getProducts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, description, status, date } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (error, result) => {
        if (error || !result) {
          return res
            .status(500)
            .json({ success: false, message: "Image upload failed" });
        }

        const newProduct = await Product.create({
          title,
          description,
          status,
          date,
          image: result.secure_url,
        });

        return res.status(201).json({ success: true, product: newProduct });
      }
    );

    // Pipe the image buffer to Cloudinary
    if (req.file && req.file.buffer) {
      const stream = result;
      stream.end(req.file.buffer);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, status, date } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields even if no image
    existingProduct.title = title ?? existingProduct.title;
    existingProduct.description = description ?? existingProduct.description;
    existingProduct.status = status ?? existingProduct.status;
    existingProduct.date = date ?? existingProduct.date;

    // If new image exists
    if (req.file && req.file.buffer) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        async (error, result) => {
          if (error || !result) {
            return res
              .status(500)
              .json({ success: false, message: "Image upload failed" });
          }

          existingProduct.image = result.secure_url;
          const updatedProduct = await existingProduct.save();
          return res
            .status(200)
            .json({ success: true, product: updatedProduct });
        }
      );

      uploadStream.end(req.file.buffer);
    } else {
      const updatedProduct = await existingProduct.save();
      return res.status(200).json({ success: true, product: updatedProduct });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
