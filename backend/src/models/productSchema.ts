import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  status: "active" | "inactive";
  date: string;
  image?: string;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    date: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

// 3. Model
const Product = model<IProduct>("Product", ProductSchema);
export default Product;
