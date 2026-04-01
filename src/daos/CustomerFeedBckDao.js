/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const logger = require('../lib/logger');
const SetRes = require('../SetRes');

const createCustFeedBckCreate = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.responseData(resObj);
      callback(sr);
    } else {
      const uf = SetRes.unKnownErr({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustomerFeedBckDao.js, at createCustFeedBckCreate:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  });
}

module.exports = {
  createCustFeedBckCreate
};
