const request = require('supertest');
const express = require('express');
const customerRoutes = require('../routes/customerRoutes');
const customerController = require('../controller/customerController');
const authMiddleware = require('../middleware/auth');

jest.mock('../controller/customerController');
jest.mock('../middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/v1/customer', customerRoutes);

describe('Customer Routes', () => {
  beforeEach(async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    // Introduce a delay of 2 seconds between tests
    await new Promise((resolve) => setTimeout(resolve, 3500));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/customer/getCustomer', () => {
    it('should get all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John Doe' }];
      customerController.getCustomer.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Customer berhasil diterima',
          data: mockCustomers,
        });
      });

      const response = await request(app).get('/api/v1/customer/getCustomer');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Customer berhasil diterima',
        data: mockCustomers,
      }));
      expect(customerController.getCustomer).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/customer/getCustomerByID/:id', () => {
    it('should get customer by ID', async () => {
      const mockCustomer = { id: 1, name: 'John Doe' };
      customerController.getCustomerByID.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { customer: mockCustomer },
        });
      });

      const response = await request(app).get('/api/v1/customer/getCustomerByID/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { customer: mockCustomer },
      }));
      expect(customerController.getCustomerByID).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/customer/addCustomer', () => {
    it('should add a customer', async () => {
      const mockCustomer = { id: 1, name: 'John Doe' };
      customerController.addCustomer.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Customer berhasil dibuat',
          data: mockCustomer,
        });
      });

      const response = await request(app)
        .post('/api/v1/customer/addCustomer')
        .send({ name: 'John Doe' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Customer berhasil dibuat',
        data: mockCustomer,
      }));
      expect(customerController.addCustomer).toHaveBeenCalledWith(expect.objectContaining({
        body: { name: 'John Doe' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/customer/updateCustomer/:id', () => {
    it('should update a customer', async () => {
      const mockUpdatedCustomer = { id: 1, name: 'John Doe Updated' };
      customerController.updateCustomer.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Customer berhasil diperbarui',
          data: mockUpdatedCustomer,
        });
      });

      const response = await request(app)
        .put('/api/v1/customer/updateCustomer/1')
        .send({ name: 'John Doe Updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Customer berhasil diperbarui',
        data: mockUpdatedCustomer,
      }));
      expect(customerController.updateCustomer).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
        body: { name: 'John Doe Updated' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/customer/getRiwayatTransaksi', () => {
    it('should get transaction history', async () => {
      const mockTransactions = [{ id: 1, status: 'Paid' }];
      customerController.getRiwayatTransaksi.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Riwayat berhasil diterima',
          data: mockTransactions,
        });
      });

      const response = await request(app).get('/api/v1/customer/getRiwayatTransaksi');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Riwayat berhasil diterima',
        data: mockTransactions,
      }));
      expect(customerController.getRiwayatTransaksi).toHaveBeenCalled();
    });
  });
});
