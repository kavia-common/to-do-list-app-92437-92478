 /**
  * PUBLIC_INTERFACE
  */
function asyncHandler(fn) {
  /** Wrap async route handlers to forward errors to the central error handler. */
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
