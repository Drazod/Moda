"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromFirebaseAndPrisma = exports.uploadToFirebase = exports.uploadImages = void 0;
exports.uploadImage = uploadImage;
const __1 = require("..");
// async function uploadImage(file: Express.Multer.File, req: Request, res: Response) {
//     const imageRef = new Date().getTime() + '-' + file.originalname;
//     const storageRef = bucket.file(`images/${imageRef}`);
//     const blobStream = storageRef.createWriteStream({
//         metadata: {
//             contentType: file.mimetype,
//         },
//     });
//     blobStream.on("error", (err) => {
//         console.error("Upload error:", err);
//         res.status(500).json({ message: "Upload failed." });
//     });
//     blobStream.on("finish", async () => {
//         const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageRef.name}`;
//         console.log("File uploaded successfully:", publicUrl);
//         res.status(200).json({ url: publicUrl });
//     });
//     blobStream.end(file.buffer);
// }
function uploadImage(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const imageRef = new Date().getTime() + '-' + file.originalname;
            const storageRef = __1.bucket.file(`images/${imageRef}`);
            const blobStream = storageRef.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });
            blobStream.on("error", (err) => {
                console.error("Upload error:", err);
                reject(err);
            });
            blobStream.on("finish", () => {
                const publicUrl = `https://storage.googleapis.com/${__1.bucket.name}/${storageRef.name}`;
                console.log("File uploaded successfully:", publicUrl);
                resolve(publicUrl);
            });
            blobStream.end(file.buffer);
        });
    });
}
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const files = req.files as Express.Multer.File[];
    const files = req.files;
    if (!files || !files.mainImage || !files.extraImages) {
        return res.status(400).json({ message: "Both mainImage and extraImages are required." });
    }
    if (!files.extraImages || files.extraImages.length === 0) {
        return res.status(400).json({ message: "At least one extra image is required." });
    }
    try {
        const mainImage = files.mainImage[0];
        const mainImageUrl = yield uploadImage(mainImage);
        const extraImagesFiles = files.extraImages;
        const extraImageUrls = yield Promise.all(extraImagesFiles.map(file => uploadImage(file)));
        const image = {
            main: mainImageUrl,
            additional: extraImageUrls,
        };
        // const imageJson = JSON.stringify(image);
        res.status(200).json({
            message: "Images uploaded successfully",
            image: image
        });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.uploadImages = uploadImages;
const uploadToFirebase = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const imageName = Date.now() + '_' + file.originalname;
        const storageRef = __1.bucket.file(`images/${imageName}`);
        const fileStream = storageRef.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        fileStream.on('error', (err) => reject(err));
        fileStream.on('finish', () => resolve(imageName));
        fileStream.end(file.buffer);
    });
});
exports.uploadToFirebase = uploadToFirebase;
const deleteImageFromFirebaseAndPrisma = (name, isMainImage, cakeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const filePath = url.replace('https://storage.googleapis.com/khanh-bakery/', '');
        const storageRef = __1.bucket.file(`images/${name}`);
        yield storageRef.delete();
        // Check if the cake exists and fetch its current image information
        const existingCake = yield __1.prisma.clothes.findUnique({
            where: { id: cakeId },
            include: { mainImg: true, extraImgs: true }, // Get the current images related to this cake
        });
        if (!existingCake) {
            throw new Error('Cake not found');
        }
        // If it's the main image, update the cake record in Prisma
        if (isMainImage) {
            yield __1.prisma.clothes.update({
                where: { id: cakeId },
                data: {
                    mainImgId: null, // Remove the link to the main image
                },
            });
        }
        else {
            // If it's an extra image, disconnect it from the Cake model
            const imageRecord = yield __1.prisma.image.findUnique({
                where: { url: `https://storage.googleapis.com/khanh-bakery/images/${name}` },
            });
            if (imageRecord) {
                yield __1.prisma.clothes.update({
                    where: { id: cakeId },
                    data: {
                        extraImgs: {
                            disconnect: { id: imageRecord.id }, // Disconnect the image from the cake's extraImgs
                        },
                    },
                });
            }
        }
        // Delete the image record from Prisma
        yield __1.prisma.image.delete({
            where: { url: `https://storage.googleapis.com/khanh-bakery/images/${name}` },
        });
        console.log(`File ${name} deleted successfully!`);
    }
    catch (error) {
        console.error('Error deleting image from Firebase Storage:', error);
        throw new Error('Failed to delete image');
    }
});
exports.deleteImageFromFirebaseAndPrisma = deleteImageFromFirebaseAndPrisma;
