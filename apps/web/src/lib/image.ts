/** Compress / resize uploaded image for localStorage-friendly listing photos. */
export async function fileToListingPhoto(
  file: File,
  maxSide = 1200,
  quality = 0.78,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Можно загружать только изображения');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Файл слишком большой (макс. 12 МБ)');
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось обработать изображение');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}

export function isDataImage(src?: string | null) {
  return !!src && (src.startsWith('data:') || src.startsWith('blob:'));
}

/** Square cropped avatar, compressed for localStorage. */
export async function fileToAvatarPhoto(file: File, size = 256, quality = 0.82): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Можно загружать только изображения');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Файл слишком большой (макс. 12 МБ)');
  }

  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = Math.floor((bitmap.width - side) / 2);
  const sy = Math.floor((bitmap.height - side) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось обработать изображение');
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}
