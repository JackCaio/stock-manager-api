import { productService } from "../service";
import ProductController from "./ProductController";


export const productController = new ProductController(productService);
