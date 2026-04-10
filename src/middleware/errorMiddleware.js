const notFound = (req, res, next) => {
  try {
    return res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
  } catch (err) {
    return next(err);
  }
};

const errorHandler = (err, req, res, next) => {
  try {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    return res.status(statusCode).json({
      error: err.message || 'Internal server error'
    });
  } catch (handlerError) {
    return res.status(500).json({
      error: handlerError.message || 'Internal server error'
    });
  }
};

module.exports = {
  notFound,
  errorHandler
};
