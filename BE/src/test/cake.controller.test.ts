// src/test/clothes.controller.test.ts
import { Request, Response } from "express";
import * as ClothesController from "../controllers/cake.controller";
import { prisma } from "..";

jest.mock("..", () => ({
  prisma: {
    clothes: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    image: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    log: {
      create: jest.fn(),
    },
  },
}));

jest.mock("../services/upload.services", () => ({
  uploadToFirebase: jest.fn().mockResolvedValue("https://fakeurl.com/image.png"),
  deleteImageFromFirebaseAndPrisma: jest.fn(),
}));

const mockReq = (body = {}, params = {}, files = {}, user = {}) =>
  ({ body, params, files, user } as unknown as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Clothes Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. clothesList success
  it("clothesList: should return list of clothes", async () => {
    (prisma.clothes.findMany as jest.Mock).mockResolvedValue([{ id: 1, name: "Shirt" }]);
    const req = mockReq();
    const res = mockRes();

    await ClothesController.clothesList(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Shirt" }]);
  });

  // 2. clothesList failure
  it("clothesList: should handle errors", async () => {
    (prisma.clothes.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();

    await ClothesController.clothesList(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 3. clothesCreate missing main image
  it("clothesCreate: should return 400 if mainImage missing", async () => {
    const req = mockReq({ name: "Shirt", categoryName: "Men" }, {}, {}, { id: 1, name: "Admin" });
    const res = mockRes();

    await ClothesController.clothesCreate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // 4. clothesCreate success
  it("clothesCreate: should create clothes successfully", async () => {
    const req = mockReq(
      {
        name: "Shirt",
        categoryName: "Men",
        sizes: JSON.stringify([{ label: "M", quantity: 10 }]),
        features: JSON.stringify([{ value: "Cotton" }]),
        price: "100"
      },
      {},
      { mainImage: [{ originalname: "main.png" }], extraImages: [{ originalname: "extra.png" }] },
      { id: 1, name: "Admin" }
    );
    const res = mockRes();

    (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "Men" });
    (prisma.image.create as jest.Mock).mockResolvedValue({ id: 1, url: "https://fakeurl.com/image.png" });
    (prisma.clothes.create as jest.Mock).mockResolvedValue({ id: 1, name: "Shirt" });
    (prisma.log.create as jest.Mock).mockResolvedValue({});

    await ClothesController.clothesCreate(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  // 5. clothesDetail success
  it("clothesDetail: should return clothes detail", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "Shirt" });
    const req = mockReq({}, { id: "1" });
    const res = mockRes();

    await ClothesController.clothesDetail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 6. clothesDetail not found
  it("clothesDetail: should return 404 if not found", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "1" });
    const res = mockRes();

    await ClothesController.clothesDetail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 7. clothesByKeyword success
  it("clothesByKeyword: should return clothes matching keyword", async () => {
    (prisma.clothes.findMany as jest.Mock).mockResolvedValue([{ id: 1, name: "Shirt" }]);
    const req = mockReq({}, {}, {}, {});
    req.query = { keyword: "Shirt" };
    const res = mockRes();

    await ClothesController.clothesByKeyword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 8. clothesByKeyword invalid keyword
  it("clothesByKeyword: should return 400 for invalid keyword", async () => {
    const req = mockReq();
    req.query = { keyword: {} };
    const res = mockRes();

    await ClothesController.clothesByKeyword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // 9. updateClothes success
  it("updateClothes: should update clothes", async () => {
    const req = mockReq({ name: "Shirt 2" }, { id: "1" }, {}, { id: 1, name: "Admin" });
    const res = mockRes();

    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "Shirt", sizes: [], features: [] });
    (prisma.clothes.update as jest.Mock).mockResolvedValue({ id: 1, name: "Shirt 2" });
    (prisma.log.create as jest.Mock).mockResolvedValue({});

    await ClothesController.updateClothes(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 10. updateClothes not found
  it("updateClothes: should return 404 if not found", async () => {
    const req = mockReq({ name: "Shirt 2" }, { id: "1" }, {}, { id: 1, name: "Admin" });
    const res = mockRes();

    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue(null);

    await ClothesController.updateClothes(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 11. listClothesByCategory success
  it("listClothesByCategory: should return clothes by category", async () => {
    (prisma.clothes.findMany as jest.Mock).mockResolvedValue([{ id: 1, name: "Shirt" }]);
    const req = mockReq({}, { category: "Men" });
    const res = mockRes();

    await ClothesController.listClothesByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 12. listClothesByCategory not found
  it("listClothesByCategory: should return 404 if none found", async () => {
    (prisma.clothes.findMany as jest.Mock).mockResolvedValue([]);
    const req = mockReq({}, { category: "Men" });
    const res = mockRes();

    await ClothesController.listClothesByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 13. deleteClothes success
  it("deleteClothes: should delete clothes", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "Shirt" });
    (prisma.clothes.delete as jest.Mock).mockResolvedValue({});
    (prisma.log.create as jest.Mock).mockResolvedValue({});
    const req = mockReq({}, { id: "1" }, {}, { id: 1, name: "Admin" });
    const res = mockRes();

    await ClothesController.deleteClothes(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 14. deleteClothes not found
  it("deleteClothes: should return 404 if clothes not found", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "1" }, {}, { id: 1, name: "Admin" });
    const res = mockRes();

    await ClothesController.deleteClothes(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 15. updateImage main image success
  it("updateImage: should update main image", async () => {
    const req = mockReq({}, { id: "1" }, { mainImage: [{ originalname: "main.png" }] }, { id: 1, name: "Admin" });
    const res = mockRes();
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, mainImgId: null, extraImgs: [] });
    (prisma.image.create as jest.Mock).mockResolvedValue({ id: 1, url: "https://fakeurl.com/image.png" });
    (prisma.clothes.update as jest.Mock).mockResolvedValue({ id: 1 });

    await ClothesController.updateImage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 16. updateImage extra images success
  it("updateImage: should update extra images", async () => {
    const req = mockReq({}, { id: "1" }, { extraImages: [{ originalname: "extra.png" }] }, { id: 1, name: "Admin" });
    const res = mockRes();
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, mainImgId: 1, extraImgs: [] });
    (prisma.image.create as jest.Mock).mockResolvedValue({ id: 2, url: "https://fakeurl.com/image2.png" });
    (prisma.clothes.update as jest.Mock).mockResolvedValue({ id: 1 });

    await ClothesController.updateImage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 17. deleteImage main image success
  it("deleteImage: should delete main image", async () => {
    const req = mockReq({}, { id: "1" }, {}, { id: 1, name: "Admin" });
    req.body = { imageName: "main.png", isMainImage: true };
    const res = mockRes();
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, mainImgId: 1 });
    (prisma.image.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "main.png" });

    await ClothesController.deleteImage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 18. deleteImage extra image success
  it("deleteImage: should delete extra image", async () => {
    const req = mockReq({}, { id: "1" }, {}, { id: 1, name: "Admin" });
    req.body = { imageName: "extra.png", isMainImage: false };
    const res = mockRes();
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.image.findUnique as jest.Mock).mockResolvedValue({ id: 2, url: "https://storage.googleapis.com/moda-938e0.firebasestorage.app/images/extra.png" });

    await ClothesController.deleteImage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 19. deleteImage not found
  it("deleteImage: should return 404 if image not found", async () => {
    const req = mockReq({}, { id: "1" });
    req.body = { imageName: "extra.png", isMainImage: false };
    const res = mockRes();
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.image.findUnique as jest.Mock).mockResolvedValue(null);

    await ClothesController.deleteImage(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 20. clothesCreate invalid JSON sizes/features
  it("clothesCreate: should handle invalid JSON for sizes/features", async () => {
    const req = mockReq(
      {
        name: "Shirt",
        categoryName: "Men",
        sizes: "{badjson}",
        features: "{badjson}",
        price: "100"
      },
      {},
      { mainImage: [{ originalname: "main.png" }], extraImages: [{ originalname: "extra.png" }] },
      { id: 1, name: "Admin" }
    );
    const res = mockRes();
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "Men" });

    await ClothesController.clothesCreate(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
