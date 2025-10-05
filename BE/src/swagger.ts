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
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '+84123456789' },
            address: { type: 'string', example: '123 Main St, Ho Chi Minh City' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'HOST'], example: 'USER' },
            points: { type: 'integer', example: 150 },
            avatarId: { type: 'integer', nullable: true, example: 5 },
            avatar: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'integer', example: 5 },
                name: { type: 'string', example: '1696444800000_avatar_profile.jpg' },
                url: { type: 'string', example: 'https://firebasestorage.googleapis.com/v0/b/.../avatar.jpg' }
              }
            },
            createdAt: { type: 'string', format: 'date-time', example: '2023-09-01T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-09-15T15:30:00Z' }
          }
        },
        TransactionHistory: {
          type: 'object',
          properties: {
            orderId: { type: 'string', example: '#1234' },
            detail: { type: 'string', example: 'Shirt (M) x2, Jean (L) x1' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  transactionDetailId: { type: 'integer', example: 1 },
                  clothesId: { type: 'integer', example: 5 },
                  clothesName: { type: 'string', example: 'Cotton T-Shirt' },
                  size: { type: 'string', example: 'M' },
                  unitPrice: { type: 'string', example: '150,000 VND' },
                  originalQuantity: { type: 'integer', example: 2 },
                  refundedQuantity: { type: 'integer', example: 0 },
                  availableForRefund: { type: 'integer', example: 2 },
                  canRefund: { type: 'boolean', example: true },
                  refundStatus: { type: 'string', enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], example: 'NONE' },
                  latestRefundReason: { type: 'string', nullable: true, example: null },
                  latestRefundAdminNote: { type: 'string', nullable: true, example: null },
                  hasCommented: { type: 'boolean', example: false },
                  canComment: { type: 'boolean', example: true },
                  userComment: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'integer', example: 1 },
                      content: { type: 'string', example: 'Great product!' },
                      rating: { type: 'integer', example: 5 },
                      createdAt: { type: 'string', format: 'date-time', example: '2023-09-20T10:00:00Z' }
                    }
                  }
                }
              }
            },
            date: { type: 'string', example: 'Tuesday, 17 Sept' },
            time: { type: 'string', example: '7:00 pm' },
            price: { type: 'string', example: '200,000 VND' },
            state: { type: 'string', enum: ['ORDERED', 'PENDING', 'SHIPPING', 'COMPLETE'], example: 'COMPLETE' },
            canRefundAny: { type: 'boolean', example: true },
            canCommentAny: { type: 'boolean', example: true },
            hasCommentedAny: { type: 'boolean', example: false }
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            transactionDetailId: { type: 'integer', example: 1 },
            content: { type: 'string', example: 'Excellent product! Very satisfied with the quality.' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            isVerifiedPurchase: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2023-09-20T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-09-20T10:00:00Z' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'John Doe' },
                avatar: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    url: { type: 'string', example: 'https://firebasestorage.googleapis.com/v0/b/.../avatar.jpg' }
                  }
                }
              }
            },
            transactionDetail: {
              type: 'object',
              properties: {
                clothes: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 5 },
                    name: { type: 'string', example: 'Cotton T-Shirt' }
                  }
                },
                size: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 2 },
                    label: { type: 'string', example: 'M' }
                  }
                }
              }
            }
          }
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
