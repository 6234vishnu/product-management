import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB Connected ");
  } catch (error) {
    console.log("error in database connnection", error);
    process.exit(1);
  }
};

export default connectDB;
