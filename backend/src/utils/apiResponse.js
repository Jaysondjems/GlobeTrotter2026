function success(res, statusCode, data, extra = {}) {
  return res.status(statusCode).json({ success: true, data, ...extra });
}

function error(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

module.exports = { success, error };
