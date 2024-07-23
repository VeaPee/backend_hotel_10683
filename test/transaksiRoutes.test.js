const request = require('supertest');
const express = require('express');
const transaksiRoutes = require('../routes/transaksiRoutes');
const transaksiController = require('../controller/transaksiController');
const authMiddleware = require('../middleware/auth');

jest.mock('../controller/transaksiController');
jest.mock('../middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/v1/transaksi', transaksiRoutes);

describe('Transaksi Routes', () => {
  beforeEach(() => {
    authMiddleware.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/transaksi/transaksiReservasi', () => {
    it('should handle reservation transaction', async () => {
      const mockResponse = { success: true, message: 'Reservation transaction processed' };
      transaksiController.transaksiReservasi.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/v1/transaksi/transaksiReservasi')
        .send({ reservationDetails: {} });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.transaksiReservasi).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/transaksi/transaksiKamar', () => {
    it('should handle room transaction', async () => {
      const mockResponse = { success: true, message: 'Room transaction processed' };
      transaksiController.transaksiKamar.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/v1/transaksi/transaksiKamar')
        .send({ roomDetails: {} });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.transaksiKamar).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/transaksi/transaksiFasilitas', () => {
    it('should handle facility transaction', async () => {
      const mockResponse = { success: true, message: 'Facility transaction processed' };
      transaksiController.transaksiFasilitas.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/v1/transaksi/transaksiFasilitas')
        .send({ facilityDetails: {} });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.transaksiFasilitas).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/transaksi/konfirmasiResume/:id', () => {
    it('should confirm resume by ID', async () => {
      const mockResponse = { success: true, message: 'Resume confirmed' };
      transaksiController.konfirmasiResume.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).post('/api/v1/transaksi/konfirmasiResume/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.konfirmasiResume).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/transaksi/konfirmasiPembayaran/:id', () => {
    it('should confirm payment by ID', async () => {
      const mockResponse = { success: true, message: 'Payment confirmed' };
      transaksiController.konfirmasiPembayaran.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).put('/api/v1/transaksi/konfirmasiPembayaran/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.konfirmasiPembayaran).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/transaksi/pembatalanReservasi/:id', () => {
    it('should handle reservation cancellation by ID', async () => {
      const mockResponse = { success: true, message: 'Reservation cancelled' };
      transaksiController.pembatalanReservasi.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).put('/api/v1/transaksi/pembatalanReservasi/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.pembatalanReservasi).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/transaksi/checkIn/:id', () => {
    it('should handle check-in by ID', async () => {
      const mockResponse = { success: true, message: 'Checked in successfully' };
      transaksiController.checkIn.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).put('/api/v1/transaksi/checkIn/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.checkIn).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/transaksi/checkOut/:id', () => {
    it('should handle check-out by ID', async () => {
      const mockResponse = { success: true, message: 'Checked out successfully' };
      transaksiController.checkOut.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).put('/api/v1/transaksi/checkOut/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.checkOut).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/transaksi/tambahFasilitasNota/:id', () => {
    it('should add facility to note by ID', async () => {
      const mockResponse = { success: true, message: 'Facility added to note' };
      transaksiController.tambahFasilitasNota.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).put('/api/v1/transaksi/tambahFasilitasNota/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(transaksiController.tambahFasilitasNota).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });
});
