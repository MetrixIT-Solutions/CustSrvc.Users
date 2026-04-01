/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var moment = require('moment');

'use strict';
var crypto = require('crypto');

const logger = require('../lib/logger');

/**
 * Begin genSalt: Code to Generate Salt.
 * @param {Number} length, length of salt.
 * @param {function} callback is a callback function.
 */
const genSalt = (length) => {
  try {
    return (crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0, length)); // return required number of characters
  } catch(error) {
    logger.error('Un-Known Error in services/CommonSrvc.js, at genSalt:' + error);
    return config.mySalt;
  }
}
// --- End genSalt: Salt Generation Code.

/**
 * Begin encryptStr: String Encryption Code.
 * @param {String} gStr, Given String.
 * @param {String} salt to encryption.
 * @param {function} callback, is a callback function
 */
const encryptStr = (gStr, salt) => {
  try {
    var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512
    hash.update(gStr);
    var strHash = hash.digest('hex');
    return {salt, strHash};
  } catch(error) {
    logger.error('Un-Known Error in services/CommonSrvc.js, at encryptStr:' + error);
    return {salt, strHash: ''};
  }
}
// --- End encryptStr: Pasword Encryption Code.

const currUTCObj = () => {
  const utcMoment = moment.utc();
  const currUTCDtTmStr = utcMoment.format('YYYY-MM-DD HH:mm:ss');
  const currUTCDtTmNum = moment(currUTCDtTmStr, 'YYYY-MM-DD HH:mm:ss').valueOf();
  const currUTCDtTm = new Date(currUTCDtTmStr);
  const currUTCYear = utcMoment.year();
  const currUTCDayOfYear = utcMoment.dayOfYear();
  return {currUTCDtTmStr, currUTCDtTmNum, currUTCDtTm,currUTCYear, currUTCDayOfYear};
}

const currUTC = (type) => {
  const utcMoment = moment.utc();
  const currUTCDtTmStr = utcMoment.format('YYYY-MM-DD HH:mm:ss');
  switch(type) {
    case 'Num':
      const currUTCDtTmNum = moment(currUTCDtTmStr, 'YYYY-MM-DD HH:mm:ss').valueOf();
      return currUTCDtTmNum;
    case 'DtTm':
      const currUTCDtTm = new Date(currUTCDtTmStr);
      return currUTCDtTm;
    default:
      return currUTCDtTmStr;
  }
}

const isJsonEmpty = (obj) => {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

// --- Delete Folder === //
const dltFolder = (filesPath) => {
  if (filesPath && filesPath.length > 0) {
    var folder = filesPath[0].destination || '';
    rimraf(folder, function () { });
  }
}

// --- Random String Generation --- //
const randomStrGen = (str, size) => {
  var result = '';
  for (let i = size; i > 0; --i) result += str[Math.floor(Math.random() * str.length)];
  return result;
};

module.exports = {
  genSalt, encryptStr,
  currUTCObj, currUTC,
  isJsonEmpty, dltFolder,
  randomStrGen
}
