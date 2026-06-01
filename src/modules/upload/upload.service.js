const path = require('node:path');
const crypto = require('node:crypto');
const { supabase, bucketName } = require('../../config/supabase');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

async function uploadUserImage(file) {
  if (!file) {
    return { ok: false, status: 400, error: 'No se recibió ninguna imagen.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      ok: false,
      status: 415,
      error: `Tipo de archivo no permitido. Usa: ${ALLOWED_MIME_TYPES.join(', ')}.`,
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, status: 413, error: 'La imagen supera el tamaño máximo permitido (5 MB).' };
  }

  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const storagePath = `users/${uniqueName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    return { ok: false, status: 502, error: `Error al subir imagen: ${error.message}` };
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

  return { ok: true, status: 201, data: { url: data.publicUrl } };
}

module.exports = { uploadUserImage };
