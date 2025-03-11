const sendResponse = (res, statusCode, message, options = {}) => {
  const response = {
    success: statusCode < 400,
    statusCode,
    message,
    ...options,
  };

  return res.status(statusCode).json(response);
};

module.exports = { sendResponse };
