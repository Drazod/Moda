import { Request, Response } from 'express';
import { prisma } from '..';
import { uploadToFirebase, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';

export const clothesList = async (req: Request, res: Response) => {
    try {
        const { branchCode } = req.query;

        // If branchCode is provided, get stock for that specific branch
        if (branchCode) {
            const branch = await prisma.branch.findUnique({
                where: { code: String(branchCode) }
            });

            if (!branch) {
                return res.status(404).json({ message: 'Branch not found' });
            }

            const listCake = await prisma.clothes.findMany({
                include: {
                    category: true,
                    mainImg: true,
                    extraImgs: true,
                    features: true,
                    sizes: {
                        include: {
                            stocks: true // Get all stocks for all branches to calculate available quantity
                        }
                    }
                },
            });

            // Transform the response to replace size.quantity with stock quantity
            const transformedList = listCake.map(clothes => ({
                ...clothes,
                sizes: clothes.sizes.map(size => {
                    // Find stock for current branch
                    const currentBranchStock = size.stocks.find(s => s.branchId === branch.id);
                    
                    // Calculate total allocated across all branches
                    const totalAllocated = size.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
                    
                    // Calculate max available for this branch (total - allocated to other branches)
                    const maxAvailable = size.quantity - totalAllocated;
                    
                    return {
                        id: size.id,
                        label: size.label,
                        clothesId: size.clothesId,
                        totalQuantity: size.quantity, // Total quantity defined for this size
                        quantity: currentBranchStock?.quantity || 0, // Current stock at this branch
                        totalAllocated: totalAllocated, // Total allocated across all branches
                        maxAvailable: Math.max(0, maxAvailable), // Maximum that can be added (can't be negative)
                    };
                }),
                
            }));

            return res.status(200).json({
                branch: {
                    id: branch.id,
                    code: branch.code,
                    name: branch.name
                },
                clothes: transformedList
            });
        }

        // Default behavior: return all clothes with size quantities (no branch filter)
        const listCake = await prisma.clothes.findMany({
            include: {
                category: true,
                mainImg: true,
                extraImgs: true,
                sizes: true,
                features: true,
            },
        });
        res.status(200).json(listCake);
    } catch (error) {
        console.error('Error fetching clothes list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const clothesCreate = async (req: Request, res: Response) => {
  // Expect either branchId or branchCode in body
  const { name, description, price, categoryId, categoryName, sizes, features, material, information, branchId, branchCode } = req.body;

  try {
    // --- 1) Validate branch requirement ---
    if (!branchId && !branchCode) {
      return res.status(400).json({ message: "branchId or branchCode is required." });
    }

    const branch = await prisma.branch.findUnique({ where: { code: String(branchCode) } });

    if (!branch) {
      return res.status(400).json({ message: "Branch not found." });
    }

    // --- 2) Validate/resolve category (your original logic) ---
    let category;
    if (categoryId) {
      category = await prisma.category.findUnique({ where: { id: parseInt(categoryId, 10) } });
      if (!category) return res.status(400).json({ message: "Category ID does not exist." });
    } else if (categoryName) {
      category = await prisma.category.findUnique({ where: { name: categoryName } });
      if (!category) category = await prisma.category.create({ data: { name: categoryName } });
    } else {
      return res.status(400).json({ message: "CategoryId or categoryName is required." });
    }

    // --- 3) Parse sizes & features safely ---
    type SizeIn = { label: string; quantity: number };
    type FeatureIn = { value: string };

    let parsedSizes: SizeIn[] = [];
    let parsedFeatures: FeatureIn[] = [];
    try {
      if (sizes) parsedSizes = JSON.parse(sizes);
      if (features) parsedFeatures = JSON.parse(features);
    } catch {
      return res.status(400).json({ message: "Invalid sizes or features format" });
    }

    // --- 4) Validate images (your original checks) ---
    const files = req.files as {
      mainImage?: Express.Multer.File[];
      extraImages?: Express.Multer.File[];
    };

    if (!files || !files.mainImage?.length) {
      return res.status(400).json({ message: "A main image is required." });
    }
    if (!files.extraImages?.length) {
      return res.status(400).json({ message: "At least one extra image is required." });
    }
    if (files.extraImages.length > 4) {
      return res.status(400).json({ message: "A maximum of 4 extra images is allowed." });
    }

    const parsedPrice = parseFloat(price);
    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price." });
    }

    // --- 5) Auth info (unchanged) ---
    const userId = req.user?.id;
    const userName = req.user?.name;
    if (!userId || !userName) return res.status(400).json({ error: "User info not found" });

    // --- 6) Transaction: upload images -> create clothes -> create stocks ---
    const result = await prisma.$transaction(async (tx) => {
      // MAIN IMAGE
      const mainImageFile = files.mainImage![0];
      const mainImageName = Date.now() + "_" + mainImageFile.originalname;
      const mainImageUrl = await uploadToFirebase({ ...mainImageFile, originalname: mainImageName });
      const mainImage = await tx.image.create({
        data: { name: mainImageName, url: mainImageUrl },
      });

      // EXTRA IMAGES
      const extraImages = await Promise.all(
        files.extraImages!.map(async (file) => {
          const extraImageName = Date.now() + "_" + file.originalname;
          const extraImageUrl = await uploadToFirebase({ ...file, originalname: extraImageName });
          return tx.image.create({ data: { name: extraImageName, url: extraImageUrl } });
        })
      );

      // Create clothes with sizes & features (keeps your current Size.quantity)
      const created = await tx.clothes.create({
        data: {
          name,
          description,
          price: parsedPrice,
          material: material ?? null,
          information: information ?? null,
          mainImg: { connect: { id: mainImage.id } },
          extraImgs: { connect: extraImages.map((img) => ({ id: img.id })) },
          category: { connect: { id: category.id } },
          sizes: {
            create: parsedSizes.map((s) => ({
              label: s.label,
              quantity: s.quantity, // still writing to Size.quantity (Phase-1)
            })),
          },
          features: { create: parsedFeatures.map((f) => ({ value: f.value })) },
        },
        include: { sizes: true, features: true },
      });

      // Build a map label -> qty from the payload to match Size ids we just created
      const qtyByLabel = new Map<string, number>(
        parsedSizes.map((s) => [String(s.label), Number(s.quantity) || 0])
      );

      // Upsert Stock rows for this branch for each size
      await Promise.all(
        created.sizes.map((sz) =>
          tx.stock.upsert({
            where: { branchId_sizeId: { branchId: branch.id, sizeId: sz.id } },
            update: { quantity: qtyByLabel.get(sz.label) ?? 0 },
            create: { branchId: branch.id, sizeId: sz.id, quantity: qtyByLabel.get(sz.label) ?? 0 },
          })
        )
      );

      // Log action
      await tx.log.create({
        data: {
          userId,
          userName,
          action: `created clothes ${name} (id=${created.id}) at branch ${branch.code}`,
        },
      });

      return created;
    },
    {
        maxWait: 10000, // Wait max 10s to start transaction
        timeout: 20000, // Transaction can run for max 20s
    }
  );

    return res.status(201).json({ message: "Successfully created clothes", clothes: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


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
                sizes: {
                    include: {
                        stocks: {
                            include: {
                                branch: {
                                    select: {
                                        id: true,
                                        code: true,
                                        name: true,
                                        address: true,
                                        phone: true,
                                        isActive: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });

        if (!cake) {
            return res.status(404).json({ message: 'Clothes not found' });
        }

        // Transform the response to show stock by branch for each size
        const transformedCake = {
            ...cake,
            sizes: cake.sizes.map(size => {
                // Calculate total allocated

                
                return {
                    id: size.id,
                    label: size.label,
                    clothesId: size.clothesId,
                    totalQuantity: size.quantity, // Total quantity defined for this size
                    branches: size.stocks.map(stock => ({
                        branchId: stock.branchId,
                        branchCode: stock.branch.code,
                        branchName: stock.branch.name,
                        address: stock.branch.address,
                        phone: stock.branch.phone,
                        isActive: stock.branch.isActive,
                        quantity: stock.quantity, // Stock at this specific branch
                    }))
                };
            })
        };

        res.status(200).json(transformedCake);
    } catch (error) {
        console.error('Error fetching clothes detail:', error);
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
        action: ` updated clothes ${updatedCake.name} (id=${updatedCake.id})`,
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
        action: ` had deleted clothes ${cake.name} (id=${cake.id})`,
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

/**
 * Add existing clothes to an additional branch
 * POST /clothes/:id/add-to-branch
 * Body: { branchCode: string, sizes: [{ label: string, quantity: number }] }
 */
export const addClothesToBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { branchCode, sizes } = req.body;

    // Validate input
    if (!branchCode || !sizes || !Array.isArray(sizes)) {
      return res.status(400).json({ 
        message: "branchCode and sizes array are required" 
      });
    }

    const clothesId = parseInt(id);
    if (isNaN(clothesId)) {
      return res.status(400).json({ message: "Invalid clothes ID" });
    }

    // Parse sizes
    let parsedSizes: { label: string; quantity: number }[];
    try {
      parsedSizes = sizes.map((s: any) => ({
        label: String(s.label),
        quantity: Number(s.quantity) || 0,
      }));
    } catch {
      return res.status(400).json({ message: "Invalid sizes format" });
    }

    // Check if clothes exists
    const clothes = await prisma.clothes.findUnique({
      where: { id: clothesId },
      include: { sizes: true },
    });

    if (!clothes) {
      return res.status(404).json({ message: "Clothes not found" });
    }

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { code: branchCode },
    });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Auth info for logging
    const userId = req.user?.id;
    const userName = req.user?.name;
    if (!userId || !userName) {
      return res.status(400).json({ error: "User info not found" });
    }

    // Create a map of label -> quantity from request
    const qtyByLabel = new Map<string, number>(
      parsedSizes.map((s) => [String(s.label), Number(s.quantity) || 0])
    );

    // Validate that all requested labels exist in clothes sizes
    const existingSizeLabels = new Set(clothes.sizes.map((s) => s.label));
    for (const reqLabel of qtyByLabel.keys()) {
      if (!existingSizeLabels.has(reqLabel)) {
        return res.status(400).json({ 
          message: `Size label '${reqLabel}' does not exist for this clothes` 
        });
      }
    }

    // Check stock quantities before adding to branch
    const sizesToProcess = clothes.sizes.filter((sz) => qtyByLabel.has(sz.label));
    
    // Get current stock across all branches for these sizes
    const allCurrentStocks = await prisma.stock.findMany({
      where: {
        sizeId: { in: sizesToProcess.map((s) => s.id) },
      },
    });

    // Find ONLINE-WH branch for reallocation
    const onlineWarehouse = await prisma.branch.findUnique({
      where: { code: 'ONLINE-WH' }
    });

    // Validate stock availability and prepare reallocation
    const reallocationMap = new Map<number, { fromWarehouse: number; addNew: number }>();
    
    for (const sz of sizesToProcess) {
      const requestedQty = qtyByLabel.get(sz.label) ?? 0;
      
      // Get current stock at this specific branch
      const currentBranchStock = allCurrentStocks.find(
        (s) => s.sizeId === sz.id && s.branchId === branch.id
      );
      const currentAtThisBranch = currentBranchStock?.quantity ?? 0;
      
      // Get current stock at ONLINE-WH
      const warehouseStock = onlineWarehouse 
        ? allCurrentStocks.find((s) => s.sizeId === sz.id && s.branchId === onlineWarehouse.id)
        : null;
      const warehouseQty = warehouseStock?.quantity ?? 0;
      
      // Get total across all branches
      const totalAllocated = allCurrentStocks
        .filter((s) => s.sizeId === sz.id)
        .reduce((sum, stock) => sum + stock.quantity, 0);
      
      // Calculate how much we can reallocate from warehouse
      const canReallocate = Math.min(requestedQty, warehouseQty);
      const needNew = requestedQty - canReallocate;
      
      // Calculate available unallocated stock
      const availableNew = sz.quantity - totalAllocated;
      
      if (needNew > availableNew) {
        return res.status(400).json({
          message: `Size '${sz.label}' quantity exceeds limit. Total quantity: ${sz.quantity}, Currently allocated: ${totalAllocated}, Requested to add: ${requestedQty}, Available in ONLINE-WH: ${warehouseQty}, Available unallocated: ${availableNew}`,
        });
      }
      
      reallocationMap.set(sz.id, { fromWarehouse: canReallocate, addNew: needNew });
    }

    // Upsert stock records for this branch and reallocate from ONLINE-WH
    const result = await prisma.$transaction(async (tx) => {
      // Get current stocks at this branch to add to them
      const currentBranchStocks = await tx.stock.findMany({
        where: {
          branchId: branch.id,
          sizeId: { in: sizesToProcess.map((s) => s.id) },
        },
      });

      await Promise.all(
        sizesToProcess.map(async (sz) => {
          const currentStock = currentBranchStocks.find((s) => s.sizeId === sz.id);
          const currentQty = currentStock?.quantity ?? 0;
          const addQty = qtyByLabel.get(sz.label) ?? 0;
          const newQty = currentQty + addQty;
          
          const reallocation = reallocationMap.get(sz.id);
          
          // If reallocating from ONLINE-WH, decrement warehouse stock
          if (reallocation && reallocation.fromWarehouse > 0 && onlineWarehouse) {
            await tx.stock.updateMany({
              where: {
                branchId: onlineWarehouse.id,
                sizeId: sz.id,
                quantity: { gte: reallocation.fromWarehouse } // Ensure stock is available
              },
              data: {
                quantity: { decrement: reallocation.fromWarehouse }
              }
            });
          }

          return tx.stock.upsert({
            where: { branchId_sizeId: { branchId: branch.id, sizeId: sz.id } },
            update: { quantity: newQty },
            create: {
              branchId: branch.id,
              sizeId: sz.id,
              quantity: addQty,
            },
          });
        })
      );

      // Log the action
      await tx.log.create({
        data: {
          userId,
          userName,
          action: `added clothes '${clothes.name}' (id=${clothes.id}) to branch ${branch.code}`,
        },
      });

      // Return updated stock info for this branch
      const stocks = await tx.stock.findMany({
        where: {
          branchId: branch.id,
          sizeId: { in: sizesToProcess.map((s) => s.id) },
        },
        include: { size: true },
      });

      return stocks;
    });

    return res.status(200).json({
      message: `Successfully added clothes to branch ${branch.code}`,
      branch: { id: branch.id, code: branch.code, name: branch.name },
      stocks: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};