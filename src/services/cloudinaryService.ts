// Layanan upload ke Cloudinary (unsigned upload via Upload API)
// Dokumentasi: https://cloudinary.com/documentation/upload_images#unsigned_upload

const CLOUD_NAME = 'q540iwwj';            // ← Ganti dengan cloud name Anda
const UPLOAD_PRESET = 'ppnp_unsigned';   // ← Ganti dengan preset name Anda
const FOLDER = 'ppnp-internship';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

// Upload gambar dari URI lokal (hasil Expo ImagePicker) ke Cloudinary
export const uploadImageToCloudinary = async (
  localUri: string,
  options?: { folder?: string; base64?: string; mimeType?: string }
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();

  // Ambil nama file dari URI (untuk MIME type)
  const fileName = localUri.split('/').pop() ?? `photo_${Date.now()}.jpg`;
  const fileType = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';

  // Android/RN terbaru dapat menolak FormDataPart berbasis { uri }.
  // Cloudinary juga menerima data URI, sehingga jalur base64 menghindari
  // implementasi FormDataPart native yang bermasalah.
  if (options?.base64) {
    const mimeType = options.mimeType ?? `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;
    formData.append('file', `data:${mimeType};base64,${options.base64}`);
  } else {
    formData.append('file', {
      uri: localUri,
      name: fileName,
      type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
    } as any);
  }

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', options?.folder ?? FOLDER);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
      // JANGAN set Content-Type — biarkan fetch menambahkan boundary otomatis
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload gagal (${response.status}): ${errorText}`);
  }

  const json = (await response.json()) as CloudinaryUploadResult;
  return json;
};

// Upload video (opsional, untuk dokumentasi video)
export const uploadVideoToCloudinary = async (
  localUri: string,
  options?: { folder?: string }
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  const fileName = localUri.split('/').pop() ?? `video_${Date.now()}.mp4`;
  const fileType = fileName.split('.').pop()?.toLowerCase() ?? 'mp4';

  formData.append('file', {
    uri: localUri,
    name: fileName,
    type: `video/${fileType}`,
  } as any);

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', options?.folder ?? `${FOLDER}/videos`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary video upload gagal (${response.status}): ${errorText}`);
  }

  return (await response.json()) as CloudinaryUploadResult;
};
