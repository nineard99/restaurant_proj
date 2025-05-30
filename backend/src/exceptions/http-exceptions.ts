import { ErrorCode, HttpException } from "./root";

/** Exception กรณีข้อมูลไม่พบ (404 Not Found) */
  export class NotFoundException extends HttpException {
    constructor(message = "Resource not found", details?: any) {
      super(message, 404, ErrorCode.USER_NOT_FOUND, details);
    }
  }
  
  /** Exception กรณีข้อมูลส่งมาไม่ถูกต้อง (400 Bad Request) */
  export class BadRequestException extends HttpException {
    constructor(message = "Invalid request", details?: any) {
      super(message, 400, ErrorCode.INVALID_INPUT, details);
    }
  }
  
  /** Exception กรณีผู้ใช้ยังไม่ได้รับอนุญาต (401 Unauthorized) */
  export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized", details?: any) {
      super(message, 401, ErrorCode.UNAUTHORIZED, details);
    }
  }
  
  /** Exception กรณีไม่มีสิทธิ์เข้าถึง (403 Forbidden) */
  export class ForbiddenException extends HttpException {
    constructor(message = "Access denied", details?: any) {
      super(message, 403, ErrorCode.FORBIDDEN, details);
    }
  }
  
  /** Exception กรณีเกิดข้อมูลซ้ำหรือขัดแย้ง (409 Conflict) */
  export class ConflictException extends HttpException {
    constructor(message = "Conflict occurred", details?: any) {
      super(message, 409, ErrorCode.USER_ALREADY_EXIST, details);
    }
  }
  
  /** Exception กรณีเกิดข้อผิดพลาดในเซิร์ฟเวอร์ (500 Internal Server Error) */
  export class InternalServerErrorException extends HttpException {
    constructor(message = "Internal server error", details?: any) {
      super(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, details);
    }
  }