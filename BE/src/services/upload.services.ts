import { Request, Response } from 'express';
import { prisma, bucket } from "..";

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

export async function uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
        const imageRef = new Date().getTime() + '-' + file.originalname;
        const storageRef = bucket.file(`images/${imageRef}`);

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
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${imageRef}`;
            console.log("File uploaded successfully:", publicUrl);
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
}

export const uploadImages = async (req: Request, res: Response) => {
    // const files = req.files as Express.Multer.File[];

    const files = req.files as {
        mainImage?: Express.Multer.File[];
        extraImages?: Express.Multer.File[];
      };

    if (!files || !files.mainImage || !files.extraImages) {
        return res.status(400).json({ message: "Both mainImage and extraImages are required." });
    }

    if (!files.extraImages || files.extraImages.length === 0) {
        return res.status(400).json({ message: "At least one extra image is required." });
    }
    try {
        const mainImage = files.mainImage[0];
        const mainImageUrl = await uploadImage(mainImage);

        const extraImagesFiles = files.extraImages;
        const extraImageUrls = await Promise.all(
            extraImagesFiles.map(file => uploadImage(file))
        );

        const image = {
            main: mainImageUrl,
            additional: extraImageUrls,
        }

        // const imageJson = JSON.stringify(image);

        res.status(200).json({
            message: "Images uploaded successfully",
            image: image
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const uploadToFirebase = async (file: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const imageName = Date.now() + '_' + file.originalname;
        const storageRef = bucket.file(`images/${imageName}`);
        const fileStream = storageRef.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        fileStream.on('error', (err) => reject(err));
        fileStream.on('finish', async () => {
            try {
                // Get metadata to retrieve download token if present
                const [metadata] = await storageRef.getMetadata();
                let url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/images%2F${encodeURIComponent(imageName)}?alt=media`;
                if (metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens) {
                    url += `&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
                }
                resolve(url);
            } catch (err) {
                reject(err);
            }
        });

        fileStream.end(file.buffer);
    });
};

export const deleteImageFromFirebaseAndPrisma = async (name: string, isMainImage: boolean, cakeId: number) => {
    try {
        // const filePath = url.replace('https://storage.googleapis.com/moda-938e0.firebasestorage.app/', '');
        const storageRef = bucket.file(`images/${name}`);
    
        await storageRef.delete();

        // Check if the cake exists and fetch its current image information
        const existingCake = await prisma.clothes.findUnique({
            where: { id: cakeId },
            include: { mainImg: true, extraImgs: true }, // Get the current images related to this cake
        });

        if (!existingCake) {
            throw new Error('Cake not found');
        }

        // If it's the main image, update the cake record in Prisma
        if (isMainImage) {
            await prisma.clothes.update({
                where: { id: cakeId },
                data: {
                    mainImgId: null, // Remove the link to the main image
                },
            });
        } else {
            // If it's an extra image, disconnect it from the Cake model
            const imageRecord = await prisma.image.findUnique({
                where: { url: `https://storage.googleapis.com/${bucket.name}/images/${name}` },
            });

            if (imageRecord) {
                await prisma.clothes.update({
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
        await prisma.image.delete({
            where: { url: `https://storage.googleapis.com/moda-938e0.firebasestorage.app/images/${name}` },
        });

        console.log(`File ${name} deleted successfully!`);
    } catch (error) {
        console.error('Error deleting image from Firebase Storage:', error);
        throw new Error('Failed to delete image');
    }
}