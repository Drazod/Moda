import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
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

async function processBatch(products: any[], batchSize = 5) {
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    // Process batch in parallel
    await Promise.all(batch.map(async (product) => {
      const text = `${product.name} ${product.description || ''} ${product.material || ''} ${product.information || ''}`;
      const embedding = await getEmbedding(text);

      await index.upsert([
        {
          id: product.id.toString(),
          values: embedding,
          metadata: {
            name: product.name,
            description: product.description,
            price: product.price,
            material: product.material ?? '',
            information: product.information ?? '',
          },
        },
      ]);

      console.log(`Indexed product: ${product.name}`);
    }));

    console.log(`Completed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function main() {
  const products = await prisma.clothes.findMany();
  console.log(`Found ${products.length} products to index`);

  await processBatch(products, 5); // Process 5 products at a time

  console.log('All products indexed to Pinecone!');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
