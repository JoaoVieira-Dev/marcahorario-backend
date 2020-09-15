import HttpResponseError from '../exceptions/HttpResponseError';
import logger from './logger';

const {
  ValidationError,
  NotFoundError,
} = require('objection');

const {
  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = require('objection-db-errors');

export default function errorToResponse(error, extra = {}) {
  logger.error(error);
  if (error instanceof ValidationError) {
    return [400, {
      ...extra,
      message: error.message,
      type: error.type || 'ModelValidation',
      result: error.data,
    }];
  }

  if (error instanceof HttpResponseError) {
    return [error.status, error.response(extra)];
  }

  if (error instanceof NotFoundError) {
    return [404, {
      ...extra,
      message: 'Model not found',
      type: 'NotFound',
      result: {},
    }];
  }

  if (error instanceof UniqueViolationError) {
    return [409, {
      ...extra,
      message: error.message,
      type: 'UniqueViolation',
      result: {
        columns: error.columns,
        table: error.table,
        constraint: error.constraint,
      },
    }];
  }

  if (error instanceof NotNullViolationError) {
    return [400, {
      ...extra,
      message: error.message,
      type: 'NotNullViolation',
      result: {
        column: error.column,
        table: error.table,
      },
    }];
  }

  if (error instanceof ForeignKeyViolationError) {
    return [409, {
      ...extra,
      message: error.message,
      type: 'ForeignKeyViolation',
      result: {
        table: error.table,
        constraint: error.constraint,
      },
    }];
  }

  if (error instanceof CheckViolationError) {
    return [400, {
      ...extra,
      message: error.message,
      type: 'CheckViolation',
      result: {
        table: error.table,
        constraint: error.constraint,
      },
    }];
  }

  if (error instanceof DataError) {
    return [400, {
      ...extra,
      message: error.message,
      type: 'InvalidData',
      result: {},
    }];
  }

  if (error instanceof DBError) {
    return [500, {
      ...extra,
      message: error.message,
      type: 'UnknownDatabaseError',
      result: {},
    }];
  }

  return [error.status || error.statusCode || 500, {
    ...extra,
    success: false,
    status: error.status || error.statusCode,
    type: error.name,
    message: error.message || (error.nativeError ? error.nativeError.message : null),
  }];
}
