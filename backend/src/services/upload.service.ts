import { cloudinary } from "../utils/cloudinary";
import streamifier from "streamifier";

export const uploadImageToCloudinary = (
  fileBuffer: Buffer,
  folder :string,
  publicId?: string
) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId, // 👈 กำหนดชื่อรูปเองได้
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

  