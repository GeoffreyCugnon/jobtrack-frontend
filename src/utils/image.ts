/**
 * Prépare une image choisie par l'utilisateur pour servir d'avatar :
 * recadrage carré centré + redimensionnement, renvoyée en data URL JPEG
 * (assez compacte pour être stockée telle quelle en base, cf. `User.avatar_url`).
 */
export async function fileToAvatarDataUrl(
  file: File,
  size = 256,
  quality = 0.82,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non disponible");

    const min = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - min) / 2;
    const sy = (bitmap.height - min) / 2;
    ctx.drawImage(bitmap, sx, sy, min, min, 0, 0, size, size);

    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}

/**
 * Prépare une image jointe à un post (composeur de publication) : pas de
 * recadrage (contrairement à l'avatar/la bannière) — juste un redimensionnement
 * si l'image dépasse `maxDimension`, pour rester léger en data URL (stockée
 * telle quelle, `Publication.image_url`, colonne LONGTEXT).
 */
export async function fileToPostImageDataUrl(
  file: File,
  maxDimension = 1080,
  quality = 0.75,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non disponible");
    ctx.drawImage(bitmap, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}

/**
 * Prépare une image choisie par l'utilisateur pour servir de bannière de
 * profil : recadrage « cover » centré vers un rapport large + redimensionnement,
 * renvoyée en data URL JPEG (stockée telle quelle en base, cf. `User.banner_url`,
 * colonne LONGTEXT).
 */
export async function fileToBannerDataUrl(
  file: File,
  width = 1200,
  height = 420,
  quality = 0.72,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non disponible");

    // « cover » : on remplit tout le cadre en gardant le centre de l'image.
    const scale = Math.max(width / bitmap.width, height / bitmap.height);
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    ctx.drawImage(bitmap, (width - dw) / 2, (height - dh) / 2, dw, dh);

    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}
