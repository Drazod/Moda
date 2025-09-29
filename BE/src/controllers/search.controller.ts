import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { prisma } from '..';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.Index(process.env.PINECONE_INDEX!);

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export const semanticSearch = async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const queryEmbedding = await getEmbedding(query);
    const results = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });
    // Set a score threshold (e.g., 0.75 for cosine similarity)
    const SCORE_THRESHOLD = 0.35;
    const filteredMatches = (results.matches || []).filter(match => match.score !== undefined && match.score >= SCORE_THRESHOLD);
    
    // Extract product IDs from search results (IDs are stored as Pinecone vector IDs)
    const productIds = filteredMatches.map(match => 
      parseInt(match.id)
    ).filter(id => !isNaN(id));

    if (productIds.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch full product details from database in the same format as clothesList
    const products = await prisma.clothes.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        category: true,
        mainImg: true,
        extraImgs: true,
        sizes: true,
        features: true,
      },
    });

    // Sort products by search relevance (maintain Pinecone order)
    const sortedProducts = productIds.map(id => 
      products.find(product => product.id === id)
    ).filter(Boolean);

    res.status(200).json(sortedProducts);
  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
