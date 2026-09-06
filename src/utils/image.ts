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
