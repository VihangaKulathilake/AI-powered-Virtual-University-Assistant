const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  ALLOWED_EXTENSIONS: ['.pdf', '.txt', '.doc', '.docx', '.pptx'],
};

module.exports = {
  HTTP_STATUS,
  FILE_LIMITS,
};
