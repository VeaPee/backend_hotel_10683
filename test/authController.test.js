const request = require('supertest');
const express = require('express');
const { register, login, logout } = require('../controller/authController');
const Response = require('../model/Response');
const prisma = require('../prisma/client');

const app = express();
app.use(express.json());
app.post('/api/v1/auth/register', register);
app.post('/api/v1/auth/login', login);
app.post('/api/v1/auth/logout', logout);

describe('Auth API', () => {
  beforeAll(async () => {
    // Setup code if needed (e.g., seed the database)
  });

  afterAll(async () => {
    // Cleanup code if needed (e.g., close the database connection)
    await prisma.$disconnect();
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    console.log('Register response:', response.body); // Debugging line

    expect(response.status).toBe(200);
  });

  test('should return an error if username already exists', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'existinguser',
        password: 'testpassword',
      });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'existinguser',
        password: 'testpassword',
      });

    console.log('Register duplicate response:', response.body); // Debugging line

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Username Sudah Ada');
  });

  test('should login with valid credentials', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'loginuser',
        password: 'loginpassword',
      });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'loginuser',
        password: 'loginpassword',
      });

    console.log('Login response:', response.body); // Debugging line

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });

  test('should return error with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'wronguser',
        password: 'wrongpassword',
      });

    console.log('Login invalid credentials response:', response.body); // Debugging line

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Invalid username atau password');
  });

  test('should log out successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/logout');

    console.log('Logout response:', response.body); // Debugging line

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});