import { Request, Response } from 'express';
import { prisma } from '..';
import { uploadToFirebase, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';

export const clothesList = async (req: Request, res: Response) => {
    try {
        const listCake = await prisma.clothes.findMany({
            include: {
                category: true,  // Include the type to get information about the type of each cake
                mainImg: true,
                extraImgs: true,
                sizes: true,
                features: true,
            },
        });
        res.status(200).json(listCake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const clothesCreate = async (req: Request, res: Response) => {
    console.log('req.body:', req.body);
    const { name, description, price, categoryId, categoryName, sizes, features, material, information } = req.body;
    const parsedPrice = parseFloat(price);
    let category;
    // Flexible: allow category by id or name, create if not exist
    if (categoryId) {
        category = await prisma.category.findUnique({ where: { id: parseInt(categoryId, 10) } });
        if (!category) {
            return res.status(400).json({ message: 'Category ID does not exist.' });
        }
    } else if (categoryName) {
        category = await prisma.category.findUnique({ where: { name: categoryName } });
        if (!category) {
            category = await prisma.category.create({ data: { name: categoryName } });
        }
    } else {
        return res.status(400).json({ message: 'CategoryId or categoryName is required.' });
    }
    const parsedSizes = sizes ? JSON.parse(sizes) : [];
    const parsedFeatures = features ? JSON.parse(features) : [];


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

        // MAIN IMAGE
        const mainImageFile = files.mainImage[0];
        const mainImageName = Date.now() + '_' + mainImageFile.originalname;
        const mainImageUrl = await uploadToFirebase({ ...mainImageFile, originalname: mainImageName });
        const mainImage = await prisma.image.create({
            data: {
                name: mainImageName,
                url: mainImageUrl,
            },
        });

        // EXTRA IMAGES
        const extraImages = await Promise.all(
            files.extraImages.map(async (file) => {
                const extraImageName = Date.now() + '_' + file.originalname;
                const extraImageUrl = await uploadToFirebase({ ...file, originalname: extraImageName });
                return prisma.image.create({
                    data: {
                        name: extraImageName,
                        url: extraImageUrl,
                    },
                });
            })
        );

    // Parse sizes và features nếu có
    let parsedSizes: any[] = [];
    let parsedFeatures: any[] = [];

    try {
    if (sizes) {
        parsedSizes = JSON.parse(sizes); // sizes gửi lên phải dạng JSON string
    }
    if (features) {
        parsedFeatures = JSON.parse(features);
    }
    } catch (e) {
    return res.status(400).json({ message: "Invalid sizes or features format" });
    }

    const cake = await prisma.clothes.create({
        data: {
            name,
            description,
            price: parsedPrice,
            material: material ?? null,
            information: information ?? null,
            mainImg: { connect: { id: mainImage.id } },
            extraImgs: { connect: extraImages.map(image => ({ id: image.id })) },
            category: { connect: { id: category.id } },
            sizes: {
                create: parsedSizes.map((s: any) => ({
                    label: s.label,
                    quantity: s.quantity,
                })),
            },
            features: {
                create: parsedFeatures.map((f: any) => ({
                    value: f.value,
                })),
            },
        },
        include: {
            sizes: true,
            features: true,
        },
    });
    const userId = req.user?.id;
    const userName = req.user?.name;

    if (!userId || !userName) {
    return res.status(400).json({ error: "User info not found" });
    }

    // tạo log
    await prisma.log.create({
    data: {
        userId,
        userName,
        action: `${userName} (ID:${userId}) had created clothes ${name} (id=${cake.id})`,
    },
    });
        res.status(201).json({ message: "Successfully create clothes", cake });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const clothesCreateMany = async (req: Request, res: Response) => {
    try {
        const cakes = await prisma.clothes.createMany({
            data: req.body
        });
        res.status(201).json(cakes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const clothesDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cake = await prisma.clothes.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                category: true,  // Include the type to get information about the type of this specific cake
                mainImg: true,
                extraImgs: true,
                sizes: true
            },
        });

        if (!cake) {
            return res.status(404).json({ message: 'Clothes not found' });
        }

        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const clothesByKeyword = async (req: Request, res: Response) => {
    try {
        const { keyword } = req.query;

        // Ensure keyword is a string
        if (typeof keyword !== 'string') {
            return res.status(400).json({ message: 'Invalid keyword' });
        }

        const cake = await prisma.clothes.findMany({
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

export const updateClothes = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid clothes ID' });
    }

    const existingCake = await prisma.clothes.findUnique({
      where: { id },
      include: { sizes: true, features: true },
    });

    if (!existingCake) {
      return res.status(404).json({ message: 'Clothes not found' });
    }

    const {
      name,
      description,
      price,
      categoryId,
      material,
      information,
      sizes,
      features,
    } = req.body;

    const updateData: any = {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      material,
      information,
    };

    if (categoryId) {
      updateData.category = { connect: { id: parseInt(categoryId) } };
    }

    // Nested update for sizes
    if (sizes) {
      const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      updateData.sizes = {
        deleteMany: {},
        create: parsedSizes.map((s: any) => ({
          label: s.label,
          quantity: s.quantity,
        })),
      };
    }

    // Nested update for features
    if (features) {
      const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      updateData.features = {
        deleteMany: {},
        create: parsedFeatures.map((f: any) => ({ value: f.value })),
      };
    }

    const updatedCake = await prisma.clothes.update({
      where: { id },
      data: updateData,
      include: { sizes: true, features: true },
    });

    const userId = req.user?.id;
    const userName = req.user?.name;
    if (!userId || !userName) {
      return res.status(400).json({ error: 'User info not found' });
    }

    await prisma.log.create({
      data: {
        userId,
        userName,
        action: `${userName} (ID:${userId}) updated clothes ${updatedCake.name} (id=${updatedCake.id})`,
      },
    });

    res.status(200).json(updatedCake);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const listClothesByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const cake = await prisma.clothes.findMany({
            where: {
                category: {
                    name: category
                }
            },
            include: {
                category: true,
                mainImg: true,
                extraImgs: true,
                sizes: true,
                features: true,

            }
        });

        if (cake.length === 0) {
            return res.status(404).json({ message: 'No clothes found for the specified category' });
        }

        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteClothes = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the cake exists before attempting to delete
        const cake = await prisma.clothes.findUnique({
            where: { id: parseInt(id) }
        });

        if (!cake) {
            return res.status(404).json({ message: 'Clothes not found' });
        }

        // Delete the cake
        await prisma.clothes.delete({
            where: { id: parseInt(id) }
        });
    const userId = req.user?.id;
    const userName = req.user?.name;

    if (!userId || !userName) {
    return res.status(400).json({ error: "User info not found" });
    }

    // tạo log
    await prisma.log.create({
    data: {
        userId,
        userName,
        action: `${userName} (ID:${userId}) had deleted clothes ${cake.name} (id=${cake.id})`,
    },
    });
        res.status(200).json({ message: 'Clothes deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Internal server error', error: errorMessage });
    }
};

export const updateImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the cake exists
        const existingCake = await prisma.clothes.findUnique({
            where: { id: parseInt(id) },
            include: { extraImgs: true },
        });

        if (!existingCake) {
            return res.status(404).json({ message: 'Clothes not found' });
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
                    url: imageUrl,
                },
            });

            // Update the cake record with the new main image
            await prisma.clothes.update({
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
                        url: imageUrl,
                    },
                });

                // Connect the new extra image to the cake
                await prisma.clothes.update({
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
        const existingCake = await prisma.clothes.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingCake) {
            return res.status(404).json({ message: 'Clothes not found' });
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
                where: { url: `https://storage.googleapis.com/moda-938e0.firebasestorage.app/images/${imageName}` },
            });

            if (imageRecord) {
                // Remove the image from the cake's extraImgs relation
                await prisma.clothes.update({
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