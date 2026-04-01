/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var jwt = require('jsonwebtoken');
var moment = require('moment');

'use strict';
var crypto = require('crypto');

const ApiCalls = require('./ApiCalls');
const cuspSrv = require('./services/CustsUsersProfileSrvc');

var logger = require('./lib/logger');

const ENCRYPTION_KEY = config.criptoEncryptKey; // process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// const decodeApiKey = (apiKey) => {
//   const voStr = decrypt(apiKey, ENCRYPTION_KEY);
//   const vndrObj = voStr ? JSON.parse(voStr) : {};
//   return vndrObj;
// }

// --- Begin: custTokenGeneration: Token Generation Code
const custTokenGeneration = (usrObj, usrTkn, res, callback) => {
  try {
    const ite = moment().add(config.itServeSessionExpire, config.itServeSessionExpireType).valueOf();
    const exp = moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf();
    const sep = moment().add(5, 'minutes').valueOf();
    const payload = {
      iss: usrObj._id,
      uc: usrTkn.uc,
      sk: usrTkn.sk,
      uid: usrObj.refUID,
      mp: usrObj.myPrimary,
      pn: usrObj.pName || '',
      fn: usrObj.fName,
      ln: usrObj.lName,
      mn: usrObj.mobCcNum || '',
      eid: usrObj.emID || '',
      its: usrObj.itServe,
      itt: usrObj.itsToken || '',
      ut: usrObj.userType || 'Guest',
      dp: usrObj.discp || config.gPer,
      sa: usrObj.showAll,
      sep, exp, ite
    };

    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken, ENCRYPTION_KEY);
    res.header('inf365atoken', token);
    callback(token);
  } catch(error) {
    logger.error('src/tokens.js - custTokenGeneration: Un-Known Error: ' + error);
    callback(null);
  }
}
// --- End: custTokenGeneration: Token Generation Code

/**
 * Begin: custUserRefreshToken
 * @param {string} reqToken string
 * @param {object} res
 * @return {function} callback function
 */
const custUserRefreshToken = (reqToken, res, callback) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken, ENCRYPTION_KEY);
    const tokenData = jwt.verify(jwtToken, config.jwtSecretKey);
    const exp = moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf();
    if(tokenData.exp >= currentDtNum) {
      if (!tokenData.its || (tokenData.its && tokenData.ite >= currentDtNum)) {
        if(tokenData.ut == 'Guest' || tokenData.sep >= currentDtNum) {
          const payload = setTokenPayload(tokenData, {ite: tokenData.ite, sep: tokenData.sep, exp});

          const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
          const token = encrypt(jwtNewToken, ENCRYPTION_KEY);
          res.header('inf365atoken', token);
          callback({tokenData, isExpired: false, inf365atoken: token});
        } else {
          getUserSsnData(tokenData, exp, (token) => {
            const newToken = token !== 'error' ? token : reqToken;
            const newTokenData = token !== 'error' ? tokenData : null;
            res.header('inf365atoken', newToken);
            callback({tokenData: newTokenData, isExpired: false, inf365atoken: newToken});
          });
        }
      } else {
        getItserveSnapShot(tokenData, exp, currentDtNum, (token) => {
          const newToken = token !== 'error' ? token : reqToken;
          const newTokenData = token !== 'error' ? tokenData : null;
          res.header('inf365atoken', newToken);
          callback({tokenData: newTokenData, isExpired: false, inf365atoken: newToken});
        });
      }
    } else {
      res.header('inf365atoken', reqToken);
      callback({tokenData, isExpired: true, inf365atoken: reqToken});
    }
  } catch(error) {
    logger.error('src/tokens.js - custUserRefreshToken: Un-Known Error: ' + error);
    res.header('inf365atoken', reqToken);
    callback(null);
  }
}
// --- End: custUserRefreshToken

