import express from "express";
import { Product, connectDB } from "./db.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware เช็คการเชื่อมต่อ DB
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({ error: "Database connection failed: " + error.message });
  }
});

app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<b>Welcome to My Restful API using Sequelize</b>");
});

// ... [ใส่ Endpoint ต่างๆ เช่น /api/products เหมือนเดิม] ...

export default app;