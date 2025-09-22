import { Router } from 'express';
import { semanticSearch } from '../controllers/search.controller';

const router = Router();

// POST /search/semantic-search
router.post('/semantic-search', semanticSearch);

export default router;
