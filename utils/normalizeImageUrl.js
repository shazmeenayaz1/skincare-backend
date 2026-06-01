/**
 * Ensures image fields work in admin/store (full https URL).
 */
export const normalizeImageUrl = (image) => {
  if (!image || typeof image !== 'string') return '';

  const trimmed = image.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  if (trimmed.includes('res.cloudinary.com')) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return trimmed;

  const path = trimmed.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${path}`;
};

export const fileUploadUrl = (file) => {
  if (!file) return '';
  return file.secure_url || file.url || file.path || '';
};
