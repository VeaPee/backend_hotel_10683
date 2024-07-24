const request = require('supertest');
const express = require('express');
const { getAkun, updatePassword } = require('../controller/akunController');
const Response = require('../model/Response');
const prisma = require('../prisma/client');
const bcrypt = require('../utils/bcrypt');
const AkunPassValidator = require('../utils/akunPassValidator');
const Auth = require('../middleware/auth');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.currentUser = { id: 1, password: 'hashedpassword' }; // Mock user data
  next();
});

app.get('/api/v1/akun/profile', getAkun);
app.put('/api/v1/akun/edit-password', updatePassword);

describe('Akun API', () => {
  beforeAll(async () => {
    // Setup code if needed (e.g., seed the database)
  });

  afterAll(async () => {
    // Cleanup code if needed (e.g., close the database connection)
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Introduce a delay of 2 seconds between tests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  test('should return error for invalid old password', async () => {
    // Mock bcrypt.compare to return false
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const response = await request(app)
      .put('/api/v1/akun/edit-password')
      .send({
        oldPassword: 'wrongoldpassword',
        newPassword: 'newpassword',
        passwordConfirmation: 'newpassword', // Add the confirmation field
      })
      .expect('Content-Type', /json/)
      .expect(400);

    console.log('Update password invalid old password response:', response.body); // Debugging line

    expect(response.body.error).toBe(true);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Password lama tidak sesuai');
  });

  test('should handle errors during password update', async () => {
    // Mock AkunPassValidator to throw an error
    jest.spyOn(AkunPassValidator, 'validateAsync').mockRejectedValue(new Error('Validation error'));

    const response = await request(app)
      .put('/api/v1/akun/edit-password')
      .send({
        oldPassword: 'correctoldpassword',
        newPassword: 'newpassword',
        passwordConfirmation: 'newpassword', // Add the confirmation field
      })
      .expect('Content-Type', /json/)
      .expect(400);

    console.log('Update password error response:', response.body); // Debugging line

    expect(response.body.error).toBe(true);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Validation error');
  });
});