/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const CustomersFeedBackCntrlrVldns = require('../controllers/CustomersFeedBackCntrlrVldns');
const tVldns = require('./Vldns/TokenVldns');
const CustomersFeedBackSrvc = require('../services/CustomersFeedBackSrvc');

const CustUserFeedBackCreate = (req, res, next) => {
  const vldRes = CustomersFeedBackCntrlrVldns.CustUserFeedBackCreate(req);
  if (vldRes.isTrue) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        CustomersFeedBackSrvc.CustUserFeedBackCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else {
        util.sendApiResponse(res, tknVldn.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const CustUserContactUsCreate = (req, res, next) => {
  const vldRes = CustomersFeedBackCntrlrVldns.CustUserContactUsCreate(req);
  const deviceInfo = JSON.parse(req.headers.inf365uiinfo);
  if (vldRes.isTrue) {
    if (req.headers.inf365atoken) {
      tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
        const tknVldn = tVldns.tknVldn(tData);
        if (tknVldn.isTrue) {
          CustomersFeedBackSrvc.CustUserContactUsCreate(req.body, tData.tokenData, deviceInfo, (resObj) => {
            util.sendApiResponse(res, resObj);
          });
        } else {
          util.sendApiResponse(res, tknVldn.result);
        }
      });
    } else {
      CustomersFeedBackSrvc.CustUserContactUsCreate(req.body, {}, deviceInfo, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    }
    
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

module.exports = {
  CustUserFeedBackCreate, CustUserContactUsCreate
};