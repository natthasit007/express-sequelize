import { Sequelize, DataTypes } from "sequelize";
//database connection
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";

dotenv.config();

const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER;

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // ใช้ SSL เมื่อรันอยู่บน Render/Cloud
          },
        }
      : {}, // ไม่ใช้ SSL เมื่อรันบน Local Docker
  },
);

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL successfully!");
    await sequelize.sync({ alter: true });
    console.log("Table synchronized!");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

export { sequelize, Product, connectDB };
