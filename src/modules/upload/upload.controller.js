const { uploadUserImage } = require('./upload.service');

async function uploadUserImageHandler(req, res, next) {
  try {
    const result = await uploadUserImage(req.file);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Imagen subida correctamente.',
      url: result.data.url,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { uploadUserImageHandler };
