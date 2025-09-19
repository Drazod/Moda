import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: './khanh-bakery.json',
});

async function listBuckets() {
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');
  buckets.forEach(bucket => {
    console.log(bucket.name);
  });
}

listBuckets();
