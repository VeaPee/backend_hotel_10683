const request = require('supertest');
const express = require('express');
const kamarRoutes = require('../routes/kamarRoutes');
const kamarController = require('../controller/kamarController');

jest.mock('../controller/kamarController');

const app = express();
app.use(express.json());
app.use('/api/v1/kamar', kamarRoutes);

describe('Kamar Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/kamar/getAllKamar', () => {
    it('should get all kamar', async () => {
      const mockKamar = [{ id: 1, jenis: 'Deluxe' }];
      kamarController.getAllKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Kamar berhasil diterima',
          data: mockKamar,
        });
      });

      const response = await request(app).get('/api/v1/kamar/getAllKamar');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Kamar berhasil diterima',
        data: mockKamar,
      }));
      expect(kamarController.getAllKamar).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/kamar/getKamarByID/:id', () => {
    it('should get kamar by ID', async () => {
      const mockKamar = { id: 1, jenis: 'Deluxe' };
      kamarController.getKamarByID.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { kamar: mockKamar },
        });
      });

      const response = await request(app).get('/api/v1/kamar/getKamarByID/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { kamar: mockKamar },
      }));
      expect(kamarController.getKamarByID).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/kamar/getKamarByJenis/:jenisKamar', () => {
    it('should get kamar by jenis', async () => {
      const mockKamar = [{ id: 1, jenis: 'Deluxe' }];
      kamarController.getKamarByJenis.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { kamar: mockKamar },
        });
      });

      const response = await request(app).get('/api/v1/kamar/getKamarByJenis/Deluxe');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { kamar: mockKamar },
      }));
      expect(kamarController.getKamarByJenis).toHaveBeenCalledWith(expect.objectContaining({
        params: { jenisKamar: 'Deluxe' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/kamar/addKamar', () => {
    it('should add a kamar', async () => {
      const mockKamar = { id: 1, jenis: 'Deluxe' };
      kamarController.addKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Kamar berhasil dibuat',
          data: mockKamar,
        });
      });

      const response = await request(app)
        .post('/api/v1/kamar/addKamar')
        .send({ jenis: 'Deluxe' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Kamar berhasil dibuat',
        data: mockKamar,
      }));
      expect(kamarController.addKamar).toHaveBeenCalledWith(expect.objectContaining({
        body: { jenis: 'Deluxe' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/kamar/updateKamar/:id', () => {
    it('should update a kamar', async () => {
      const mockUpdatedKamar = { id: 1, jenis: 'Deluxe Updated' };
      kamarController.updateKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Kamar berhasil diperbarui',
          data: mockUpdatedKamar,
        });
      });

      const response = await request(app)
        .put('/api/v1/kamar/updateKamar/1')
        .send({ jenis: 'Deluxe Updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Kamar berhasil diperbarui',
        data: mockUpdatedKamar,
      }));
      expect(kamarController.updateKamar).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
        body: { jenis: 'Deluxe Updated' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('DELETE /api/v1/kamar/deleteKamar/:id', () => {
    it('should delete a kamar', async () => {
      kamarController.deleteKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Kamar berhasil dihapus',
        });
      });

      const response = await request(app).delete('/api/v1/kamar/deleteKamar/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Kamar berhasil dihapus',
      }));
      expect(kamarController.deleteKamar).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/kamar/getAllNomorKamar', () => {
    it('should get all nomor kamar', async () => {
      const mockNomorKamar = [{ id: 1, nomor: '101' }];
      kamarController.getAllNomorKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Nomor Kamar berhasil diterima',
          data: mockNomorKamar,
        });
      });

      const response = await request(app).get('/api/v1/kamar/getAllNomorKamar');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Nomor Kamar berhasil diterima',
        data: mockNomorKamar,
      }));
      expect(kamarController.getAllNomorKamar).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/kamar/getNomorKamarByID/:id', () => {
    it('should get nomor kamar by ID', async () => {
      const mockNomorKamar = { id: 1, nomor: '101' };
      kamarController.getNomorKamarByID.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { nomorKamar: mockNomorKamar },
        });
      });

      const response = await request(app).get('/api/v1/kamar/getNomorKamarByID/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { nomorKamar: mockNomorKamar },
      }));
      expect(kamarController.getNomorKamarByID).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/kamar/addNomorKamar', () => {
    it('should add a nomor kamar', async () => {
      const mockNomorKamar = { id: 1, nomor: '101' };
      kamarController.addNomorKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Nomor Kamar berhasil dibuat',
          data: mockNomorKamar,
        });
      });

      const response = await request(app)
        .post('/api/v1/kamar/addNomorKamar')
        .send({ nomor: '101' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Nomor Kamar berhasil dibuat',
        data: mockNomorKamar,
      }));
      expect(kamarController.addNomorKamar).toHaveBeenCalledWith(expect.objectContaining({
        body: { nomor: '101' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/kamar/updateNomorKamar/:id', () => {
    it('should update a nomor kamar', async () => {
      const mockUpdatedNomorKamar = { id: 1, nomor: '101 Updated' };
      kamarController.updateNomorKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Nomor Kamar berhasil diperbarui',
          data: mockUpdatedNomorKamar,
        });
      });

      const response = await request(app)
        .put('/api/v1/kamar/updateNomorKamar/1')
        .send({ nomor: '101 Updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Nomor Kamar berhasil diperbarui',
        data: mockUpdatedNomorKamar,
      }));
      expect(kamarController.updateNomorKamar).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
        body: { nomor: '101 Updated' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('DELETE /api/v1/kamar/deleteNomorKamar/:id', () => {
    it('should delete a nomor kamar', async () => {
      kamarController.deleteNomorKamar.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Nomor Kamar berhasil dihapus',
        });
      });

      const response = await request(app).delete('/api/v1/kamar/deleteNomorKamar/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Nomor Kamar berhasil dihapus',
      }));
      expect(kamarController.deleteNomorKamar).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/kamar/checkKamarAvailability', () => {
    it('should check kamar availability', async () => {
      const mockAvailability = { available: true };
      kamarController.checkKamarAvailability.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Kamar tersedia',
          data: mockAvailability,
        });
      });

      const response = await request(app)
        .post('/api/v1/kamar/checkKamarAvailability')
        .send({ id: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Kamar tersedia',
        data: mockAvailability,
      }));
      expect(kamarController.checkKamarAvailability).toHaveBeenCalledWith(expect.objectContaining({
        body: { id: 1 },
      }), expect.any(Object), expect.any(Function));
    });
  });
});
