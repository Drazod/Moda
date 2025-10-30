import { getAdminOverview } from "../controllers/admin.controller";
import { prisma } from "..";
import { getPresenceCounts } from "../services/presence.services";

// Import helpers trực tiếp nếu bạn export chúng (nếu chưa export thì thêm export trong controller)
import {
  parseRange,
  previous,
  pctChange,
} from "../controllers/admin.controller";

jest.mock("..", () => ({
  prisma: {
    transaction: { aggregate: jest.fn() },
    clothes: { count: jest.fn(), findMany: jest.fn() },
    user: { count: jest.fn() },
    cart: { groupBy: jest.fn() },
    cartItem: { groupBy: jest.fn(), findFirst: jest.fn() },
  },
}));

jest.mock("../services/presence.services", () => ({
  getPresenceCounts: jest.fn(),
}));

describe("admin.controller helpers", () => {
  test("parseRange with range=7d", () => {
    const r = parseRange({ range: "7d" });
    const diff = r.to.getTime() - r.from.getTime();
    expect(diff).toBe(7 * 24 * 60 * 60 * 1000);
  });

  test("parseRange with custom from/to", () => {
    const r = parseRange({ from: "2025-01-01", to: "2025-01-10" });
    expect(r.from.toISOString().startsWith("2025-01-01")).toBe(true);
    expect(r.to.toISOString().startsWith("2025-01-10")).toBe(true);
  });

  test("previous(range)", () => {
    const r = { from: new Date("2025-01-01"), to: new Date("2025-01-31") };
    const prev = previous(r);
    expect(prev.to.toISOString().startsWith("2025-01-01")).toBe(true);
    expect(prev.from.getTime()).toBeLessThan(prev.to.getTime());
  });

  test("pctChange when prev=0 and curr>0", () => {
    expect(pctChange(10, 0)).toBe(100);
  });

  test("pctChange normal case", () => {
    expect(pctChange(150, 100)).toBe(50);
  });
});

describe("getAdminOverview", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should return KPIs and topSellingProducts", async () => {
    // Mock Prisma responses
    (prisma.transaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { amount: 1000 } })
      .mockResolvedValueOnce({ _sum: { amount: 500 } });

    (prisma.clothes.count as jest.Mock)
      .mockResolvedValueOnce(50) // total
      .mockResolvedValueOnce(10) // newCurr
      .mockResolvedValueOnce(5); // newPrev

    (prisma.user.count as jest.Mock)
      .mockResolvedValueOnce(200) // total
      .mockResolvedValueOnce(20) // newCurr
      .mockResolvedValueOnce(10); // newPrev

    (prisma.cart.groupBy as jest.Mock).mockResolvedValueOnce([{ userId: 1 }]);

    (prisma.cartItem.groupBy as jest.Mock).mockResolvedValueOnce([
      { ClothesId: 1, _sum: { quantity: 15 } },
    ]);

    (prisma.clothes.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: "Shirt", category: { name: "Tops" } },
    ]);

    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValueOnce({
      createdAt: new Date("2025-09-01"),
    });

    (getPresenceCounts as jest.Mock).mockResolvedValueOnce({
      webLoadPct: 95,
      totalConnects: 300,
      customersOnline: 20,
      guestsOnline: 5,
    });

    await getAdminOverview(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        kpis: expect.any(Object),
        topSellingProducts: expect.any(Array),
        webStatus: expect.any(Object),
      })
    );
  });

  it("should handle errors", async () => {
    (prisma.transaction.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("DB error")
    );

    await getAdminOverview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
