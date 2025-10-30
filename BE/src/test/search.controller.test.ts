// src/test/semanticSearch.controller.test.ts
import { semanticSearch } from "../controllers/search.controller";
import { Request, Response } from "express";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

// Mock OpenAI
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      embeddings: {
        create: jest.fn(),
      },
    })),
  };
});

// Mock Pinecone
jest.mock("@pinecone-database/pinecone", () => {
  return {
    Pinecone: jest.fn().mockImplementation(() => ({
      Index: jest.fn().mockReturnValue({
        query: jest.fn(),
      }),
    })),
  };
});

const mockReq = (body: any) => ({ body } as unknown as Request);
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("semanticSearch", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return filtered search results", async () => {
    const req = mockReq({ query: "hello world" });
    const res = mockRes();

    // @ts-ignore
    OpenAI.prototype.embeddings.create.mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    });

    const fakeMatches = [
      { id: "1", score: 0.4, metadata: { text: "match1" } },
      { id: "2", score: 0.2, metadata: { text: "match2" } },
    ];

    // @ts-ignore
    Pinecone.prototype.Index.mockReturnValue({
      query: jest.fn().mockResolvedValue({ matches: fakeMatches }),
    });

    await semanticSearch(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      results: [{ id: "1", score: 0.4, metadata: { text: "match1" } }],
    });
  });

  it("should return 400 if query is missing", async () => {
    const req = mockReq({});
    const res = mockRes();

    await semanticSearch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Query is required" });
  });

  it("should handle errors and return 500", async () => {
    const req = mockReq({ query: "test" });
    const res = mockRes();

    // @ts-ignore
    OpenAI.prototype.embeddings.create.mockRejectedValue(new Error("API error"));

    await semanticSearch(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
