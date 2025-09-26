
import { Request, Response } from "express";
import { prisma } from "..";
import { uploadToFirebase, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';
import { io } from '../index';

// GET all notices for admin (exclude user-specific)
export const getAdminNotices = async (req: Request, res: Response) => {
  try {
    const notices = await prisma.notice.findMany({
      where: {
        userId: { equals: null as any } // Only global/page notices, not user-specific
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ notices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch admin notices', details: err });
  }
};
// GET notices with optional filtering by page and userId
export const getNotices = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const userId = req.user?.id;

    const where: any = {};
    if (page) {
      where.pages = { array_contains: [page] };
    }
    // Only return notices with state=true
    where.state = true;
    if (userId) {
      where.OR = [
        { userId: userId },
        { userId: { equals: null as any } }
      ];
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};


export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, content, pages, state } = req.body;

    // Parse state to boolean if it's a string
    let parsedState: boolean = false;
    if (typeof state === 'boolean') {
      parsedState = state;
    } else if (typeof state === 'string') {
      parsedState = state === 'true' || state === '1';
    }

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
        state: parsedState,
        ...(mainImage ? { image: { connect: { id: mainImage.id } } } : {}),
      },
      include: { image: true },
    });
    // Emit websocket event for new notice (global or page-specific)
    // If notice is global (no userId), emit to all; if userId, emit to that user's room
    if (notice.userId) {
      io.to(String(notice.userId)).emit('new-notice', notice);
    } else {
      io.emit('new-notice', notice);
    }

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
        action: ` had created a notice ${title} (id=${notice.id})`,
      },
    });

    return res.status(201).json({ message: "Notice created successfully", notice });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create notice", details: err });
  }
};


// Helper: Create a notice for a specific user (call this from payment or order update logic)
export const createOrderNoticeForUser = async ({
  userId,
  orderId,
  type = "arrived",
  customContent
}: {
  userId: number,
  orderId: number,
  type?: "arrived" | "shipped" | "refunded" | string,
  customContent?: string
}) => {
  let title = "Your order had arrived";
  let content = `Any question about refund <a href='/refund'>@click here</a>`;
  if (type === "shipped") title = "Your order is being shipped";
  if (type === "refunded") title = "Your order was refunded";
  if (customContent) content = customContent;
  const notice = await prisma.notice.create({
    data: {
      title,
      subtitle: `Order #${orderId}`,
      content,
      pages: ["profile"],
      state: true,
      userId: userId // Make sure your Notice model has a userId field
    }
  });
  // Emit websocket event for new user-specific notice
  if (notice.userId) {
    io.to(String(notice.userId)).emit('new-notice', notice);
  } else {
    io.emit('new-notice', notice);
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
    if (notice.state) {
      if (notice.userId) {
        io.to(String(notice.userId)).emit('new-notice', notice);
      } else {
        io.emit('new-notice', notice);
      }
    } else {
      // Optionally emit a remove event, e.g.:
      if (notice.userId) {
        io.to(String(notice.userId)).emit('remove-notice', notice.id);
      } else {
        io.emit('remove-notice', notice.id);
      }
    }
    await prisma.log.create({
      data: {
        userId,
        userName,
        action: ` had updated notice ${notice.title} (id=${notice.id})`,
      },
    });

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notice" });
  }
};
