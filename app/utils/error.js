class HttpError extends Error {
  constructor(msg = "Invalid Request.", status = 400) {
    super(msg);
    this.status = status;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

class ValidationError extends HttpError {
  constructor(errors, msg = "Invalid data.") {
    super(msg, 400);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

class RequestError extends HttpError {
  constructor(msg, code = "requestError") {
    super(msg, 400);
    this.name = "RequestError";
    this.code = code;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      code: this.code,
    };
  }
}

class NotAuthorizedError extends HttpError {
  constructor(msg = "Not authorized.") {
    super(msg, 401);
  }
}

class NotFoundError extends HttpError {
  constructor(errors, msg = "Not found.") {
    super(msg, 404);
    this.errors = errors;
    this.name = "GetItemError";
  }
}

class FoundError extends HttpError {
  constructor(errors, msg = "Found.") {
    super(msg, 409);
    this.errors = errors;
    this.name = "GetItemError";
  }
}

class Forbidden extends HttpError {
  constructor (errors, msg = 'Forbidden.') {
    super(msg, 403);
    this.errors = errors;
    this.name = 'AccessForbidden';
  }
}

module.exports = {
  HttpError,
  RequestError,
  ValidationError,
  NotAuthorizedError,
  NotFoundError,
  FoundError,
  Forbidden,
};
