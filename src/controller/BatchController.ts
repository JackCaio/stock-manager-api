import BatchService from "../service/BatchService";
import { ValidationService } from "../service/ValidationService";

class BatchController {
    constructor(private service: BatchService, private validator: ValidationService) { }
}

export default BatchController
