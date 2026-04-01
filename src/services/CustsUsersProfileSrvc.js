/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
var randomNumber = require('random-number');

const CommonSrvc = require('../services/CommonSrvc');
const cupDaoImpl = require('../daosimplements/CustsUsersProfileDaoImpl');
const cuDao = require('../daos/CustomersUsersDao');
const cupSrvcImpl = require('../services/CustsUsersProfileSrvcImpl');
const CustCards = require('../schemas/CustsUsrsCards');
const SetRes = require('../SetRes');
const tokens = require('../tokens');
const logger = require('../lib/logger');

const custsUserProfileUpdate = (reqBody, tData, callback) => {
  const po = cupDaoImpl.setProfileUpdateObj(reqBody, tData);
  cuDao.updateUserDataByEid(po.query, tData.uc, po.updObj, resObj => {
    if (resObj.status == '200') {
      cuDao.updateUserData(po.query, po.updObj, resObj1 => {
        const uObj = cupDaoImpl.setCustUsrData(resObj.resData.result);
        const ls = SetRes.responseData(uObj);
        callback(ls);
      });
    } else {
      callback(resObj);
    }
  });
}

const updateProfileBackgroundPic = (fileLoc, piActualName, pIcon, dtData, callback) => {
  const piPath = config.apiDomain + fileLoc;
  const pObj = cupDaoImpl.profilePic(piPath, piActualName, pIcon, dtData);
  cuDao.updateUserDataByEid(pObj.query, dtData.uc, pObj.updateObj, (upResObj) => {
    if(upResObj.status == '200') {
      cuDao.updateUserData(pObj.query, pObj.updateObj, (upResObj1) => {
        const uResObj = upResObj.resData.result;
        const uObj = cupDaoImpl.setCustUsrData(uResObj);
        const ls = SetRes.responseData(uObj);
        callback(ls);
      });
    } else {
      callback(upResObj);
    }
  });
}

const deleteProfileBackgroundPic = (dtData, callback) => {
  const pObj = cupDaoImpl.profilePic('', '', '', dtData.tokenData);
  cuDao.updateUserDataByEid(pObj.query, dtData.tokenData.uc, pObj.updateObj, (upResObj) => {
    if(upResObj.status == '200') {
      cuDao.updateUserData(pObj.query, pObj.updateObj, (upResObj1) => {
        const uResObj = upResObj.resData.result;
        const uObj = cupDaoImpl.setCustUsrData(uResObj);
        const ls = SetRes.responseData(uObj);
        callback(ls);
      });
    } else {
      callback(upResObj);
    }
  });
}

const custCardCreate = (reqBody, tData, callback) => {
  const cardData = cupDaoImpl.setUserCardData(reqBody, tData);
  const data = new CustCards(cardData);
  cuDao.commonCreateFunc(data, resObj => {callback(resObj)});
}

const custUserPwsdChange = (reqBody, tData, callback) => {
  const query = cupDaoImpl.getCustUserData(tData);
  cuDao.getUserDataByEid(query, tData.uc, (resObj) => {
    if (resObj.status == '200') {
      const pswdObj = CommonSrvc.encryptStr(reqBody.currPassword, resObj.resData.result?.logPswdLav);
      if (pswdObj.strHash === resObj.resData.result?.logPswd) {
        const salt = CommonSrvc.genSalt(config.mySaltLen);
        const passObj = CommonSrvc.encryptStr(reqBody.password, salt);
        const updateObj = cupDaoImpl.updatePassword( tData, passObj);
        cuDao.updateUserDataByEid(query, tData.uc, updateObj, callback);
        cuDao.updateUserData(query, updateObj, resObj => {});
      } else {
        const ls = SetRes.errorMsg();
        callback(ls);
      }
    } else {
      const dt = SetRes.noData({});
      callback(dt)
    }
  });
}

const custUserLoginUserId = (tdata, callback) => {
  const query = cupDaoImpl.getCustUserData(tdata);
  cuDao.getUserDataByEid(query, tdata.uc, callback);
}

const custsCustUsrPrmrySOTP = (reqBody, tData, res, callback) => {
  const otpNumLimit = { min: 1000, max: 9999, integer: true };
  const otpNum = randomNumber(otpNumLimit).toString();
  cupSrvcImpl.userLoginOtpUpdate(reqBody, otpNum, res, tData, callback);
}

const loginOtpVerify = (req, res, tData, callback) => {
  const dtData = tokens.custUserTokenDecode(req.headers.inf365otoken);
  if (!dtData.isExpired) {
    const otpTd = dtData.tokenData;
    vrfUpdateLoginOtp(otpTd, req.body, res, tData, callback);
  } else {
    logger.error('Error at services/CustomersUsersSrvc.js - verifyLoginOtp: OTP Token(inf365otoken) expired, try again');
    callback(SetRes.otpTokenExpired());
  }
}

const custsCustUserSsn = (tokenData, callback) => {
  const qry = cupDaoImpl.ssnQry(tokenData);
  cuDao.getUserDataByEid(qry, tokenData.uc, (resObj) => {
    if (resObj.status == '200') {
      const resData = resObj.resData.result;
      const uObj = {
        iss: resData._id,
        sk: tokenData.sk,
        uc: resData.uec,
        uid: resData.refUID,
        mp: resData.myPrimary,
        pn: resData.pName,
        fn: resData.fName,
        ln: resData.lName,
        mn: resData.mobCcNum,
        eid: resData.emID,
        its: tokenData.its,
        itt: resData.itsToken,
        ut: tokenData.ut,
        dp: tokenData.its ? config.iPer : resData.discp,
        sa: tokenData.its ? true : resData.showAll
      };
      const ls = SetRes.responseData(uObj);
      callback(ls);
    } else {
      callback(resObj);
    }
  });
}

module.exports = {
  custsUserProfileUpdate, updateProfileBackgroundPic, deleteProfileBackgroundPic, custCardCreate, custUserPwsdChange, custUserLoginUserId,
  custsCustUsrPrmrySOTP, loginOtpVerify, custsCustUserSsn
};

const vrfUpdateLoginOtp = (otpTd, reqBody, res, tData, callback) => {
  const query = cupDaoImpl.getCustUserData(otpTd);
  cuDao.getUserDataByEid(query, tData.uc, (uResObj) => {
    if (uResObj.status = '200') {
      const otpObj = CommonSrvc.encryptStr(reqBody.otpNum, uResObj?.resData.result?.otpLav);
      if (uResObj?.resData.result?.otp === otpObj.strHash) {
        cupSrvcImpl.usrPrimaryUpdate(query, reqBody, tData,  res, callback);
      } else {
        const invOtp = SetRes.invalidOtp();
        callback(invOtp);
      }
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  });
}