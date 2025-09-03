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
                url: "http://localhost:4000",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJSDoc(options);

export default specs;