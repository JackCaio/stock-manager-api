import { prisma } from "../lib/prisma";
import ProductService from "./ProductService";

export const productService = new ProductService(prisma);