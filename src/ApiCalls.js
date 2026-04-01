/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var axios = require('axios');
var config = require('config');

const logger = require('./lib/logger');

const itServeLogin = (data, pd, ts, callback) => {
  const headers = { headers: {'a':`v=${config.itsVersion}` + ';' + `k=${config.itsPublicKey}` + ';' + `ts=${ts}` + ';' + `d=${pd}`} };
  axios.post(`${config.itsApiDomain}user/session`, data, headers).then((res) => {
    callback(null, res)
  }).catch((err) => {
    logger.error('Un-konwn Error in ApiCalls.js, at itServeLogin:' + err);
    callback(err, {});
  });
}

const getItserveData = (gd, ts, token, callback) => {
  const headers = { headers: {'a':`v=${config.itsVersion}` + ';' + `k=${config.itsPublicKey}` + ';' + `ts=${ts}` + ';' + `d=${gd}`, token} };
  axios.get(`${config.itsApiDomain}user/snapshot/en`, headers).then((res) => callback(null, res)).catch((err) => {
    logger.error('Un-konwn Error in ApiCalls.js, at getItserveData:' + err);
    callback(err, {});
  });
}

const itServeLogout = (dd, ts, token, callback) => {
  const headers = { headers: {a:`v=${config.itsVersion}` + ';' + `k=${config.itsPublicKey}` + ';' + `ts=${ts}` + ';' + `d=${dd}`, token} };
  axios.delete(`${config.itsApiDomain}user/session`, headers).then((res) => callback(null, res)).catch((err) => {
    logger.error('Un-konwn Error in ApiCalls.js, at itServeLogout:' + err);
    callback(err, {});
  });
}

const getCurrentLocation = (ip, callback) => {
  axios.post(config.getipLocation + ip).then((res) => callback(res.data)).catch((err) => callback({}));
}

module.exports = {
  itServeLogin, getItserveData, itServeLogout, getCurrentLocation
};
