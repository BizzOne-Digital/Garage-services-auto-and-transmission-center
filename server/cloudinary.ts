import crypto from 'node:crypto';
import { env } from './env.ts';
import { badRequest, HttpError } from './http.ts';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}

/**
 * Uploads a base64 data URI to Cloudinary using its REST API and a signed
 * request. Kept dependency-free — the signature is a plain SHA-1 of the
 * sorted parameters, exactly as Cloudinary documents it.
 */
export const uploadToCloudinary = async (
  dataUri: string,
  kind: 'image' | 'video'
): Promise<CloudinaryUploadResult> => {
  if (!env.cloudinary.configured) {
    throw badRequest(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or add media by URL instead.'
    );
  }
  if (!/^data:(image|video)\//i.test(dataUri)) {
    throw badRequest('Upload payload must be a base64 data URI.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = env.cloudinary.folder;
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${env.cloudinary.apiSecret}`;
  const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

  const body = new URLSearchParams({
    file: dataUri,
    api_key: env.cloudinary.apiKey,
    timestamp: String(timestamp),
    folder,
    signature,
  });

  const endpoint = `https://api.cloudinary.com/v1_1/${env.cloudinary.cloudName}/${kind}/upload`;

  let response: Response;
  try {
    response = await fetch(endpoint, { method: 'POST', body });
  } catch {
    throw new HttpError(502, 'Could not reach the media storage provider. Please try again.');
  }

  const payload = (await response.json().catch(() => null)) as
    | { secure_url?: string; public_id?: string; format?: string; bytes?: number; width?: number; height?: number; error?: { message?: string } }
    | null;

  if (!response.ok || !payload?.secure_url) {
    // Surface Cloudinary's own message (safe, user-facing) but nothing else.
    throw new HttpError(502, payload?.error?.message || 'Media upload failed.');
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id ?? '',
    format: payload.format ?? '',
    bytes: payload.bytes ?? 0,
    width: payload.width ?? 0,
    height: payload.height ?? 0,
  };
};

/** Best-effort removal of a Cloudinary asset when its library entry is deleted. */
export const destroyOnCloudinary = async (
  publicId: string,
  kind: 'image' | 'video'
): Promise<void> => {
  if (!env.cloudinary.configured || !publicId) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${env.cloudinary.apiSecret}`)
    .digest('hex');

  try {
    await fetch(`https://api.cloudinary.com/v1_1/${env.cloudinary.cloudName}/${kind}/destroy`, {
      method: 'POST',
      body: new URLSearchParams({
        public_id: publicId,
        api_key: env.cloudinary.apiKey,
        timestamp: String(timestamp),
        signature,
      }),
    });
  } catch {
    // Deleting the library record is what matters; a stale remote asset is tolerable.
  }
};
