/* ==========================================================================
   Storyboard Workspace — Cloudinary Direct Upload Service
   Handles client-side unsigned media uploads for Images and Videos
   ========================================================================== */

// Environment configs with fallbacks to project .env settings
export const CLOUDINARY_CONFIG = {
  video: {
    cloudName: import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drkbqpxqf',
    uploadPreset: import.meta.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'vidgram',
  },
  image: {
    cloudName: import.meta.env.NEXT_PUBLIC_IMG_CLOUDINARY_CLOUD_NAME || 'dwgfox722',
    uploadPreset: import.meta.env.NEXT_PUBLIC_IMG_CLOUDINARY_UPLOAD_PRESET || 'lynke_app',
  },
};

/**
 * Upload a media file directly to Cloudinary using unsigned upload preset
 * @param {File|Blob} file - The file object to upload
 * @param {'image'|'video'} type - Resource type
 * @param {function} [onProgress] - Optional progress callback (0 - 100)
 * @returns {Promise<{ url: string, thumbnailUrl: string, publicId: string, format: string, width: number, height: number, duration?: number }>}
 */
export async function uploadToCloudinary(file, type = 'image', onProgress = null) {
  const config = type === 'video' ? CLOUDINARY_CONFIG.video : CLOUDINARY_CONFIG.image;

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error(`Cloudinary ${type} configuration missing (check cloud name & upload preset in .env)`);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/${type}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    // Track upload progress if supported
    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);

            // Generate optimized URLs
            const secureUrl = data.secure_url;
            const publicId = data.public_id;
            let thumbnailUrl = secureUrl;

            if (type === 'video') {
              // Automatic poster frame thumbnail from video
              thumbnailUrl = `https://res.cloudinary.com/${config.cloudName}/video/upload/so_0,w_800,c_fill,q_auto,f_auto/${publicId}.jpg`;
            } else {
              // Optimized responsive image thumbnail
              thumbnailUrl = `https://res.cloudinary.com/${config.cloudName}/image/upload/w_800,c_fill,q_auto,f_auto/${publicId}`;
            }

            resolve({
              url: secureUrl,
              thumbnailUrl,
              publicId,
              format: data.format,
              width: data.width,
              height: data.height,
              duration: data.duration,
              bytes: data.bytes,
            });
          } catch (err) {
            reject(new Error('Failed to parse Cloudinary response'));
          }
        } else {
          let errorMsg = `Cloudinary upload failed with status ${xhr.status}`;
          try {
            const errData = JSON.parse(xhr.responseText);
            if (errData.error?.message) {
              errorMsg = errData.error.message;
            }
          } catch (e) { /* ignore */ }
          reject(new Error(errorMsg));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
    xhr.open('POST', endpoint, true);
    xhr.send(formData);
  });
}
