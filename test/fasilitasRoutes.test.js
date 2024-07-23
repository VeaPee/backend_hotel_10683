const request = require('supertest');
const express = require('express');
const fasilitasRoutes = require('../routes/fasilitasRoutes');
const fasilitasController = require('../controller/fasilitasController');

jest.mock('../controller/fasilitasController');

const app = express();
app.use(express.json());
app.use('/api/v1/fasilitas', fasilitasRoutes);

describe('Fasilitas Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/fasilitas/getAllFasilitas', () => {
    it('should get all fasilitas', async () => {
      const mockFasilitas = [{ id: 1, name: 'Pool' }];
      fasilitasController.getAllFasilitas.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Fasilitas berhasil diterima',
          data: mockFasilitas,
        });
      });

      const response = await request(app).get('/api/v1/fasilitas/getAllFasilitas');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Fasilitas berhasil diterima',
        data: mockFasilitas,
      }));
      expect(fasilitasController.getAllFasilitas).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/fasilitas/getFasilitasByID/:id', () => {
    it('should get fasilitas by ID', async () => {
      const mockFasilitas = { id: 1, name: 'Pool' };
      fasilitasController.getFasilitasByID.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { fasilitas: mockFasilitas },
        });
      });

      const response = await request(app).get('/api/v1/fasilitas/getFasilitasByID/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { fasilitas: mockFasilitas },
      }));
      expect(fasilitasController.getFasilitasByID).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/fasilitas/getFasilitasByNama/:nama_fasilitas', () => {
    it('should get fasilitas by name', async () => {
      const mockFasilitas = { id: 1, name: 'Pool' };
      fasilitasController.getFasilitasByNama.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { fasilitas: mockFasilitas },
        });
      });

      const response = await request(app).get('/api/v1/fasilitas/getFasilitasByNama/Pool');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { fasilitas: mockFasilitas },
      }));
      expect(fasilitasController.getFasilitasByNama).toHaveBeenCalledWith(expect.objectContaining({
        params: { nama_fasilitas: 'Pool' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/fasilitas/addFasilitas', () => {
    it('should add a fasilitas', async () => {
      const mockFasilitas = { id: 1, name: 'Pool' };
      fasilitasController.addFasilitas.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Fasilitas berhasil dibuat',
          data: mockFasilitas,
        });
      });

      const response = await request(app)
        .post('/api/v1/fasilitas/addFasilitas')
        .send({ name: 'Pool' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Fasilitas berhasil dibuat',
        data: mockFasilitas,
      }));
      expect(fasilitasController.addFasilitas).toHaveBeenCalledWith(expect.objectContaining({
        body: { name: 'Pool' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/fasilitas/updateFasilitas/:id', () => {
    it('should update a fasilitas', async () => {
      const mockUpdatedFasilitas = { id: 1, name: 'Pool Updated' };
      fasilitasController.updateFasilitas.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Fasilitas berhasil diperbarui',
          data: mockUpdatedFasilitas,
        });
      });

      const response = await request(app)
        .put('/api/v1/fasilitas/updateFasilitas/1')
        .send({ name: 'Pool Updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Fasilitas berhasil diperbarui',
        data: mockUpdatedFasilitas,
      }));
      expect(fasilitasController.updateFasilitas).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
        body: { name: 'Pool Updated' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('DELETE /api/v1/fasilitas/deleteFasilitas/:id', () => {
    it('should delete a fasilitas', async () => {
      fasilitasController.deleteFasilitas.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Fasilitas berhasil dihapus',
        });
      });

      const response = await request(app).delete('/api/v1/fasilitas/deleteFasilitas/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Fasilitas berhasil dihapus',
      }));
      expect(fasilitasController.deleteFasilitas).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });
});
