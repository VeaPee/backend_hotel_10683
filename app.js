const express = require("express");
const dotenv = require("dotenv");
// const callAccessSecretVersionMySQL = require('./prisma/mysql');
const config = require("./config");
const cors = require("cors");
// MIDDLEWARE
const pageNotFound = require("./utils/pageNotFound");

const createServer = () => {
  const app = express();

  // Database & Env
  dotenv.config();
  // callAccessSecretVersionMySQL()
  console.log(config.MYSQL);

  // ENDPOINTS
  const akunRoutes = require("./routes/akunRoutes");
  const authRoutes = require("./routes/authRoutes");
  const customerRoutes = require("./routes/customerRoutes");
  const fasilitasRoutes = require("./routes/fasilitasRoutes");
  const kamarRoutes = require("./routes/kamarRoutes");
  const tarifRoutes = require("./routes/tarifRoutes");
  const seasonRoutes = require("./routes/seasonRoutes");
  const transaksiRoutes = require("./routes/transaksiRoutes");
  const reportRoutes = require("./routes/reportRoutes");

  // PORT AND PATH
  const PORT = process.env.PORT || 5000;
  const VERSION_API = "/api/v1";
  const appendUrl = (url) => `${VERSION_API}${url}`;

  // MIDDLEWARE
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // ROUTER
  app.use(appendUrl("/akun"), akunRoutes);
  app.use(appendUrl("/auth"), authRoutes);
  app.use(appendUrl("/customer"), customerRoutes);
  app.use(appendUrl("/fasilitas"), fasilitasRoutes);
  app.use(appendUrl("/kamar"), kamarRoutes);
  app.use(appendUrl("/tarif"), tarifRoutes);
  app.use(appendUrl("/season"), seasonRoutes);
  app.use(appendUrl("/transaksi"), transaksiRoutes);
  app.use(appendUrl("/report"), reportRoutes);

  // ENDPOINT NOT CREATED
  app.use("/", pageNotFound);

  return { app, PORT };
};

module.exports = createServer;
