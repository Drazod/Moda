import express from 'express';
import http from 'http';
import { PORT, SERVER_URL, firebaseConfig } from './configs';
import { PrismaClient } from '@prisma/client';
import route from './routes/index.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';

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

import serviceAccount from '../khanh-bakery.json';

initializeApp({
    credential: cert(serviceAccount as any),
    storageBucket: 'moda-938e0.firebasestorage.app'
  });

export const bucket = getStorage().bucket('moda-938e0.firebasestorage.app');

export const prisma = new PrismaClient({
    errorFormat: 'pretty',
    log: ['query', 'info', 'error']
})

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
}

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

server.listen(PORT, () => {
    console.log(`Server ready at: ${SERVER_URL}`);
    console.log(`Server is running on port ${PORT}`);
});