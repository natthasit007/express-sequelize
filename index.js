import express from "express";
import { Product, connectDB } from "./db.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware เชื่อมต่อ DB เมื่อมี Request เข้ามา (ถ้าเชื่อมแล้ว Sequelize จะจัดการ Connection Pool ให้เอง)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Connection Error:", error);
    return res.status(500).json({ 
      error: "Database connection failed", 
      details: error.message 
    });
  }
});

app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<b>Welcome to My Restful API using Sequelize</b>");
});

// Create new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    if (name === undefined || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name and Price are required fields!!" });
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Price must be a valid non-negative number" });
    }
    const newProduct = await Product.create({
      name,
      price: numericPrice,
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update product by ID
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (name === undefined && price === undefined) {
      return res
        .status(400)
        .json({ message: "At least one of Name or Price is required!!" });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let numericPrice = product.price;
    if (price !== undefined) {
      numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: "Price must be a valid non-negative number" });
      }
    }

    await product.update({
      name: name !== undefined ? name : product.name,
      price: numericPrice,
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete product by ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    return res.status(200).json({
      message: "Product is deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// รันเฉพาะกรณีไม่ได้อยู่บนสภาพแวดล้อม Serverless/Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
  });
}

export default app;