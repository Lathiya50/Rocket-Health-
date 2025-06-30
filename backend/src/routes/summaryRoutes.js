import express from 'express';
import { validateSummaryRequest } from '../middleware/validation.js';
import { SummaryService } from '../services/SummaryService.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

/**
 * POST /api/generate-summary
 * Generates a consultation summary based on session notes and preferences
 */
router.post('/generate-summary', validateSummaryRequest, async (req, res, next) => {
  try {
    const summaryService = new SummaryService();
    const result = await summaryService.generateSummary(req.body);
    
    res.status(200).json(
      ApiResponse.success(result, 'Summary generated successfully')
    );
  } catch (error) {
    next(error);
  }
});

export default router;
