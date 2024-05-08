import { PrismaClient } from "@prisma/client";

class BatchService {
    constructor(private prisma: PrismaClient) { }
}

export default BatchService;
