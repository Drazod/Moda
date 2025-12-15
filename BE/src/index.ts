import express from 'express';
import http from 'http';
import { PORT, SERVER_URL, firebaseConfig } from './configs';
import { PrismaClient } from '@prisma/client';
import route from './routes/index.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import "dotenv/config";
import { JWT } from "google-auth-library";
import * as admin from "firebase-admin";
// swagger
import swaggerUI, { SwaggerUiOptions } from 'swagger-ui-express'; 
import swaggerDocument from './swagger';

// Firebase
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const app = express();
const server = http.createServer(app);
import { initSocket } from './socket';
export const io = initSocket(server);

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.FIREBASE_PROJECT_ID;
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || "moda-938e0.firebasestorage.app";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  storageBucket: bucketName,
});

export const bucket = admin.storage().bucket();

export const prisma = new PrismaClient({
    errorFormat: 'pretty',
    log: ['query', 'info', 'error']
})

const allowedOrigins = ['http://localhost:5173', 'moda-six.vercel.app','https://moda-six.vercel.app'];

const corsOptions = {
     origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void)  => {
        console.log('CORS Origin:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and credentials
    optionsSuccessStatus: 200,
};
const sanitize = (s?: string) =>
  (s ?? "")
    .trim()
    .replace(/^"|"$/g, "")      // bỏ dấu " bọc ngoài (nếu UI thêm)
    .replace(/\r/g, "");        // bỏ \r (Windows)

// Route 1: dump env ở mức an toàn (không lộ key)
app.get("/__env-dump", (_req, res) => {
  const raw = process.env.FIREBASE_PRIVATE_KEY ?? "";
  const sanitized = sanitize(raw);
  const replaced = sanitized.replace(/\\n/g, "\n");
  res.json({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    bucket: process.env.FIREBASE_STORAGE_BUCKET,
    rawLen: raw.length,
    sanitizedLen: sanitized.length,
    replacedLen: replaced.length,
    startsWith: sanitized.slice(0, 30),
    endsWith: sanitized.slice(-30),
    hasEscapedNewlines: /\\n/.test(sanitized), // true nếu đang là 1 dòng có "\n"
  });
});

// Route 2: test ký JWT thật
app.get("/_debug/google-token", async (_req, res) => {
  try {
    const key = sanitize(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n");
    const email = sanitize(process.env.FIREBASE_CLIENT_EMAIL);

    const client = new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/devstorage.full_control"],
    });

    const t = await client.getAccessToken();
    res.json({
      ok: true,
      keyId: sanitize(process.env.FIREBASE_PRIVATE_KEY_ID),
      tokenPrefix: String(t?.token).slice(0, 24),
    });
  } catch (e: any) {
    console.error("JWT test error:", e?.response?.data || e);
    res.status(500).json({ ok: false, err: e?.message, data: e?.response?.data });
  }
});
// cookie parser middleware
app.use(cookieParser());

// Integrar Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(route);

// Log server connection details
console.log('Server is running in environment:', process.env.NODE_ENV || 'development');
console.log('Allowed Origins:', allowedOrigins);
console.log('CORS configuration initialized.');

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    next();
});

server.listen(PORT, () => {
    console.log(`Server ready at: ${SERVER_URL}`);
    console.log(`Server is running on port ${PORT}`);
});