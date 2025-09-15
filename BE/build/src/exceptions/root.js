"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErroCodes = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, error) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.error = error;
    }
}
var ErroCodes;
(function (ErroCodes) {
    ErroCodes["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    ErroCodes["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
    ErroCodes["INCORRECT_PASSWORD"] = "INCORRECT_PASSWORD";
})(ErroCodes || (exports.ErroCodes = ErroCodes = {}));
