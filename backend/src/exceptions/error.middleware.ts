import { ErrorRequestHandler } from "express";
import { HttpException } from "./root"; // path ไปยัง base class ของคุณ

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return void res.status(401).json({ message: "Invalid token" });
  }

  if (err instanceof HttpException) {
    return void res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
      details: err.error,

    });
  }

  // ถ้าเป็น Error ปกติ
  if (err instanceof Error) {
    return void res.status(400).json({
      message: err.message,
    });
  }

  // default fallback
  console.error("Uncaught error:", err);
  return void res.status(500).json({
    message: "Internal server error",
    errorCode: 5000,
  });
};
