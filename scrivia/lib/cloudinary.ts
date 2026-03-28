import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

/**
 * Upload un buffer (PDF/DOCX/XLSX) vers Cloudinary
 * Retourne l'URL sécurisée du fichier
 */
export async function uploadDocument(
  buffer: Buffer,
  fileName: string,
  folder = "scrivia/documents"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id:     fileName,
        resource_type: "raw",
        access_mode:   "authenticated",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export { cloudinary };
