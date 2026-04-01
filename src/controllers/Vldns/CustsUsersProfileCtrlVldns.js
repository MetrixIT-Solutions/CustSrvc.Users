/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../../SetRes');

const custsUserProfileUpdateVldns = (req) => {
  const reqBody = req.body;
  if (!req.headers.inf365atoken) {
    const te = SetRes.tokenRequired();
    return { isTrue: false, result: te };
  } else if (!reqBody.fName || !reqBody.lName || !reqBody.country || !reqBody.countryCode  || !reqBody.mobileCode || !reqBody.mobileNumber ||  !reqBody.mobileCcNumber) {
    const ad = SetRes.mandatory();
    return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

const passwordChangeVldtns = (req) => {
  const reqBody = req.body;
  if (!req.headers.inf365atoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else {
    if (!reqBody.currPassword || !reqBody.password) {
      const msId = SetRes.mandatory();
      return { flag: false, result: msId };
    } else {
      return { flag: true };
    }
  }
}

const headersoTkenData = (req) => {
  if (!req.headers.inf365atoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else {
    return { flag: true };
  }
}

const sendLoginOtp = (req) => {
  if (!req.body.usrID) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}

const otpValdn = (req) => {
  const reqBody = req.body;
  if (!req.headers.inf365atoken) {
    const te = SetRes.tokenRequired();
    return { isTrue: false, result: te };
  } else if (!reqBody.usrID || !reqBody.otpNum) {
    const ad = SetRes.mandatory();
    return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

module.exports = {
  custsUserProfileUpdateVldns, passwordChangeVldtns, headersoTkenData, sendLoginOtp,
  otpValdn
};
