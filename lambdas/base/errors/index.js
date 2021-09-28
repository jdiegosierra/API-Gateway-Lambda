class BaseError extends Error {
  constructor(
    name = 'Internal Server Error',
    description = 'An error has occured',
    status = 500
  ) {
    super(`${name}: ${description}`);
    this.name = this.constructor.name;
    this.description = this.constructor.description;
    this.message = `${name}: ${description}`;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NoPermissions extends BaseError {
  constructor() {
    super('Access Forbidden', 'You don`t have permissions for this operation', 401, true);
  }
}

class GenericBadRequest extends BaseError {
  constructor(description = 'Some of mandatory fields are missing') {
    super('Bad Request', description, 400, true);
  }
}

class NoMandatoryFields extends BaseError {
  constructor(description = 'Some of mandatory fields are missing') {
    super('Bad Request', description, 400, true);
  }
}

class NoSelfadjust extends BaseError {
  constructor(description = 'Self adjust not found') {
    super('Bad Request', description, 400, true);
  }
}

class BadSecurityKey extends BaseError {
  constructor(description = 'Bad security key') {
    super('Bad Request', description, 400, true);
  }
}

class IncorrectCredentials extends BaseError {
  constructor() {
    super('Access Forbidden', 'Incorrect username or password', 401, true);
  }
}

class TokenNotFound extends BaseError {
  constructor(description = 'Incorrect username or password') {
    super('Token Not Found', description, 449, true);
  }
}


class TokenNotValid extends BaseError {
  constructor(description = 'You must provide a valid token') {
    super('Unauthorized', description, 401, true);
  }
}

class ResourceNotFound extends BaseError {
  constructor(description = 'Resouce not found') {
    super('Not Found', description, 404, true);
  }
}

class InternalError extends BaseError {
  constructor(description = 'An error has occured') {
    super('Internal Server Error', description, 500);
  }
}

class Conflict extends BaseError {
  constructor(description = 'Conflict') {
    super('Conflict', description, 409, true);
  }
}

class LockedAccount extends BaseError {
  constructor(description = 'Account locked for too many failed attempts. Please contact the administrator') {
    super('invalid_client', description, 400, true);
  }
}

class TemporarilyLockedAccount extends BaseError {
  constructor(description = 'Account temporarily locked for too many failed attempts. Please wait') {
    super('invalid_client', description, 400, true);
  }
}

module.exports = {
  BaseError,
  NoPermissions,
  GenericBadRequest,
  NoSelfadjust,
  NoMandatoryFields,
  BadSecurityKey,
  IncorrectCredentials,
  TokenNotFound,
  TokenNotValid,
  ResourceNotFound,
  InternalError,
  Conflict,
  LockedAccount,
  TemporarilyLockedAccount,
};
