class CoconutError extends Error {
  constructor(raw = {}) {
    super(raw.message);

    this.error_code = raw.error_code;
    this.message = raw.message;
  }
}

module.exports.CoconutError = CoconutError;