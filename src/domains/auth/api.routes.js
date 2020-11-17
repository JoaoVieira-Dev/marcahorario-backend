import express from 'express';
import {
  login,
  renew,
  signup
} from './api.controller';
import { lockForApi } from '../../auth';

const router = express.Router();

router.post('/login', login);
router.post('/renew', lockForApi(), renew);
router.post('/sign-up', signup);

export default router;