// --- Begin: custUserTokenDecode
const custUserTokenDecode = (reqToken) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken, ENCRYPTION_KEY);
    const tokenData = jwt.decode(jwtToken, config.jwtSecretKey);
    if(tokenData.exp >= currentDtNum) {
      return {tokenData, isExpired: false};
    } else {
      return {tokenData, isExpired: true};
    }
  } catch(error) {
    logger.error('src/tokens.js - custUserTokenDecode: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: custUserTokenDecode

const otpTokenGeneration = (usrObj, otpType, otpStatus, res) => {
  try {
    const exp = moment().add(config.otpSessionExpire, config.otpSessionExpireType).valueOf();
    const payload = {
      iss: usrObj._id,
      uid: usrObj.refUID || '',
      mp: usrObj.myPrimary,
      pn: usrObj.pName || '',
      fn: usrObj.fName,
      ln: usrObj.lName,
      mn: usrObj.mobCcNum || '',
      eid: usrObj.emID || '',
      ot: otpType,
      os: otpStatus, exp
    };

    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken, ENCRYPTION_KEY);
    res.header('inf365otoken', token);
    return token;
  } catch(error) {
    logger.error('src/tokens.js - otpTokenGeneration: Un-Known Error: ' + error);
    return null;
  }
}

// --- Begin: accessTokenValidation
const accessTokenValidation = (reqToken, res, tokenType, callback) => {
  try {
    if(reqToken) {
      const tokenObj = custUserRefreshToken(reqToken, res, tokenType);
      if (tokenObj && !tokenObj.isExpired) {
        callback({httpStatus: 200, status: '200', tokenData: tokenObj.tokenData});
      } else if (tokenObj && tokenObj.isExpired) {
        logger.error('src/tokens.js - accessTokenValidation: Error: Access token has been expired');
        callback({httpStatus: 400, status: '190', tokenData: {}});
      } else {
        logger.error('src/tokens.js - accessTokenValidation: Error: Access token decode failed');
        callback({httpStatus: 400, status: '191', tokenData: {}});
      }
    } else {
      logger.error('src/tokens.js - accessTokenValidation: Error: Access token is required');
      callback({httpStatus: 400, status: '192', tokenData: {}});
    }
  } catch(error) {
    logger.error('src/tokens.js - accessTokenValidation: Un-Known Error: ' + error);
    callback({httpStatus: 500, status: '199', tokenData: {}});
  }
}
// --- End: accessTokenValidation

/**
 * @param {string} text string
 * @param {string} encryptKey string
 * @return {string}
 */
const encrypt = (text, encryptKey) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * @param {string} text string
 * @param {string} decryptKey string
 * @return {string}
 */
const decrypt = (text, decryptKey) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(decryptKey), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

/**
 * @param {string} dStr string
 * @param {string} scretKey string
 * @return {string}
 */
const getItServeHmacDigest = (method, ts) => {
  try {
    const apim = method.toUpperCase();
    const dStr = apim + config.itsPublicKey + config.itsVersion + ts;

    const dHash = generateHmacDigest(dStr, config.itsPrivateKey);
    return dHash;
  } catch (err) {
    logger.error('src/tokens.js - getItServeHmacDigest: Un-Known Error: ' + err);
    return null;
  }
}

module.exports = {
  /* decodeApiKey,*/ custTokenGeneration, custUserRefreshToken,
  custUserTokenDecode, accessTokenValidation, otpTokenGeneration,
  decrypt, encrypt, getItServeHmacDigest
}

const generateHmacDigest = (dStr, scretKey) => {
  const hash = crypto.createHmac('sha256', scretKey).update(dStr).digest('hex');
  return hash;
}

const getItserveSnapShot = (tokenData, exp, currentDtNum, callback) => {
  const ite = moment().add(config.itServeSessionExpire, config.itServeSessionExpireType).valueOf();
  const ts = moment().add(10, 'minutes').valueOf();
  const gd = getItServeHmacDigest('get', ts);
  ApiCalls.getItserveData(gd, ts, tokenData.itt, (err, resObj) => {
    if (resObj?.data?.value?.user?.verified) {
      if(tokenData.sep >= currentDtNum) {
        const payload = setTokenPayload(tokenData, {ite, sep: tokenData.sep, exp});

        const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
        const token = encrypt(jwtNewToken, ENCRYPTION_KEY);
        callback(token);
      } else {
        const payload = setTokenPayload(tokenData, {ite, sep: tokenData.sep, exp});
        getUserSsnData(payload, exp, (token) => {
          callback(token);
        });
      }
    } else {
      logger.error('src/tokens.js - getItserveSnapShot: ' + err);
      callback('NA');  
    }
  });
}

const getUserSsnData = (tokenData, exp, callback) => {
  const sep = moment().add(5, 'minutes').valueOf();
  cuspSrv.custsCustUserSsn(tokenData, (resObj) => {
    if (resObj.status == '200') {
      const usrTknData = resObj.resData.result;
      const payload = setTokenPayload(usrTknData, {ite: tokenData.ite, sep, exp});

      const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
      const token = encrypt(jwtNewToken, ENCRYPTION_KEY);
      callback(token);
    } else if(resObj.status == '204') {
      callback('NA');
    } else {
      logger.error('src/tokens.js - getUserSsnData: ' + JSON.stringify(resObj));
      callback('error');
    }
  });
}

const setTokenPayload = (tokenData, newData) => {
  const payload = {
    iss: tokenData.iss,
    uc: tokenData.uc,
    sk: tokenData.sk,
    uid: tokenData.uid,
    mp: tokenData.mp,
    pn: tokenData.pn,
    fn: tokenData.fn,
    ln: tokenData.ln,
    mn: tokenData.mn,
    eid: tokenData.eid,
    its: tokenData.its,
    itt: tokenData.itt,
    ut: tokenData.ut,
    dp: tokenData.dp,
    sa: tokenData.sa,
    ...newData
  };
  return payload;
}