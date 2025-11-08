import {Router} from 'express';
import { branchCreate, deleteBranch, getAllBranchesForAdmin, updateBranch,getAllBranches } from '../controllers/branch.controller';
import authMiddleware from "../middlewares/authentication";
import authorize from "../middlewares/authorization";
const branchRoute = Router();

branchRoute.post('/', authMiddleware, authorize(["ADMIN", "HOST"]), branchCreate);
branchRoute.put('/:id', authMiddleware, authorize(["ADMIN", "HOST"]), updateBranch);
branchRoute.delete('/:id', authMiddleware, authorize(["ADMIN", "HOST"]), deleteBranch);
branchRoute.get('/', authMiddleware, authorize(["ADMIN", "HOST"]), getAllBranchesForAdmin);
branchRoute.get('/list', authMiddleware, getAllBranches);

export default branchRoute;
