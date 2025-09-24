import { Router } from 'express';
import { productsSalesReport } from '../controllers/report.controller';

const reportRoute = Router();

// GET /report/products-sales
reportRoute.get('/products-sales', productsSalesReport);

export default reportRoute;
