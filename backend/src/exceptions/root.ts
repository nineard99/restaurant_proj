export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    error: any;
  
    constructor(message: string, statusCode: number, errorCode: any, error: any) {
      super(message);
      this.message = message;
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      this.error = error;
    }

}
export enum ErrorCode {
  USER_NOT_FOUND = 1001,           // ไม่พบผู้ใช้
  USER_ALREADY_EXIST = 1002,       // ผู้ใช้ซ้ำ
  INCORRECT_PASSWORD = 1003,       // รหัสผ่านผิด
  INVALID_INPUT = 1100,            // ข้อมูลไม่ถูกต้อง
  UNAUTHORIZED = 2000,             // ไม่ได้ล็อกอิน
  FORBIDDEN = 2001,                // ไม่มีสิทธิ์
  INTERNAL_SERVER_ERROR = 5000,    // ข้อผิดพลาดเซิร์ฟเวอร์
}
