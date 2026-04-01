/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const util = require('../lib/util');
const tokens = require('../tokens');
const CustomersUsersCntrlrVldns = require('../controllers/CustomersUsersCntrlrVldns');
const CustomersUsersSrvc = require('../services/CustomersUsersSrvc');
const tVldns = require('./Vldns/TokenVldns');

const apiServerStatus = (req, res) => {
  const resObj = SetRes.apiServerStatus();
  util.sendApiResponse(res, resObj);
}

// ----- Login API Start ----- //
const postCustmerUserLogin = (req, res, next, passport) => {
  const vldRes = CustomersUsersCntrlrVldns.postCustmerUserLoginVldn(req);
  if(vldRes.isTrue) {
    const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
    CustomersUsersSrvc.postCustmerUserLogin(req, res, next, passport, deviceInfo, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const sendLoginOtp = (req, res) => {
  const vldRes = CustomersUsersCntrlrVldns.sendLoginOtp(req);
  if(vldRes.isTrue) {
    CustomersUsersSrvc.sendLoginOtp(req, res, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}
const verifyLoginOtp = (req, res) => {
  const vldRes = CustomersUsersCntrlrVldns.verifyLoginOtpVldn(req);
  if(vldRes.isTrue) {
    const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
    CustomersUsersSrvc.verifyLoginOtp(req, res, deviceInfo, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustmerUserLogout = (req, res) => {
  if(req.headers.inf365atoken && req.body?.eid >= 0) {
    const tData = tokens.custUserTokenDecode(req.headers.inf365atoken);
    if (tData?.tokenData) {
      CustomersUsersSrvc.postCustmerUserLogout(req.body, tData.tokenData, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, SetRes.tokenInvalid());
  } else util.sendApiResponse(res, SetRes.mandatory());
}
// ----- Login API End ----- //

const createCustsGuest = (req, res) => {
  if (req.headers.inf365uiinfo) {
    const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
    CustomersUsersSrvc.createCustsGuest(req.body, res, deviceInfo, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, SetRes.mandatory());
}

const sendCustsGstLoginOtp = (req, res) => {
  const vldRes = CustomersUsersCntrlrVldns.sendCustsGstsLoginOtp(req);
  if (vldRes.isTrue) {
    const tData = tokens.custUserTokenDecode(req.headers.inf365atoken);
    const tknVldn = tVldns.tknVldn(tData);
    if (tknVldn.isTrue) {
      CustomersUsersSrvc.sendCustsGstLoginOtp(req.body, res, tData.tokenData, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, tknVldn.result);
  } else util.sendApiResponse(res, vldRes.result);
}
const custsGstVerifyOtp = (req, res) => {
  const vldRes = CustomersUsersCntrlrVldns.verifyLoginOtpVldn(req);
  if (vldRes.isTrue) {
    const tData = tokens.custUserTokenDecode(req.headers.inf365otoken);
    const tknVldn = tVldns.tknVldn(tData);
    if (tknVldn.isTrue) {
      CustomersUsersSrvc.custsGstVerifyOtp(req.body.otpNum, tData.tokenData, res, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, tknVldn.result);
  } else util.sendApiResponse(res, vldRes.result);
}
const customerSignUp = (req, res) => {
  const vldRes = CustomersUsersCntrlrVldns.custSignUpVldn(req);
  if(vldRes.isTrue) {
    const tData = tokens.custUserTokenDecode(req.headers.inf365otoken);
    const tknVldn = tVldns.tknVldn(tData);
    if (tknVldn.isTrue) {
      const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
      CustomersUsersSrvc.customerSignUp(req.body, tData.tokenData, deviceInfo, res, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, tknVldn.result);
  } else util.sendApiResponse(res, vldRes.result);
}

const custsCustLoginResetPassword = (req, res) => {
  const vldRes = CustomersUsersCntrlrVldns.postCustmerUserLoginVldn(req);
  if (vldRes.isTrue) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        CustomersUsersSrvc.loginResetPassword(req.body, res, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else util.sendApiResponse(res, tknVldn.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const guestUserAcntCreate = (req, res, next) => {
  const vldRes = CustomersUsersCntrlrVldns.guestUserAcntCreate(req);
  if (vldRes.isTrue) {
    const tData = tokens.custUserTokenDecode(req.headers.inf365atoken);
    const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
    const tknVldn = tVldns.tknVldn(tData);
    if (tknVldn.isTrue) {
      CustomersUsersSrvc.guestUserAcntCreate(req.body, tData.tokenData, deviceInfo, res, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, tknVldn.result);
  } else util.sendApiResponse(res, vldRes.result);
}

module.exports = {
  apiServerStatus, postCustmerUserLogin, sendLoginOtp, verifyLoginOtp, postCustmerUserLogout,
  createCustsGuest, sendCustsGstLoginOtp, custsGstVerifyOtp, customerSignUp,
  custsCustLoginResetPassword, guestUserAcntCreate
};
