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

const getNameFromUrl = (nameOrUrl: string) => {
  if (nameOrUrl.startsWith("http")) {
    try {
      const u = new URL(nameOrUrl);
      // expect: .../images/<name>
      const parts = u.pathname.split("/");
      return parts[parts.length - 1] || nameOrUrl;
    } catch {
      return nameOrUrl;
    }
  }
  return nameOrUrl;
};

// Helper: build đúng url public cho ảnh theo bucket hiện tại
const buildPublicUrl = (name: string) =>
  `https://storage.googleapis.com/${bucket.name}/images/${name}`;

/**
 * Xoá ảnh trên Firebase và record Prisma.
 * - Nếu có `cakeId` => ảnh thuộc product (main/extra) -> disconnect khỏi Clothes rồi xoá record Image.
 * - Nếu không có `cakeId` => ảnh rời (ví dụ Notice) -> chỉ xoá file + record Image.
 *
 * @param nameOrUrl: có thể truyền "name" (abc.png) hoặc full url
 * @param isMainImage?: chỉ dùng khi có cakeId
 * @param cakeId?: id của Clothes; nếu bỏ trống => coi là ảnh rời (notice)
 */
export const deleteImageFromFirebaseAndPrisma = async (
  nameOrUrl: string,
  isMainImage?: boolean,
  cakeId?: number
) => {
  const name = getNameFromUrl(nameOrUrl);
  const publicUrl = buildPublicUrl(name);

  try {
    // 1) Xoá file trên Firebase Storage (bỏ qua lỗi nếu file đã không tồn tại)
    await bucket.file(`images/${name}`).delete().catch((e) => {
      // không throw để không chặn flow
      console.warn("Storage delete warning:", e?.message || e);
    });

    // 2) Nếu có cakeId => xử lý product
    if (typeof cakeId === "number") {
      const existingCake = await prisma.clothes.findUnique({
        where: { id: cakeId },
        include: { mainImg: true, extraImgs: true },
      });
      if (!existingCake) {
        throw new Error("Clothes not found");
      }

      if (isMainImage) {
        // gỡ liên kết mainImg
        await prisma.clothes.update({
          where: { id: cakeId },
          data: { mainImgId: null },
        });
      } else {
        // tìm image record theo name/url rồi disconnect khỏi extraImgs
        const imageRecord = await prisma.image.findFirst({
          where: {
            OR: [{ name: name }, { url: publicUrl }],
          },
        });
        if (imageRecord) {
          await prisma.clothes.update({
            where: { id: cakeId },
            data: { extraImgs: { disconnect: { id: imageRecord.id } } },
          });
        }
      }

      // xoá record Image (theo name OR url — để chắc ăn)
      await prisma.image.deleteMany({
        where: {
          OR: [{ name: name }, { url: publicUrl }],
        },
      });

      console.log(`Deleted product image ${name} successfully`);
      return;
    }

    // 3) Không có cakeId => ảnh rời (ví dụ Notice)
    await prisma.image.deleteMany({
      where: { OR: [{ name: name }, { url: publicUrl }] },
    });

    console.log(`Deleted loose image ${name} successfully`);
  } catch (error) {
    console.error("Error deleting image from Firebase/Prisma:", error);
    throw new Error("Failed to delete image");
  }
};