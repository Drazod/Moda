"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.bucket = void 0;
const express_1 = __importDefault(require("express"));
const configs_1 = require("./configs");
const client_1 = require("@prisma/client");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
// swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
// Firebase
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
const app = (0, express_1.default)();
const khanh_bakery_json_1 = __importDefault(require("../khanh-bakery.json"));
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(khanh_bakery_json_1.default),
    storageBucket: 'moda-938e0.appspot.com'
});
exports.bucket = (0, storage_1.getStorage)().bucket('moda-938e0');
exports.prisma = new client_1.PrismaClient({
    errorFormat: 'pretty',
    log: ['query', 'info', 'error']
});
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
};
// cookie parser middleware
app.use((0, cookie_parser_1.default)());
// Integrar Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// middleware
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(index_routes_1.default);
app.listen(configs_1.PORT, () => {
    console.log(`Server ready at: ${configs_1.SERVER_URL}`);
    console.log(`Server is running on port ${configs_1.PORT}`);
});
