import { Request, Response } from "express";
import { prisma } from "..";
import { uploadToFirebase, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';

// GET all notices
export const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await prisma.notice.findMany();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};


export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, content, pages, state } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!title || !content || !pages) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Xử lý pages robust
    let parsedPages: string[] = [];
    if (Array.isArray(pages)) {
      parsedPages = pages;
    } else if (typeof pages === "string") {
      try {
        const temp = JSON.parse(pages);
        if (Array.isArray(temp)) {
          parsedPages = temp;
        } else {
          parsedPages = [pages]; // treat single string as array
        }
      } catch {
        parsedPages = [pages]; // nếu parse lỗi, treat as single string
      }
    } else {
      return res.status(400).json({ error: "Pages format is invalid" });
    }

    // Kiểm tra mainImage chỉ khi có "welcome page"
    let mainImage: any = null;
    if (parsedPages.includes("welcome page")) {
      const files = req.files as { image?: Express.Multer.File[] };
      if (!files || !files.image || files.image.length === 0) {
        return res.status(400).json({ error: "Welcome page must have an image" });
      }

      const mainImageFile = files.image[0];

      // Upload mainImage lên Firebase
      const mainImageName = Date.now() + "_" + mainImageFile.originalname;
      const mainImageUrl = await uploadToFirebase({ ...mainImageFile, originalname: mainImageName });

      // Tạo Image record
      mainImage = await prisma.image.create({
        data: { name: mainImageName, url: mainImageUrl },
      });
    }

    // Tạo Notice
    const notice = await prisma.notice.create({
      data: {
        title,
        subtitle: subtitle ?? null,
        content,
        pages: parsedPages,
        state: state ?? false,
        ...(mainImage ? { image: { connect: { id: mainImage.id } } } : {}),
      },
      include: { image: true },
    });

    // log
    const userId = req.user?.id;
    const userName = req.user?.name;
    if (!userId || !userName) {
      return res.status(400).json({ error: "User info not found" });
    }
    await prisma.log.create({
      data: {
        userId,
        userName,
        action: `${userName} (ID:${userId}) had created a notice ${title} (id=${notice.id})`,
      },
    });

    return res.status(201).json({ message: "Notice created successfully", notice });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create notice", details: err });
  }
};


// UPDATE notice state
export const updateNoticeState = async (req: Request, res: Response) => {
    try {
    const id = parseInt(req.params.id, 10); // convert string → number

    // Kiểm tra id hợp lệ
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid notice ID" });
}
    const { state} = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name;

    const notice = await prisma.notice.update({
      where: { id },
      data: { state },
    });

    await prisma.log.create({
      data: {
        userId,
        userName,
        action: `${userName} (ID:${userId}) had updated notice ${notice.title} (id=${notice.id})`,
      },
    });

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notice" });
  }
};
