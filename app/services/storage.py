import os
import io
import cloudinary
import cloudinary.uploader
from app.config import settings

# Configure Cloudinary if credentials exist
if settings.CLAUDE_MODEL and settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )


def upload_file(buffer: io.BytesIO, filename: str) -> str:
    """
    Téléverse le fichier généré vers Cloudinary ou le stocke localement dans 'uploads/'.
    """
    buffer.seek(0)
    
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
        try:
            res = cloudinary.uploader.upload(
                buffer,
                public_id=filename,
                resource_type="auto"
            )
            return res.get("secure_url") or res.get("url")
        except Exception as e:
            print(f"[Cloudinary Warning] Upload échoué, repli local: {e}")

    # Fallback stockage local
    os.makedirs("uploads", exist_ok=True)
    local_path = os.path.join("uploads", os.path.basename(filename))
    with open(local_path, "wb") as f:
        f.write(buffer.read())
    
    return f"/uploads/{os.path.basename(filename)}"
