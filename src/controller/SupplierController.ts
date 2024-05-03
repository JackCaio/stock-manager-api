import { FastifyReply, FastifyRequest } from "fastify";
import SupplierService from "../service/SupplierService";
import { Supplier, SupplierParams } from "../interface/Supplier";
import { ValidationService } from "../service/ValidationService";

class SupplierController {
    constructor(private service: SupplierService, private validator: ValidationService) { }

    public fetchSupplierList = async (_req: FastifyRequest, res: FastifyReply) => {
        const suppliers = await this.service.fetchList()

        res.status(200).send({ suppliers });
    }

    public fetchSupplierById = async (req: FastifyRequest, res: FastifyReply) => {
        const { supplierId } = req.params as SupplierParams;

        try {
            const supplier = await this.service.fetchById(supplierId);

            return res.status(200).send({ supplier });
        } catch (error) {
            throw new Error('Supplier not found');
        }
    }

    public createSupplier = async (req: FastifyRequest, res: FastifyReply) => {
        const { name, phone } = req.body as Supplier;

        const supplier = await this.service.create(name, phone)

        return res.status(201).send({ supplierId: supplier.id });
    }
}

export default SupplierController;
