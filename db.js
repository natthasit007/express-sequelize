import { Sequelize, DataTypes } from "sequelize";

// ตรวจสอบ DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing in environment variables!");
}

// ตั้งค่า Sequelize รองรับ SSL สำหรับ Neon PostgreSQL
export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // จำเป็นสำหรับ Serverless & Neon DB
    },
  },
  logging: false, // ปิด log SQL queries ใน production
});

// โมเดล Product
export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// ฟังก์ชันเชื่อมต่อฐานข้อมูล
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // สร้าง/อัปเดตตารางอัตโนมัติหากยังไม่มี
    await sequelize.sync();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};