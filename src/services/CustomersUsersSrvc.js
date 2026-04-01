/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var randomNumber = require('random-number');
var moment = require('moment');

const ApiCalls = require('../ApiCalls');
const CommonSrvc = require('../services/CommonSrvc');
const CustomersUsersDao = require('../daos/CustomersUsersDao');
const CustomersUsersDaoImpl = require('../daosimplements/CustomersUsersDaoImpl');
const CustomersUsersSrvcImpl = require('../services/CustomersUsersSrvcImpl');
const CustsUsers = require('../schemas/CustsUsers');
const CustsUsersSsns = require('../schemas/CustsUsrsSsns');
const CustsGsts = require('../schemas/CustsGsts');
const CustsGstsSsns = require('../schemas/CustsGstsSsns');
const CustsUsrsSsnsClsd = require('../schemas/CustsUsrsSsnsClsd');

const SetRes = require('../SetRes');
const config = require('config')
const logger = require('../lib/logger');
const tokens = require('../tokens');
const invalidPswd = 'Invalid Password';
const ot = { login: 'Login', forgot: 'Forgot' };

// ----- Login API Start ----- //
const postCustmerUserLogin = (req, res, next, passport, deviceInfo, callback) => {
  require('../passport')(passport);
  passport.authenticate('inf365-cust-local-login', (resObj) => {
    try {
      if (resObj.status === '200') {
        CustomersUsersSrvcImpl.setCustUsrLoginRes(resObj.resData.result, req.body, deviceInfo, res, callback);
      } else callback(resObj);
    } catch (error) {
      logger.error('Unknown Error in services/CustomersUsersSrvc.js, at postCustmerUserLogin(catch):' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  })(req, res, next);
}
const passportVerifyUserLogin = (urObj, password, callback) => {
  const uResObj = JSON.parse(urObj);
  const vu = CustomersUsersSrvcImpl.validateUserStatus(uResObj);
  if (vu.status === '200') {
    const pswdObj = CommonSrvc.encryptStr(password, uResObj.logPswdLav);
    if (pswdObj.strHash === uResObj.logPswd) {
      const userObj = (!uResObj.refUID.includes('itserve') && uResObj.itServe) ? {...uResObj, userType: 'Regular', itServe: false} : (uResObj.refUID.includes('itserve') && uResObj.itServe ? {...uResObj, discp: config.iPer, showAll: true} : uResObj);
      const ls = SetRes.responseData(userObj);
      callback(ls);
    } else {
      const ic = SetRes.invalidCredentials(invalidPswd);
      callback(ic);
    }
  } else callback(vu);
}

const sendLoginOtp = (req, res, callback) => {
  const query = CustomersUsersDaoImpl.setLoginQuery(req.body);
  const eid = (req.body?.eid >= 0 && req.body?.eid < 26) ? req.body.eid : 25;
  CustomersUsersDao.getUserDataByEid(query, eid, (uResObj) => {
    if (uResObj.status === '200') {
      const vr = CustomersUsersSrvcImpl.validateUserStatus(uResObj.resData.result);
      if (vr.status === '200') {
        callSendOtp(uResObj.resData.result, eid, req.body, res, callback);
      } else callback(vr);
    } else callback(uResObj);
  });
}
const verifyLoginOtp = (req, res, deviceInfo, callback) => {
  const dtData = tokens.custUserTokenDecode(req.headers.inf365otoken);
  if (!dtData.isExpired) {
    const otpTd = dtData.tokenData;
    vrfLoginOtp(otpTd, req.body, deviceInfo, res, callback);
  } else {
    logger.error('Error at services/CustomersUsersSrvc.js - verifyLoginOtp: OTP Token(inf365otoken) expired, try again');
    callback(SetRes.tokenExpired());
  }
}

const postCustmerUserLogout = (reqBody, tokenData, callback) => {
  clearUserSession(tokenData);
  const qry = CustomersUsersDaoImpl.userTknQry(tokenData.iss);
  const pullAuthObjData = CustomersUsersDaoImpl.pullAuthData(tokenData.sk);
  CustomersUsersDao.updateUserDataByEid(qry, reqBody.eid, pullAuthObjData, updRes => {
    updRes = {...updRes, resData: (updRes.status == '200' ? {message: updRes.resData.message, result: 'Logout Success'} : updRes.resData)};
    callback(updRes);
  });
}
// ----- Login API End ----- //

const createCustsGuest = (body, res, deviceInfo, callback) => {
  const createObj = CustomersUsersDaoImpl.custsGuestCreateObj(body);
  const createData = new CustsGsts(createObj);
  CustomersUsersDao.commonCreateFunc(createData, (resObj) => {
    if (resObj.status == '200') {
      const gd = JSON.stringify(resObj.resData.result);
      const gUserObj = JSON.parse(gd);
      ApiCalls.getCurrentLocation(deviceInfo.ip, lres => {
        const csData = CustomersUsersDaoImpl.custGstSsnCreateObj(lres, gUserObj, deviceInfo);
        const custSession = { ...csData, atoken: csData._id };
        const csObj = new CustsGstsSsns(custSession);
        CustomersUsersDao.commonCreateFunc(csObj, (resObj2) => { });
        tokens.custTokenGeneration({...gUserObj, refUID: '', myPrimary: '', itServe: false, userType: 'Guest', discp: config.gPer, showAll: false}, {uc: 0, sk: ''}, res, atoken => {
          if(atoken) {
            const guObj = CustomersUsersDaoImpl.setGuestUsrData(gUserObj);
            callback(SetRes.responseData(guObj));
          } else callback(SetRes.unKnownErr({}));
        });
      });
    } else callback(resObj);
  });
}

const sendCustsGstLoginOtp = (reqBody, res, tData, callback) => {
  const otpNumLimit = { min: 1000, max: 9999, integer: true };
  const otpNum = randomNumber(otpNumLimit).toString();
  const query = CustomersUsersDaoImpl.primaryQry(reqBody);
  CustomersUsersDao.getUserData(query, (resObj) => {
    if (resObj.status == '204') {
      CustomersUsersSrvcImpl.updateGuestUserOtpData(reqBody, tData, otpNum, res, callback);
    } else if (resObj.status == '200') {
      const userObj = resObj.resData.result;
      if (userObj.refUID && userObj.userType == 'Guest') {
        CustomersUsersSrvcImpl.updateUserGuestData(userObj, otpNum, res, callback);
      } else callback(SetRes.primaryExists());
    } else callback(resObj);
  });
}
const custsGstVerifyOtp = (otpNum, otpTd, res, callback) => {
  const query = CustomersUsersDaoImpl.userTknQry(otpTd.iss);
  if (otpTd.uid)
    CustomersUsersDao.getUserData(query, (uResObj) => validateUserVerifyOTP(uResObj, otpNum, otpTd.ot, res, callback));
  else
    CustomersUsersDao.getCustGstData(query, (uResObj) => validateUserVerifyOTP(uResObj, otpNum, otpTd.ot, res, callback));
}

const customerSignUp = (reqBody, otpTd, deviceInfo, res, cb) => {
  if(otpTd.os == 'Verified') {
    const query = CustomersUsersDaoImpl.primaryQry(reqBody);
    CustomersUsersDao.getUserData(query, (userRes) => {
      if (userRes.status == '200') {
        const userData = userRes.resData.result;
        if(userData.userType == 'Guest' && !userData.mpVerifyFlag) {
          const updObj = CustomersUsersDaoImpl.UpdateGuestUserData(reqBody, userData._id);
          CustomersUsersDao.updateUserData(query, updObj, (resObj) => {
            CustomersUsersSrvcImpl.setUserDataByColln(JSON.stringify(resObj.resData.result), reqBody, res, deviceInfo, cb);
          });
        } else cb(SetRes.primaryExists());
      } else if (userRes.status == '204') {
        CustomersUsersDao.getCustGstData(query, (gstRes) => { CustomersUsersSrvcImpl.deleteGuestData(gstRes.resData.result) });
        CustomersUsersSrvcImpl.creatCustomereUser(reqBody, res, deviceInfo, cb);
      } else cb(userRes);
    });
  } else cb(SetRes.tokenInvalid());
}

const loginResetPassword = (reqBody, res, tokenData, callback) => {
  const query = CustomersUsersDaoImpl.userTknQry(tokenData.iss);
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(reqBody.password, salt);
  const uOtpObj = CustomersUsersDaoImpl.setUserPasswordObj(tokenData, otpObj);
  CustomersUsersDao.updateUserData(query, uOtpObj, (uResObj) => {
    if (uResObj.status == '200') {
      CustomersUsersDao.updateUserDataByEid(query, reqBody.eid, uOtpObj, (uResObj1) => {
        const rd = SetRes.responseData('Password update sucessfully');
        callback(rd);
      });
    } else {
      callback(uResObj);
    }
  });
}

const guestUserAcntCreate = (reqBody, tData, deviceInfo, res, callback) => {
  const findQuery = CustomersUsersDaoImpl.primaryQry(reqBody);
  CustomersUsersDao.getUserData(findQuery, (resObj) => {
    if (resObj.status == '200') {
      createUserSession(JSON.stringify(resObj.resData.result), deviceInfo, tData, res, callback);
    } else if(resObj.status == '204') {
      const query = CustomersUsersDaoImpl.guestUserAcntCreate(reqBody);
      const obj = new CustsUsers(query);
      CustomersUsersDao.commonCreateFunc(obj, (resObj1) => {
        if (resObj1.status == '200') {
          CustomersUsersDao.getCustGstData(findQuery, (gstRes) => { CustomersUsersSrvcImpl.deleteGuestData(gstRes.resData.result) });
          createUserSession(JSON.stringify(resObj1.resData.result), deviceInfo, tData, res, callback);
        } else callback(resObj1);
      });
    } else callback(resObj);
  });
}

module.exports = {
  postCustmerUserLogin, passportVerifyUserLogin, sendLoginOtp, verifyLoginOtp, postCustmerUserLogout,
  createCustsGuest, sendCustsGstLoginOtp, custsGstVerifyOtp, customerSignUp, loginResetPassword, guestUserAcntCreate
};

// ----- Login API Start ----- //
const callSendOtp = (uObj, eid, reqBody, res, callback) => {
  const otpNumLimit = { min: 1000, max: 9999, integer: true };
  const otpNum = randomNumber(otpNumLimit).toString();
  const otpType = reqBody?.otpType != ot.forgot ? ot.login : ot.forgot;
  CustomersUsersSrvcImpl.updateUserOtpData(uObj, eid, otpType, otpNum, res, callback);
}
const vrfLoginOtp = (otpTd, reqBody, deviceInfo, res, callback) => {
  const query = CustomersUsersDaoImpl.userTknQry(otpTd.iss);
  const eid = (reqBody?.eid >= 0 && reqBody?.eid < 26) ? reqBody.eid : 25;
  CustomersUsersDao.getUserDataByEid(query, eid, (uResObj) => {
    if (uResObj.status === '200') {
      const vr = CustomersUsersSrvcImpl.validateUserStatus(uResObj.resData.result);
      if (vr.status === '200') {
        CustomersUsersSrvcImpl.verifyLoginOtp(JSON.stringify(uResObj.resData.result), reqBody, deviceInfo, res, callback);
      } else {
        callback(vr);
      }
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  });
}
const clearUserSession = (tokenData) => {
  const ssnQry = CustomersUsersDaoImpl.ssnQry(tokenData.sk);
  CustomersUsersDao.sessionDelete(ssnQry, ssnRes => {
    // const ssnClsData = new CustsUsrsSsnsClsd(ssnRes.resData.result);
    // CustomersUsersDao.commonCreateFunc(ssnClsData, updRes => {});
  });
  if(tokenData.its && tokenData.itt) {
    const ts = moment().add(10, 'minutes').valueOf();
    const dd = tokens.getItServeHmacDigest('delete', ts);
    ApiCalls.itServeLogout(dd, ts, tokenData.itt, (dErr, delRes) => {});
  }
}
// ----- Login API End ----- //

const validateUserVerifyOTP = (urObj, otpNum, otpType, res, callback) => {
  if (urObj.status = '200') {
    const uResObj = urObj.resData.result;
    const otpObj = CommonSrvc.encryptStr(otpNum, uResObj?.otpLav);
    if (uResObj?.otp === otpObj.strHash) {
      const otpToken = tokens.otpTokenGeneration(uResObj, otpType, 'Verified', res);
      if (otpToken) {
        const resData = SetRes.otpVerify('OTP Verified Successfully');
        callback(resData);
      } else callback(SetRes.unKnownErr({}));
    } else callback(SetRes.invalidOtp());
  } else callback(SetRes.noData({}));
}

const createUserSession = (uObj, deviceInfo, tData, res, callback) => {
  let userObj = JSON.parse(uObj);
  userObj = {...userObj, userType: 'Guest', discp: config.gPer, showAll: false};
  tokens.custTokenGeneration(userObj, {uc: 0, sk: ''}, res, atoken => {
    if (atoken) {
      const userData = CustomersUsersDaoImpl.setCustUsrData(userObj);
      const result = SetRes.responseData(userData);
      callback(result);
      ApiCalls.getCurrentLocation(deviceInfo.ip, lres => {
        const usrSsnData = CustomersUsersDaoImpl.setUsrSsnData(userObj, lres, atoken, deviceInfo);
        const usrSSnObj = new CustsUsersSsns(usrSsnData);
        CustomersUsersDao.commonCreateFunc(usrSSnObj, (resObj) => { });
      });
    } else callback(SetRes.unKnownErr({}));
  });
}