'use strict';

let CONSTANTS = {};

CONSTANTS.SERVER = {
  ADMINPASSWORD: process.env.ADMIN_PASSWORD,
}

CONSTANTS.USER_ROLES = {
  NORMAL: 1,
  ADMIN: 2
};

CONSTANTS.AVAILABLE_AUTHS = {
  USER: 'user',
};

CONSTANTS.PASSWORD_PATTER_REGEX = /^(?=.{6,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;

CONSTANTS.NORMAL_PROJECTION = { __v: 0, isDeleted: 0, createdAt: 0, updatedAt: 0 };

CONSTANTS.MESSAGES = require('./messages');

CONSTANTS.SECURITY = {
  JWT_SIGN_KEY: 'fasdkfjklandfkdsfjladsfodfafjalfadsfkads',
  BCRYPT_SALT: 8
};

CONSTANTS.RESPONSE = {
  ERROR: {
    DATA_NOT_FOUND: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 404,
        msg: msg,
        status: false,
        type: 'DATA_NOT_FOUND',
      };
    },
    BAD_REQUEST: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 400,
        msg: msg,
        status: false,
        type: 'BAD_REQUEST',
      };
    },
    MONGO_EXCEPTION: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 100,
        msg: msg,
        status: false,
        type: 'MONGO_EXCEPTION',
      };
    },
    ALREADY_EXISTS: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 400,
        msg: msg,
        status: false,
        type: 'ALREADY_EXISTS',
      };
    },
    PASSWORD_PATTERN_MISMATCH: (msg) => {
      if(!msg){
        msg = '';
      }
      return {
        statusCode: 400,
        msg:msg,
        status: false,
        type: 'PASSWORD_PATTERN_DID_NOT_MATCH'
      }
    },
    FORBIDDEN: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 403,
        msg: msg,
        status: false,
        type: 'Forbidden',
      };
    },
    INTERNAL_SERVER_ERROR: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 500,
        msg: msg,
        status: false,
        type: 'INTERNAL_SERVER_ERROR',
      };
    },
    UNAUTHORIZED: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 401,
        msg: msg,
        status: false,
        type: 'UNAUTHORIZED',
      };
    }
  },
  SUCCESS: {
    MISSCELANEOUSAPI: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 200,
        msg: msg,
        status: true,
        type: 'Default',
      };
    }
  }
};

CONSTANTS.DEFAULT_RESPONSES = [
  { code: 200, message: 'OK' },
  { code: 400, message: 'Bad Request' },
  { code: 401, message: 'Unauthorized' },
  { code: 404, message: 'Data Not Found' },
  { code: 500, message: 'Internal Server Error' }
];

CONSTANTS.PATH_TO_RESET_PASSWORD_TEMPLATE = './utils/templates/reset-password.html';
CONSTANTS.PATH_TO_RESET_PASSWORD_LINK_EXPIRED_TEMPLATE = './utils/templates/password-link-expired.html';
CONSTANTS.EMAIL_CONTENTS = require('./emailTemplates');

CONSTANTS.EMAIL_SUBJECTS = {
  WELCOME_VERIFICATION_EMAIL: 'User Verification Email:  ChicMic',
  FORGOT_PASSWORD_EMAIL: 'Forgot Password: ChicMic'
};

CONSTANTS.EMAIL_TYPES = {
  WELCOME_VERIFICATION_EMAIL: 1,
  FORGOT_PASSWORD_EMAIL: 2,
  FORGOT_PASSWORD_EMAIL_UPDATED: 3
};

module.exports = CONSTANTS;
