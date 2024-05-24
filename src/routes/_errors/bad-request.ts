export class BadRequest extends Error {
    constructor(public errorCode: number, message: string) {
        super(message);
        this.name = 'BadRequest';
    }
}