'use strict';

const Joi = require('joi');
const CONSTANTS = require('../../utils/constants');
const commonFunctions = require('../../utils/commonFunction');

//load controllers
const authController = require('../../controllers/v1/authController');

let routes = [
	{
		method: 'POST',
		path: '/v1/auth/register',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('Your username.'),
				password: Joi.string().required().description('Your password.'),
			},
			group: 'Auth',
			description: 'Route to register an user to the system.',
			model: 'Register'
		},
		handler: authController.registerUser
	},
	{
		method: 'POST',
		path: '/v1/auth/login',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('Your username.'),
				password: Joi.string().min(6).required().description('Your password.'),
			},
			group: 'Auth',
			description: 'Route to login an user to the system.',
			model: 'Login'
		},
		handler: authController.loginUser
	},
	// {
	// 	method: 'POST',
	// 	path: '/v1/auth/logout',
	// 	joiSchemaForSwagger: {
	// 		headers: Joi.object({
	// 			'authorization': Joi.string().required().description('Your\'s JWT token.')
	// 		}).unknown(),
	// 		body: {
	// 		},
	// 		group: 'Auth',
	// 		description: 'Route to logout an user from the system.',
	// 		model: 'Logout'
	// 	},
	// 	auth: CONSTANTS.AVAILABLE_AUTHS.USER,
	// 	handler: authController.logoutUser
	// },
	{
		method: 'POST',
		path: '/v1/auth/forgot_password',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('email Id of registered user')
			},
			group: 'Auth',
			description: 'Route for forget password for an user.',
			model: 'ForgotPassword'
		},
		auth: false,
		getExactRequest: true,
		handler: authController.forgotPassword
	},
	{
		method: 'GET',
		path: '/v1/auth/reset_password_page/:resetPasswordToken',
		joiSchemaForSwagger: {
			params: {
				resetPasswordToken: Joi.string().required().description('reset password token'),
			},
			group: 'Auth',
			description: 'Route for reset password token.',
			model: 'ResetPasswordPage'
		},
		auth: false,
		handler: authController.getResetPasswordPage
	},
	{
		method: 'POST',
		path: '/v1/auth/change_password',
		joiSchemaForSwagger: {
			body: {
				token: Joi.string().required(),
				password: Joi.string().required()
			},
			group: 'Auth',
			description: 'Route for change password for an user.',
			model: 'ChangePassword'
		},
		auth: false,
		handler: authController.changePassword
	},
	// {
	// 	method: 'POST',
	// 	path: '/v1/auth/check_authenticated',
	// 	joiSchemaForSwagger: {
	// 		headers: Joi.object({
	// 			'authorization': Joi.string().required().description('Your\'s JWT token.')
	// 		}).unknown(),
	// 		group: 'Auth',
	// 		description: 'Route to check authentication for an user.',
	// 		model: 'check if authenticated'
	// 	},
	// 	auth: CONSTANTS.AVAILABLE_AUTHS.USER,
	// 	handler: authController.checkAuthenticated
	// }
]

module.exports = routes;
