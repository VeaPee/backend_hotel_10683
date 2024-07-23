const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const authController = require('../controller/authController');

// Mock controller
jest.mock('../controller/authController');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user', async () => {
    authController.register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered' }));

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered');
  });

  it('should login a user', async () => {
    authController.login.mockImplementation((req, res) => res.status(200).json({ message: 'User logged in' }));

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User logged in');
  });

  it('should logout a user', async () => {
    authController.logout.mockImplementation((req, res) => res.status(200).json({ message: 'User logged out' }));

    const res = await request(app)
      .post('/api/v1/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User logged out');
  });
});
