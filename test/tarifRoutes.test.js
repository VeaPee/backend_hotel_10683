const request = require('supertest');
const express = require('express');
const tarifRoutes = require('../routes/tarifRoutes');
const tarifController = require('../controller/tarifController');
const authMiddleware = require('../middleware/auth');

jest.mock('../controller/tarifController');
jest.mock('../middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/v1/tarif', tarifRoutes);

describe('Tarif Routes', () => {
  beforeEach(() => {
    authMiddleware.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/tarif/getAllTarif', () => {
    it('should get all tarifs', async () => {
      const mockTarifs = [{ id: 1, harga: 100000 }];
      tarifController.getAllTarif.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Tarif berhasil diterima',
          data: mockTarifs,
        });
      });

      const response = await request(app).get('/api/v1/tarif/getAllTarif');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Tarif berhasil diterima',
        data: mockTarifs,
      }));
      expect(tarifController.getAllTarif).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/tarif/getTarifByID/:id', () => {
    it('should get tarif by ID', async () => {
      const mockTarif = { id: 1, harga: 100000 };
      tarifController.getTarifByID.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { tarif: mockTarif },
        });
      });

      const response = await request(app).get('/api/v1/tarif/getTarifByID/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { tarif: mockTarif },
      }));
      expect(tarifController.getTarifByID).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/tarif/getTarifByKamar/:kamarId', () => {
    it('should get tarif by kamar ID', async () => {
      const mockTarif = { id: 1, kamarId: 2, harga: 100000 };
      tarifController.getTarifByKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { tarif: mockTarif },
        });
      });

      const response = await request(app).get('/api/v1/tarif/getTarifByKamar/2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { tarif: mockTarif },
      }));
      expect(tarifController.getTarifByKamar).toHaveBeenCalledWith(expect.objectContaining({
        params: { kamarId: '2' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/tarif/getTarifByHarga/:harga', () => {
    it('should get tarif by harga', async () => {
      const mockTarif = { id: 1, harga: 100000 };
      tarifController.getTarifByHarga.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { tarif: mockTarif },
        });
      });

      const response = await request(app).get('/api/v1/tarif/getTarifByHarga/100000');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { tarif: mockTarif },
      }));
      expect(tarifController.getTarifByHarga).toHaveBeenCalledWith(expect.objectContaining({
        params: { harga: '100000' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/tarif/getTarifByRangeHarga/:min/:max', () => {
    it('should get tarifs by price range', async () => {
      const mockTarifs = [{ id: 1, harga: 100000 }];
      tarifController.getTarifByRangeHarga.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: mockTarifs,
        });
      });

      const response = await request(app).get('/api/v1/tarif/getTarifByRangeHarga/50000/150000');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: mockTarifs,
      }));
      expect(tarifController.getTarifByRangeHarga).toHaveBeenCalledWith(expect.objectContaining({
        params: { min: '50000', max: '150000' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/tarif/addTarif', () => {
    it('should add a new tarif', async () => {
      const mockTarif = { id: 1, harga: 100000 };
      tarifController.addTarif.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Tarif berhasil ditambahkan',
          data: mockTarif,
        });
      });

      const response = await request(app)
        .post('/api/v1/tarif/addTarif')
        .send({ harga: 100000 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Tarif berhasil ditambahkan',
        data: mockTarif,
      }));
      expect(tarifController.addTarif).toHaveBeenCalledWith(expect.objectContaining({
        body: { harga: 100000 },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/tarif/updateTarif/:id', () => {
    it('should update a tarif', async () => {
      const mockUpdatedTarif = { id: 1, harga: 120000 };
      tarifController.updateTarif.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Tarif berhasil diperbarui',
          data: mockUpdatedTarif,
        });
      });

      const response = await request(app)
        .put('/api/v1/tarif/updateTarif/1')
        .send({ harga: 120000 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Tarif berhasil diperbarui',
        data: mockUpdatedTarif,
      }));
      expect(tarifController.updateTarif).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
        body: { harga: 120000 },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('DELETE /api/v1/tarif/deleteTarif/:id', () => {
    it('should delete a tarif', async () => {
      tarifController.deleteTarif.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Tarif berhasil dihapus',
        });
      });

      const response = await request(app).delete('/api/v1/tarif/deleteTarif/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Tarif berhasil dihapus',
      }));
      expect(tarifController.deleteTarif).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });
});
