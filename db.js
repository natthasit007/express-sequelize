import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// ใช้ PGHOST (pooled ผ่าน PgBouncer) แทน PGHOST_UNPOOLED
// เพื่อป้องกันปัญหา "too many connections" บน serverless
const dbName = process.env.PGDATABASE;
const dbUser = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbURL = process.env.PGHOST;
const dbPort = process.env.PGPORT || 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbURL,
  port: dbPort,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 1, // แต่ละ serverless instance ใช้ connection น้อยที่สุด
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
});

// define database schema
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

// ป้องกันการเชื่อมต่อซ้ำหลาย instance บน serverless (cache connection)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!!");

    // sync/alter เฉพาะตอน dev เท่านั้น ไม่ควรรันทุก cold start บน production
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("Table synchronize!");
    }

    isConnected = true;
  } catch (error) {
    console.error("Connection failed", error);
    // อย่า process.exit() บน serverless — โยน error กลับให้ผู้เรียกจัดการแทน
    throw error;
  }
};

export { sequelize, Product, connectDB };