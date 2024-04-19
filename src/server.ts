import fastify from "fastify";
import routes from "./routes";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.register(routes.productRoute, { prefix: '/product' });
app.register(routes.supplierRoute, { prefix: '/supplier' });

app.listen({ port: 3001 }).then(() => {
    console.log('HTTP server running');
});
