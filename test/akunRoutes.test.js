const request = require('supertest');
const express = require('express');
const akunRoutes = require('../routes/akunRoutes');
const Auth = require('../middleware/auth');
const akunController = require('../controller/akunController');

// Mock middleware and controller
jest.mock('../middleware/auth', () => (req, res, next) => next());
jest.mock('../controller/akunController');

const app = express();
app.use(express.json());
app.use('/api/v1/akun', akunRoutes);

describe('Akun Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get akun profile', async () => {
    akunController.getAkun.mockImplementation((req, res) => res.status(200).json({ message: 'Profile found' }));

    const res = await request(app).get('/api/v1/akun/profile');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Profile found');
  });

  it('should update password', async () => {
    akunController.updatePassword.mockImplementation((req, res) => res.status(200).json({ message: 'Password updated' }));

    const res = await request(app)
      .put('/api/v1/akun/edit-password')
      .send({ password: 'newpassword' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Password updated');
  });

  it('should return 401 if not authenticated', async () => {
    // Simulate Auth middleware rejecting the request
    jest.resetModules(); // Clear the module cache to reset Auth middleware
    jest.mock('../middleware/auth', () => (req, res) => res.status(401).json({ message: 'Unauthorized' }));

    const appWithAuth = express();
    appWithAuth.use(express.json());
    appWithAuth.use('/api/v1/akun', require('../routes/akunRoutes'));

    const res = await request(appWithAuth).get('/api/v1/akun/profile');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
