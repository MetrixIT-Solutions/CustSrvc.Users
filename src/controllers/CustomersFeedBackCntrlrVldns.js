/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const CustUserFeedBackCreate = (req) => {
  const reqBody = req.body;
  if (!req.headers.inf365atoken) {
    const te = SetRes.tokenRequired();
    return { isTrue: false, result: te };
  } else if (!reqBody.name || !reqBody.mobNum || !reqBody.emailId || !reqBody.notes) {
    const ad = SetRes.mandatory();
    return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

const CustUserContactUsCreate = (req) => {
  const reqBody = req.body;
 if (!reqBody.fName || !reqBody.lName || !reqBody.nature || !reqBody.mobNum || !reqBody.emID || !reqBody.notes) {
    const ad = SetRes.mandatory();
    return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

module.exports = {
  CustUserFeedBackCreate, CustUserContactUsCreate
};