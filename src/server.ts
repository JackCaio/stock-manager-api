import fastify from "fastify";
import routes from "./routes";
import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: process.env.FRONTEND_URL,
});

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'Stock Manager',
            description: 'API de gerenciamento de estoque',
            version: '0.1.0'
        },
    },
    transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, { routePrefix: '/docs' });

app.register(routes.productRoute, { prefix: '/product' });
app.register(routes.supplierRoute, { prefix: '/supplier' });
app.register(routes.batchRoute, { prefix: '/batch' });

app.listen({ port: 3001, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server running');
});
