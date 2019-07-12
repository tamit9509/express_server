"use strict";
/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const CONSTANTS = require('../utils/constants');
const commonFunctions = require('../utils/commonFunction')
/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: Number, enum: commonFunctions.getEnumArray(CONSTANTS.USER_ROLES) },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: {type : String},
});

// pre-hook to validate reference ids are valid or not.
userSchema.pre('save', async function (next) {
    console.log('user save pre hook')
    next();
});

module.exports = MONGOOSE.model('user', userSchema);



