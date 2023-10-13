const express = require('express')
const dotenv = require('dotenv');

const app = express();

// Database & Env
dotenv.config();

// MIDDLEWARE
const pageNotFound = require('./utils/pageNotFound');

// ENDPOINTS
const akunRoutes = require('./routes/akunRoutes')
const authRoutes = require('./routes/authRoutes')
const customerRoutes = require('./routes/customerRoutes')
const fasilitasRoutes = require('./routes/fasilitasRoutes')
const kamarRoutes = require('./routes/kamarRoutes')
const tarifRoutes = require('./routes/tarifRoutes')
const seasonRoutes = require('./routes/seasonRoutes')

// PORT AND PATH
const PORT = process.env.PORT || 6000;
const VERSION_API = '/api/v1';
const appendUrl = (url) => `${VERSION_API}${url}`;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTER
app.use(appendUrl('/akun'), akunRoutes);
app.use(appendUrl('/auth'), authRoutes);
app.use(appendUrl('/customer'), customerRoutes);
app.use(appendUrl('/fasilitas'), fasilitasRoutes);
app.use(appendUrl('/kamar'), kamarRoutes);
app.use(appendUrl('/tarif'), tarifRoutes);
app.use(appendUrl('/season'), seasonRoutes);

// ENDPOINT NOT CREATED
app.use('/', pageNotFound);


app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
  });