// import express, { Request, Response } from 'express';

// const app = express();

// app.use(express.json());

// app.get('/', (req: Request, res: Response) => {
//     return res.send("Hello World!");
// });

// app.listen(3001, () => {
//     console.log('HTTP server running');
// });

import fastify from "fastify";

const app = fastify();
// const app = fastify({logger: true});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen({ port: 3001 }).then(() => {
    console.log('HTTP server running');
});