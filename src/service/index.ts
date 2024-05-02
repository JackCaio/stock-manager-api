import { prisma } from "../lib/prisma";
import ProductService from "./ProductService";
import SupplierService from "./SupplierService";

export const productService = new ProductService(prisma);
export const supplierService = new SupplierService(prisma);
