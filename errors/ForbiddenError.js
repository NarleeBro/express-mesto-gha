/* const { HTTP_STATUS_FORBIDDEN } = require('http2').constants; */

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    /* this.statusCode = HTTP_STATUS_FORBIDDEN; */
    this.statusCode = 403;
  }
};
