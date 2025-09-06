import { Request, Response } from 'express';
import { prisma } from '..';
import { uploadToFirebase, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';

export const cakeList = async (req: Request, res: Response) => {
    try {
        const listCake = await prisma.cake.findMany({
            include: {
                type: true,  // Include the type to get information about the type of each cake
                mainImg: true,
                extraImgs: true
            },
        });
        res.status(200).json(listCake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const cakeCreate = async (req: Request, res: Response) => {
    console.log('req.body:', req.body);
    const { name, description, price, ingredients, typeId } = req.body;
    const parsedPrice = parseFloat(price);
    const parsedTypeId = parseInt(typeId, 10);

    // Lấy danh sách file từ request
    const files = req.files as {
        mainImage?: Express.Multer.File[];
        extraImages?: Express.Multer.File[];
      };

    // Kiểm tra sự tồn tại của mainImage
    if (!files || !files.mainImage || files.mainImage.length === 0) {
        return res.status(400).json({ message: "A main image is required." });
    }

    // Kiểm tra số lượng extraImages
    if (!files.extraImages || files.extraImages.length === 0) {
        return res.status(400).json({ message: "At least one extra image is required." });
    }
    if (files.extraImages.length > 4) {
        return res.status(400).json({ message: "A maximum of 4 extra images is allowed." });
    }

    try {
        const mainImageFile  = files.mainImage[0];
        const mainImageUrl = await uploadToFirebase(mainImageFile);

        // Lưu ảnh chính vào bảng Image
        const mainImage = await prisma.image.create({
            data: {
                name: mainImageUrl,
                url: `https://storage.googleapis.com/khanh-bakery/images/${mainImageUrl}`,
            },
        });

        // const extraImagesFiles = files.extraImages;
        const extraImageUrls = await Promise.all(
            files.extraImages.map(file => uploadToFirebase(file))
        );

        const extraImages = await Promise.all(
            files.extraImages.map((file, index) =>
                prisma.image.create({
                    data: {
                        name: extraImageUrls[index],
                        url: `https://storage.googleapis.com/khanh-bakery/images/${extraImageUrls[index]}`,
                    },
                })
            )
        );

        const cake = await prisma.cake.create({
            data: {
                name,
                description,
                price: parsedPrice,
                mainImg: { connect: { id: mainImage.id } },
                extraImgs: { connect: extraImages.map(image => ({ id: image.id })) },
                ingredients,
                type: { connect: { id: parsedTypeId } },  // Ensure typeId is provided in the data
            },
        });
        res.status(201).json({ message: "Successfully create cake", cake });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const cakeCreateMany = async (req: Request, res: Response) => {
    try {
        const cakes = await prisma.cake.createMany({
            data: req.body
        });
        res.status(201).json(cakes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const cakeDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cake = await prisma.cake.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                type: true,  // Include the type to get information about the type of this specific cake
                mainImg: true,
                extraImgs: true
            },
        });

        if (!cake) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const cakeByKeyword = async (req: Request, res: Response) => {
    try {
        const { keyword } = req.query;

        // Ensure keyword is a string
        if (typeof keyword !== 'string') {
            return res.status(400).json({ message: 'Invalid keyword' });
        }

        const cake = await prisma.cake.findMany({
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ]
            }
        });
        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateCake = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Check if cake exists before updating
        const existingCake = await prisma.cake.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingCake) {
            return res.status(404).json({ message: 'Cake not found' });
        }
        
        // Ensure typeId is provided if updating the type
        if ('typeId' in req.body && req.body.typeId === null) {
            return res.status(400).json({ message: 'typeId cannot be null' });
        }

        const updatedCake = await prisma.cake.update({
            where: { id: parseInt(id) },
            data: { ...req.body },
        });

        res.status(200).json(updatedCake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const listCakeByType = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const cake = await prisma.cake.findMany({
            where: {
                type: {
                    name: type
                }
            },
            include: {
                mainImg: true,
                extraImgs: true
            }
        });

        if (cake.length === 0) {
            return res.status(404).json({ message: 'No cakes found for the specified type' });
        }

        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteCake = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the cake exists before attempting to delete
        const cake = await prisma.cake.findUnique({
            where: { id: parseInt(id) }
        });

        if (!cake) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        // Delete the cake
        await prisma.cake.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Cake deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Internal server error', error: errorMessage });
    }
};

export const updateImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the cake exists
        const existingCake = await prisma.cake.findUnique({
            where: { id: parseInt(id) },
            include: { extraImgs: true },
        });

        if (!existingCake) {
            return res.status(404).json({ message: 'Cake not found' });
        }


        const files = req.files as {
            mainImage?: Express.Multer.File[];
            extraImages?: Express.Multer.File[];
        };

        if (files.mainImage && existingCake.mainImgId !== null) {
            return res.status(404).json({ message: 'Main image already exists. Please delete the current main image first.' });
        } else if (files.extraImages && (files.extraImages.length + existingCake.extraImgs.length) > 4) {
            return res.status(404).json({ message: 'Maximum number of extra images reached. Please delete some extra images first.' });
        }

        // If a new main image is uploaded
        if (files && files.mainImage) {
            const newMainImage = files.mainImage[0]; // Assuming the image is uploaded as an array

            // Upload new main image to Firebase
            const imageUrl = await uploadToFirebase(newMainImage); // Your function to upload the image
            const newImage = await prisma.image.create({
                data: {
                    name: imageUrl,
                    url: `https://storage.googleapis.com/khanh-bakery/images/${imageUrl}`,
                },
            });

            // Update the cake record with the new main image
            await prisma.cake.update({
                where: { id: parseInt(id) },
                data: { mainImgId: newImage.id },
            });

            res.status(200).json({ message: 'Main image updated successfully' });
        } else if (files && files.extraImages) {
            const extraImages = files.extraImages as Express.Multer.File[];

            for (const file of extraImages) {
                const imageUrl = await uploadToFirebase(file); // Upload image to Firebase
                const newImage = await prisma.image.create({
                    data: {
                        name: imageUrl,
                        url: `https://storage.googleapis.com/khanh-bakery/images/${imageUrl}`,
                    },
                });

                // Connect the new extra image to the cake
                await prisma.cake.update({
                    where: { id: parseInt(id) },
                    data: {
                        extraImgs: {
                            connect: { id: newImage.id },
                        },
                    },
                });
            }

            res.status(200).json({ message: 'Extra images updated successfully' });
        }
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { imageName, isMainImage } = req.body;
        console.log('imageName:', imageName);

        // Check if the cake exists
        const existingCake = await prisma.cake.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingCake) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        // Handle deleting the main image or extra images
        if (isMainImage) {
            // If deleting the main image, remove the mainImgId from the cake record
            if (existingCake.mainImgId) {
                const oldMainImage = await prisma.image.findUnique({
                    where: { id: existingCake.mainImgId },
                });

                if (oldMainImage) {
                    // Delete the main image from Firebase and Prisma
                    await deleteImageFromFirebaseAndPrisma(oldMainImage.name, true, existingCake.id);
                }
            }
        } else {
            // If it's an extra image, delete the extra image record and disconnect from the cake
            const imageRecord = await prisma.image.findUnique({
                where: { url: `https://storage.googleapis.com/khanh-bakery/images/${imageName}` },
            });

            if (imageRecord) {
                // Remove the image from the cake's extraImgs relation
                await prisma.cake.update({
                    where: { id: parseInt(id) },
                    data: {
                        extraImgs: {
                            disconnect: { id: imageRecord.id },
                        },
                    },
                });

                // Delete the extra image from Firebase and Prisma
                await deleteImageFromFirebaseAndPrisma(imageName, false, existingCake.id);
            } else {
                return res.status(404).json({ message: 'Image not found in database' });
            }
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};