/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../../SetRes');

const tknVldn = (tokenData) => {
  if (!tokenData) {
    const it = SetRes.tokenInvalid();
    return { isTrue: false, result: it };
  } else if (tokenData.isExpired) {
    const te = SetRes.tokenExpired();
    return { isTrue: false, result: te };
  // } else if (tokenData.tokenData && tokenData.tokenData.ur !== tType) {
  //   const ad = SetRes.invalidAccess();
  //   return { isTrue: false, result: ad };
  } else {
    return { isTrue: true };
  }
}

module.exports = { tknVldn };
