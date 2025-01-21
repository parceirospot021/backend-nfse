import express from 'express'
import { pagination } from './middlewares/pagination.js';
import NfseController from './controllers/nfseController.js';
const routers = express.Router();

routers.post('/api/nfse', pagination, NfseController.create);
routers.get('/api/nfse', pagination, NfseController.getAll);
routers.get('/api/nfse-export', pagination, NfseController.getExport);
export default routers;