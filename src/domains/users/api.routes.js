import express from 'express';
import {
  paginate, 
  resetPassword,
} from './api.controller';
    
const router = express.Router();

router.get('/paginate', paginate);
router.post('/reset-password', resetPassword);

export default router;
