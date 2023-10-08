const express = require('express')
require('dotenv').config()

const app = express();

// ENDPOINTS
const kamarRoutes = require('./routes/kamarRoutes')

// MIDDLEWARE
const pageNotFound = require('./utils/pageNotFound');

// Database & Env
dotenv.config();

// PORT AND PATH
const PORT = process.env.PORT || 8000;
const VERSION_API = '/api/v1';
const appendUrl = (url) => `${VERSION_API}${url}`;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTER
app.use(appendUrl('/kamar'), kamarRoutes);

// ENDPOINT NOT CREATED
app.use('/', pageNotFound);


app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
  });