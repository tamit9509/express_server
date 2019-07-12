'use strict';

const swaggerUI = require('swagger-ui-express');
const swJson = require('../services/swaggerService');
const Joi = require('joi');
let path = require('path')

const CONFIG = require('../config');
const CONSTANTS = require('../utils/constants');
const commonFunctions = require('../utils/commonFunction');

const authService = require('../services/authService');

let routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.route = async (app, routes = []) => {
  routes.forEach(route => {
    let middlewares = [getValidatorMiddleware(route)];
    if (route.auth === CONSTANTS.AVAILABLE_AUTHS.USER) {
      middlewares.push(authService.authValidator());
    }
    app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
  });
  createSwaggerUIForRoutes(app, routes);
};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route 
 */
let joiValidatorMethod = async (request, route) => {
  if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
    request.params = await Joi.validate(request.params, route.joiSchemaForSwagger.params);
  }
  if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
    request.body = await Joi.validate(request.body, route.joiSchemaForSwagger.body);
  }
  if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
    request.query = await Joi.validate(request.query, route.joiSchemaForSwagger.query);
  }
  if (route.joiSchemaForSwagger.headers && Object.keys(route.joiSchemaForSwagger.headers).length) {
    let headersObject = await Joi.validate(request.headers, route.joiSchemaForSwagger.headers);
    request.headers.authorization = headersObject.authorization;
  }
};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route 
 */
let getValidatorMiddleware = (route) => {
  return (request, response, next) => {
    joiValidatorMethod(request, route).then((result) => {
      return next();
    }).catch((err) => {
      let error = commonFunctions.convertErrorIntoReadableForm(err);
      let responseObject = CONSTANTS.RESPONSE.ERROR.BAD_REQUEST(error.message.toString());
      return response.status(responseObject.statusCode).json(responseObject);
    });
  };
}

/**
 * middleware
 * @param {*} handler 
 */
let getHandlerMethod = (route) => {
  let handler = route.handler
  return (request, response) => {
    let payload = {
      ...(request.body || {}),
      ...(request.params || {}),
      ...(request.query || {}),
      user: (request.user ? request.user : {}),
    };
    //request handler/controller
    if (route.getExactRequest) {
      request.payload = payload;
      payload = request
    }
    handler(payload)
      .then((result) => {
        if(result.filePath){
          let filePath = path.resolve(__dirname+'/../'+result.filePath)
          return response.status(result.statusCode).sendFile(filePath)
        }
        response.status(result.statusCode).json(result);
      })
      .catch((err) => {
        console.log('Error is ', err);
        if (!err.statusCode && !err.status) {
          err = CONSTANTS.RESPONSE.ERROR.INTERNAL_SERVER_ERROR(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
        }
        response.status(err.statusCode).json(err);
      });
  };
};

/**
 * function to create Swagger UI for the available routes of the application.
 * @param {*} app Express instance.
 * @param {*} routes Available routes.
 */
let createSwaggerUIForRoutes = (app, routes = []) => {
  const swaggerInfo = CONFIG.SWAGGER.info;

  swJson.swaggerDoc.createJsonDoc(swaggerInfo);
  routes.forEach(route => {
    swJson.swaggerDoc.addNewRoute(route.joiSchemaForSwagger, route.path, route.method.toLowerCase());
  });

  const swaggerDocument = require('../swagger.json');
  app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};

module.exports = routeUtils;
