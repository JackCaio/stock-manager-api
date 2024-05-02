import { productService, supplierService } from "../service";
import ProductController from "./ProductController";
import SupplierController from "./SupplierController";

export const productController = new ProductController(productService);
export const supplierController = new SupplierController(supplierService);
