"use strict";

const commonFunctions = require('../../utils/commonFunction');
const CONSTANTS = require("../../utils/constants");
const userModel = require('../../models/userModel')
const authService = require('../../services/authService');
const _ = require('lodash')

/**************************************************
 ***** Auth controller for authentication logic ***
 **************************************************/
let authController = {};

/**
 * function to login user to the system.
 */

 authController.loginUser = async (payload) => {
  let { user, accessToken } = await authService.login(payload);
  user = _.omit(user, ['password', 'createdAt', '__v'])
  return Object.assign(
    CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(CONSTANTS.MESSAGES.LOGGED_IN_SUCCESSFULLY),
    { data: user, accessToken }
  )
};

/**
 * function to register an user to the system.
 */
authController.registerUser = async (payload) => {
  let user = _.omit(await authService.registerUser(payload) || {}, ['password', 'createdAt', '__v'])
  return Object.assign(
    CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(CONSTANTS.MESSAGES.REGISTERED_SUCCESSFULLY),
    { data: user }
  )
};

/**
 * function to log out an user from the system.
 */
authController.logoutUser = async (payload) => {
  await authService.logout()
  return CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(CONSTANTS.MESSAGES.LOGGED_OUT_SUCCESSFULLY);
};

/**
 * send reset password link to email
 */
authController.forgotPassword = async (request) => {
  await authService.forgotPassword(request);
  return CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(CONSTANTS.MESSAGES.RESET_PASSWORD_LINK_SENT);
}

authController.getResetPasswordPage = async (payload) => {
  if (!(await authService.isValidResetPasswordLink(payload))) {
    return Object.assign(
      CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(),
      { filePath: CONSTANTS.PATH_TO_RESET_PASSWORD_LINK_EXPIRED_TEMPLATE }
    );
  }
  return Object.assign(
    CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(),
    { filePath: CONSTANTS.PATH_TO_RESET_PASSWORD_TEMPLATE });
}

authController.changePassword = async (payload) => {
  try {
    await authService.changePassword(payload);
    return CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(CONSTANTS.MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY);
  } catch (err) {
    throw CONSTANTS.RESPONSE.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.UNAUTHORIZED);
  }
}
authController.checkAuthenticated = async (payload) => {
  try {
    let data = _.pick(payload.user,['_id','role']);
    return Object.assign(CONSTANTS.RESPONSE.SUCCESS.MISSCELANEOUSAPI(CONSTANTS.MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY),data);
  } catch (err) {
    throw CONSTANTS.RESPONSE.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.UNAUTHORIZED);
  }
}
/* export authControllers */
module.exports = authController;
