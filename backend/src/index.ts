import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import productRouter from "./routes/productRouter";

// Initialize configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware

app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Test route
app.get("/", (req, res) => {
  res.send("Product Management Backend is running");
});

app.use("/api", productRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
