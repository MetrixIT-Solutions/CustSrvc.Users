/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');

const CustsUsersAm = require('../schemas/CustsUsersAm');
const CustsUsersAz = require('../schemas/CustsUsersAz');
const CustsUsersBm = require('../schemas/CustsUsersBm');
const CustsUsersBz = require('../schemas/CustsUsersBz');
const CustsUsersC = require('../schemas/CustsUsersC');
const CustsUsersD = require('../schemas/CustsUsersD');
const CustsUsersE = require('../schemas/CustsUsersE');
const CustsUsersF = require('../schemas/CustsUsersF');
const CustsUsersG = require('../schemas/CustsUsersG');
const CustsUsersH = require('../schemas/CustsUsersH');
const CustsUsersJm = require('../schemas/CustsUsersJm');
const CustsUsersJz = require('../schemas/CustsUsersJz');
const CustsUsersKm = require('../schemas/CustsUsersKm');
const CustsUsersKz = require('../schemas/CustsUsersKz');
const CustsUsersL = require('../schemas/CustsUsersL');
const CustsUsersMm = require('../schemas/CustsUsersMm');
const CustsUsersMz = require('../schemas/CustsUsersMz');
const CustsUsersNo = require('../schemas/CustsUsersNo');
const CustsUsersP = require('../schemas/CustsUsersP');
const CustsUsersR = require('../schemas/CustsUsersR');
const CustsUsersSm = require('../schemas/CustsUsersSm');
const CustsUsersSz = require('../schemas/CustsUsersSz');
const CustsUsersT = require('../schemas/CustsUsersT');
const CustsUsersW = require('../schemas/CustsUsersW');
const CustsUsersIquvxyz = require('../schemas/CustsUsersIquvxyz');
const CustsUsersNum = require('../schemas/CustsUsersNum');
const CommonSrvc = require('../services/CommonSrvc');
const cuDao = require('../daos/CustomersUsersDao');
const cupDaoImpl = require('../daosimplements/CustsUsersProfileDaoImpl');
const sendMail = require('../../config/mail');
const tokens = require('../tokens');
const logger = require('../lib/logger');
const SetRes = require('../SetRes');

const mailSub = 'IndiFly365 Login OTP';
const mailMsg00 = '<h3>Welcome to IndiFly365.</h3>';
const mailMsg01 = ' is the OTP for login into the application.'
const mailMsg02 = ' <p>OTP is valid for 10 mins. Do not share it with any one.</p> <h4> Do not reply, this is a system generated mail</h4>';

const userLoginOtpUpdate = (reqBody, otpNum, res, tData, callback) => {
  const query = cupDaoImpl.getCustUserData(tData);
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  const uOtpObj = cupDaoImpl.setUserOtpObj({_id: tData.iss, pName: tData.pn}, otpObj);
  cuDao.updateUserDataByEid(query, tData.uc, uOtpObj.updateObj, (uResObj) => {
    if (uResObj.status == '200') {
      const otpToken = tokens.otpTokenGeneration(uResObj.resData.result, 'Login', 'Not Verified', res);
      if (otpToken) {
        sendOtpToEmail(reqBody.usrID, otpNum);
        // console.log(reqBody.usrID, '===Login otpNumber:', otpNum);
        logger.error(reqBody.usrID, '===Login otpNumber:', otpNum);
        const resObj = SetRes.otpSentSuc();
        callback(resObj);
      } else {
        const uke = SetRes.unKnownErr({});
        callback(uke);
      }
    } else {
      callback(uResObj);
    }
  });
}
  
const sendOtpToEmail = (email, otpNumber) => {
  sendMail.sendEMail(email, mailSub, `${mailMsg00}${'<p>' + otpNumber}${mailMsg01}${mailMsg02}`, (resObj) => { });
}

const usrPrimaryUpdate = (query, reqBody, tData, res, callback) => {
  const uOtpObj = cupDaoImpl.setUserPrimary(reqBody, tData);
  cuDao.updateUserData(query, uOtpObj, (uResObj) => {
    if (uResObj.status == '200') {
      if (tData.uc == reqBody.eid) {
        cuDao.updateUserDataByEid(query, tData.uc, uOtpObj, (uResObj) => {
          const ucSk = {uc: tData.uc, sk: tData.sk};
          tokens.custTokenGeneration(uResObj.resData.result, ucSk, res, token => {
            if (token) {
              const uObj = cupDaoImpl.setCustUsrData(uResObj.resData.result);
              const otpVerfy = SetRes.otpVerify(uObj);
              callback(otpVerfy);
            } else {
              const invOtp = SetRes.invalidOtp();
              callback(invOtp);
            }
          });
        });
      } else {
        cuDao.deleteUser(query, tData.uc, (delRes) => {
          const eidArr = [CustsUsersAm, CustsUsersAz, CustsUsersBm, CustsUsersBz, CustsUsersC, CustsUsersD, CustsUsersE, CustsUsersF, CustsUsersG, CustsUsersH, CustsUsersJm, CustsUsersJz, CustsUsersKm, CustsUsersKz, CustsUsersL, CustsUsersMm, CustsUsersMz, CustsUsersNo, CustsUsersP, CustsUsersR, CustsUsersSm, CustsUsersSz, CustsUsersT, CustsUsersW, CustsUsersIquvxyz, CustsUsersNum ];
          const crtObj = cupDaoImpl.createUserData(uResObj.resData.result, reqBody.eid);
          const data = new eidArr[reqBody.eid](crtObj);
          cuDao.commonCreateFunc(data, resObj => {
            if (resObj.status == '200') {
              const ucSk = {uc: reqBody.eid, sk: tData.sk};
              tokens.custTokenGeneration(uResObj.resData.result, ucSk, res, token => {
                if (token) {
                  const uObj = cupDaoImpl.setCustUsrData(uResObj.resData.result);
                  const otpVerfy = SetRes.otpVerify(uObj);
                  callback(otpVerfy);
                } else {
                  const invOtp = SetRes.invalidOtp();
                  callback(invOtp);
                }
              });
            } else {
              const uf = SetRes.updateFailed();
              callback(uf);
            }
          });
        });
      }
    } else {
      const invOtp = SetRes.invalidOtp();
      callback(invOtp);
    }
  });
}

module.exports = {
  userLoginOtpUpdate, usrPrimaryUpdate
}