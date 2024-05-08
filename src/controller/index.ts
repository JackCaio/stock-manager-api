import { batchService, productService, supplierService, validator } from "../service";
import BatchController from "./BatchController";
import ProductController from "./ProductController";
import SupplierController from "./SupplierController";

export const productController = new ProductController(productService, validator);
export const supplierController = new SupplierController(supplierService, validator);
export const batchController = new BatchController(batchService, validator);
