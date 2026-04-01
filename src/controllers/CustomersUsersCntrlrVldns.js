/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

// ----- Login API Start ----- //
const postCustmerUserLoginVldn = (req) => {
  const reqBody = req.body;
  if (!reqBody.password || !reqBody.usrID || !(reqBody?.eid >= 0) || !req.headers.inf365uiinfo) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}

const sendLoginOtp = (req) => {
  if (!req.body.usrID || !(req.body?.eid >= 0)) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}
const verifyLoginOtpVldn = (req) => {
  if (!req.body.otpNum || !(req.body?.eid >= 0) || !req.headers.inf365uiinfo) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else if (!req.headers.inf365otoken) {
    const mf = SetRes.tokenRequired();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}
// ----- Login API End ----- //

const sendCustsGstsLoginOtp = (req) => {
  const reqBody = req.body;
  if (!req.headers.inf365atoken) {
    const mf = SetRes.tokenRequired();
    return { isTrue: false, result: mf };
  } else if (!reqBody.fName || !reqBody.lName || !reqBody.emID) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}

const custSignUpVldn = (req) => {
  const reqBody = req.body
  if (!reqBody.fName || !reqBody.lName || !reqBody.country || !reqBody.countryCode || !reqBody.mobileCode || !reqBody.mobileNumber || !reqBody.mobileCcNumber || !reqBody.emID || !(reqBody?.eid >= 0) || !req.headers.inf365uiinfo) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else if (!req.headers.inf365otoken) {
    const mf = SetRes.tokenRequired();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}

const guestUserAcntCreate = (req) => {
  const reqBody = req.body;
  if (!req.headers.inf365atoken) {
    const te = SetRes.tokenRequired();
    return { isTrue: false, result: te };
  } else if (!reqBody.fName || !reqBody.lName  || !reqBody.country || !reqBody.countryCode || !reqBody.mobileCode || !reqBody.mobileNumber || !reqBody.mobileCcNumber || !reqBody.emID || !req.headers.inf365uiinfo) {
    const ad = SetRes.mandatory();
    return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

module.exports = {
  postCustmerUserLoginVldn, sendLoginOtp, verifyLoginOtpVldn,
  sendCustsGstsLoginOtp, custSignUpVldn, guestUserAcntCreate
};
