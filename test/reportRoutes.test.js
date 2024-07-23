const request = require('supertest');
const express = require('express');
const reportRoutes = require('../routes/reportRoutes');
const reportController = require('../controller/reportController');

jest.mock('../controller/reportController');

const app = express();
app.use(express.json());
app.use('/api/v1/report', reportRoutes);

describe('Report Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/report/getAllCustomer', () => {
    it('should get all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John Doe' }];
      reportController.getAllCustomer.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Customer berhasil diterima',
          data: mockCustomers,
        });
      });

      const response = await request(app).get('/api/v1/report/getAllCustomer');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Customer berhasil diterima',
        data: mockCustomers,
      }));
      expect(reportController.getAllCustomer).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/report/getTopCustomer', () => {
    it('should get top customers', async () => {
      const mockTopCustomers = [{ id: 1, name: 'John Doe', spending: 5000 }];
      reportController.getTopCustomer.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Top Customers berhasil diterima',
          data: mockTopCustomers,
        });
      });

      const response = await request(app).get('/api/v1/report/getTopCustomer');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Top Customers berhasil diterima',
        data: mockTopCustomers,
      }));
      expect(reportController.getTopCustomer).toHaveBeenCalled();
    });
  });
});
