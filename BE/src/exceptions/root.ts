import { error } from "console";

class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    error: any;

    constructor(message: string, errorCode: any, statusCode: number, error: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.error = error;
    }
}

export enum ErroCodes {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
}