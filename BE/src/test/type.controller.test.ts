// src/test/category.controller.test.ts
import { getAllTypes, createType, getTypeById, updateType, deleteType } from "../controllers/type.controller";
import { prisma } from "../index";

jest.mock("../index", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockReq = (params: any = {}, body: any = {}) =>
  ({ params, body } as unknown as import("express").Request);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Category Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAllTypes should return all categories", async () => {
    const req = mockReq();
    const res = mockRes();
    const mockCategories = [{ id: 1, name: "Shirts" }];
    (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

    await getAllTypes(req, res);

    expect(prisma.category.findMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategories);
  });

  it("createType should create a new category", async () => {
    const req = mockReq({}, { name: "Hoodies" });
    const res = mockRes();
    const mockCategory = { id: 2, name: "Hoodies" };
    (prisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

    await createType(req, res);

    expect(prisma.category.create).toHaveBeenCalledWith({ data: { name: "Hoodies" } });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Type created successfully!", type: mockCategory });
  });

  it("getTypeById should return a category by id", async () => {
    const req = mockReq({ id: "1" });
    const res = mockRes();
    const mockCategory = { id: 1, name: "Shirts" };
    (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

    await getTypeById(req, res);

    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  it("updateType should update a category", async () => {
    const req = mockReq({ id: "1" }, { name: "T-Shirts" });
    const res = mockRes();
    const updatedCategory = { id: 1, name: "T-Shirts" };
    (prisma.category.update as jest.Mock).mockResolvedValue(updatedCategory);

    await updateType(req, res);

    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: "T-Shirts" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Type updated successfully", type: updatedCategory });
  });

  it("deleteType should delete a category", async () => {
    const req = mockReq({ id: "1" });
    const res = mockRes();
    (prisma.category.delete as jest.Mock).mockResolvedValue({ id: 1 });

    await deleteType(req, res);

    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Type deleted successfully" });
  });
});
