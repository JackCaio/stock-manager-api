import { productService, supplierService, validator } from "../service";
import ProductController from "./ProductController";
import SupplierController from "./SupplierController";

export const productController = new ProductController(productService, validator);
export const supplierController = new SupplierController(supplierService, validator);
