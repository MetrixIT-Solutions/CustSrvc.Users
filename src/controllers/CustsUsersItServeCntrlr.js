/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var moment = require('moment');

const util = require('../lib/util');
const CustsUsersItServeCntrlVldn = require('../controllers/CustsUsersItServeCntrlVldn');
const cuitss = require('../services/CustsUsersItServeSrvc');
const token = require('../tokens');

const postCustUserItServeLogin = (req, res) => {
  const vldRes = CustsUsersItServeCntrlVldn.postItserveUserLoginVldn(req);
  if(vldRes.isTrue) {
    const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
    const ts = moment().add(10, 'minutes').valueOf();
    const pd = token.getItServeHmacDigest('post', ts);
    const gd = token.getItServeHmacDigest('get', ts);
    const dd = token.getItServeHmacDigest('delete', ts);
    cuitss.postCustUserItServeLogin({pd, gd, dd, ts, res}, req.body, deviceInfo, resObj => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postCustmerItserveSSn = (req, res) => {
  const ts = moment().add(10, 'minutes').valueOf();
  const gd = token.getItServeHmacDigest('get', ts);
  cuitss.postCustmerItserveSSn({gd, ts}, req.body, (resObj) => {
    util.sendApiResponse(res, resObj);
  });
}

module.exports = {
  postCustUserItServeLogin, postCustmerItserveSSn
};
