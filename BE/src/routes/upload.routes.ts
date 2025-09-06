import { Router } from 'express';
import { uploadImages, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';
// import { upload, storage } from '..';

import multer from 'multer';
export const upload = multer({
    storage: multer.memoryStorage(),
});

const typeRoute: Router = Router();

// typeRoute.post('/upload', 
//     upload.array("images", 5), 
//     uploadImages);

typeRoute.post('/upload', 
    upload.fields([
        { name: 'mainImage', maxCount: 1 }, // One main image
        { name: 'extraImages', maxCount: 4 }, // Up to 4 extra images
      ]), 
    uploadImages);

// typeRoute.delete('/delete', deleteImageFromFirebaseAndPrisma);

export default typeRoute;