import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BE API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "https://moda-production.up.railway.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        TransactionHistory: {
          type: 'object',
          properties: {
            orderId: { type: 'string', example: '#1234' },
            detail: { type: 'string', example: 'Shirt (M), Jean (L)' },
            date: { type: 'string', example: 'Tuesday, 17 Sept' },
            time: { type: 'string', example: '7:00 pm' },
            price: { type: 'string', example: '200,000 VND' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJSDoc(options);

export default specs;
