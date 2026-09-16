import { Sequelize, DataTypes } from "sequelize";
// database connection
import dotenv from "dotenv";
dotenv.config();
//const sequelize = new Sequelize("product_db", "dev_user", "dev_password", {
// host: "localhost",
//  port: 5439,
// dialect: "postgres",
// logging: false,
//});

const dbName = process.env.PGDATABASE;
const dbUser = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbURL = process.env.PGHOST_UNPOOLED;
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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!!");
    await sequelize.sync({ alter: true });
    console.log("Table syncronize !");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};
export { sequelize, Product, connectDB };
