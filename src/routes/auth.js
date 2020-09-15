import express from 'express';
import api from '../domains/auth/api.routes';


const router = express.Router();

router.use('/api', api);

export default router;
