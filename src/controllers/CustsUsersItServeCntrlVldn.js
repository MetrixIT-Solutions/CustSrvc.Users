/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */
const SetRes = require('../SetRes');

const postItserveUserLoginVldn = (req) => {
  const reqBody = req.body;
  if (!reqBody.password || !reqBody.usrID) {
    const mf = SetRes.mandatory();
    return { isTrue: false, result: mf };
  } else {
    return { isTrue: true };
  }
}

module.exports = {
  postItserveUserLoginVldn
};