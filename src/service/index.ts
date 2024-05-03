import { prisma } from "../lib/prisma";
import ProductService from "./ProductService";
import SupplierService from "./SupplierService";
import { ValidationService } from "./ValidationService";

export const validator = new ValidationService(prisma);
export const productService = new ProductService(prisma);
export const supplierService = new SupplierService(prisma);
