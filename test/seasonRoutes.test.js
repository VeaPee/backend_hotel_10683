const request = require('supertest');
const express = require('express');
const seasonRoutes = require('../routes/seasonRoutes');
const seasonController = require('../controller/seasonController');

jest.mock('../controller/seasonController');

const app = express();
app.use(express.json());
app.use('/api/v1/season', seasonRoutes);

describe('Season Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/season/getAllSeason', () => {
    it('should get all seasons', async () => {
      const mockSeasons = [{ id: 1, name: 'Summer' }];
      seasonController.getAllSeason.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Data Season berhasil diterima',
          data: mockSeasons,
        });
      });

      const response = await request(app).get('/api/v1/season/getAllSeason');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Data Season berhasil diterima',
        data: mockSeasons,
      }));
      expect(seasonController.getAllSeason).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/season/getSeasonByID/:id', () => {
    it('should get season by ID', async () => {
      const mockSeason = { id: 1, name: 'Summer' };
      seasonController.getSeasonByID.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { season: mockSeason },
        });
      });

      const response = await request(app).get('/api/v1/season/getSeasonByID/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { season: mockSeason },
      }));
      expect(seasonController.getSeasonByID).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('GET /api/v1/season/getSeasonByJenis/:jenis_season', () => {
    it('should get season by type', async () => {
      const mockSeason = { id: 1, name: 'Summer' };
      seasonController.getSeasonByJenis.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'success',
          data: { season: mockSeason },
        });
      });

      const response = await request(app).get('/api/v1/season/getSeasonByJenis/Summer');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'success',
        data: { season: mockSeason },
      }));
      expect(seasonController.getSeasonByJenis).toHaveBeenCalledWith(expect.objectContaining({
        params: { jenis_season: 'Summer' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('POST /api/v1/season/addSeason', () => {
    it('should add a new season', async () => {
      const mockSeason = { id: 1, name: 'Winter' };
      seasonController.addSeason.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Season berhasil ditambahkan',
          data: mockSeason,
        });
      });

      const response = await request(app)
        .post('/api/v1/season/addSeason')
        .send({ name: 'Winter' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Season berhasil ditambahkan',
        data: mockSeason,
      }));
      expect(seasonController.addSeason).toHaveBeenCalledWith(expect.objectContaining({
        body: { name: 'Winter' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('PUT /api/v1/season/updateSeason/:id', () => {
    it('should update a season', async () => {
      const mockUpdatedSeason = { id: 1, name: 'Spring' };
      seasonController.updateSeason.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Season berhasil diperbarui',
          data: mockUpdatedSeason,
        });
      });

      const response = await request(app)
        .put('/api/v1/season/updateSeason/1')
        .send({ name: 'Spring' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Season berhasil diperbarui',
        data: mockUpdatedSeason,
      }));
      expect(seasonController.updateSeason).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
        body: { name: 'Spring' },
      }), expect.any(Object), expect.any(Function));
    });
  });

  describe('DELETE /api/v1/season/deleteSeason/:id', () => {
    it('should delete a season', async () => {
      seasonController.deleteSeason.mockImplementation((req, res) => {
        res.status(200).json({
          error: false,
          status: 'success',
          message: 'Season berhasil dihapus',
        });
      });

      const response = await request(app).delete('/api/v1/season/deleteSeason/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        error: false,
        status: 'success',
        message: 'Season berhasil dihapus',
      }));
      expect(seasonController.deleteSeason).toHaveBeenCalledWith(expect.objectContaining({
        params: { id: '1' },
      }), expect.any(Object), expect.any(Function));
    });
  });
});
