import { Sequelize, DataTypes } from "sequelize";
//database connection
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.PGDATABASE;
const dbUsername = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbURL = process.env.PGHOST_UNPOOLED;
const PORT = process.env.PORT;
const sequelize = new Sequelize(dbName,dbUsername,dbPassword, {
  host: dbURL,
  port: PORT,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {require: true, rejectUnauthorized: false},
  },
});

//define database schema
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
    console.log("Connected to PostgreSQL!!");
    await sequelize.sync({ alter: true });
    console.log("Table synchronized !");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};
export { sequelize, Product, connectDB };
