const jwt = require('jsonwebtoken');
const CONFIG = require('../config')
const CONSTANTS = require('../utils/constants');

const userModel = require('../models/userModel');

const commonFunctions = require('../utils/commonFunction');

let authService = {};

/** 
 * function to register a new  user
 */

authService.registerUser = async (payload) => {
  let emailExist = !!(await userModel.findOne({ email: payload.email }));
  if (emailExist) {
    throw CONSTANTS.RESPONSE.ERROR.ALREADY_EXISTS(CONSTANTS.MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  let regex = new RegExp(CONSTANTS.PASSWORD_PATTER_REGEX);

  if(!regex.test(payload.password)){
    throw CONSTANTS.RESPONSE.ERROR.PASSWORD_PATTERN_MISMATCH(CONSTANTS.MESSAGES.PASSWORD_REGEX_MATCH);
  }

  payload.password = commonFunctions.hashPassword(payload.password)
  let user = new userModel(payload)
  return (await user.save()).toObject()
}

/**
 * function to login user
 */

 authService.login = async (payload) => {
  let user = await userModel.findOne({ email: payload.email }).lean();
  let regex = new RegExp(CONSTANTS.PASSWORD_PATTER_REGEX);

  if(!regex.test(payload.password)){
    throw CONSTANTS.RESPONSE.ERROR.PASSWORD_PATTERN_MISMATCH(CONSTANTS.MESSAGES.PASSWORD_REGEX_MATCH);
  }else if (user && commonFunctions.compareHash(payload.password, user.password)) {
    let jwtPayload = {
      _id: user._id,
      email: user.email
    }
    return {
      accessToken: commonFunctions.encryptJwt(jwtPayload),
      user
    }
  }else {
    throw CONSTANTS.RESPONSE.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.INVALID_CREDENTIALS)
  }
  
}

/**
 * function to logout user
 */

authService.logout = async () => {
  return true;
}

/**
 * function auth validator
 */

authService.authValidator = () => {
  return (request, response, next) => {
    authenticateUser(request).then(done => next())
      .catch((err) => {
        let responseObject = CONSTANTS
          .RESPONSE
          .ERROR
          .UNAUTHORIZED(err);
        return response.status(responseObject.statusCode).json(responseObject);
      });
  };
}

/**
 * function to validate jwt token and fetch its details from the system.
 * @param {} request 
 */
let authenticateUser = async (request) => {
  try {
    let decoded = commonFunctions.decryptJwt(request.headers.authorization);
    let user = await userModel.findById(decoded._id)
    if (!!user) {
      request.user = user;
      return true;
    }
    else {
      throw CONSTANTS.MESSAGES.UNAUTHORIZED;
    }
  } catch (err) {
    throw CONSTANTS.MESSAGES.UNAUTHORIZED;
  }
};

authService.forgotPassword = async (request) => {
  // set getExactRequest: true to get request as parameter
  let payload = request.payload;
  payload.host = request.headers.host;
  let user = await userModel.findOne({ email: request.payload.email });
  if (!user) {
    throw CONSTANTS.RESPONSE.ERROR.DATA_NOT_FOUND(CONSTANTS.MESSAGES.NO_USER_FOUND);
  }
  let resetPasswordToken = commonFunctions.encryptJwt({ _id: user._id, email: user.email });
  let resetPasswordLink = `${CONFIG.DOMAIN.PROTOCOL}://${payload.host}/v1/auth/reset_password_page/${resetPasswordToken}`;
  user.resetPasswordToken = resetPasswordToken;
  await user.save()
  let emailData = commonFunctions.emailTypes(user, CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL, { link: resetPasswordLink });
  let emailContent = commonFunctions.renderTemplate(emailData.template, emailData.data);
  let emailResponse = commonFunctions.sendEmail(user.email, emailData.Subject, emailContent).then(r=>{},console.log);
  return user;
}

authService.isValidResetPasswordLink = async (payload) => {
  try {
    let decoded = commonFunctions.decryptJwt(payload.resetPasswordToken);
    let user = await userModel.findById(decoded._id).lean();
    if (user && user.resetPasswordToken) {
      return true;
    }
    return false;
  } catch (error) {
    return false
  }
}

authService.changePassword = async (payload) => {
  let _id = commonFunctions.decryptJwt(payload.token)._id;
  let updateData = { password: commonFunctions.hashPassword(payload.password), resetPasswordToken:null };
  let user = userModel.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
  return user;
}

module.exports = authService;
