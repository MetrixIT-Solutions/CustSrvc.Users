/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var LocalStrategy = require('passport-local').Strategy;

const CustomersUsersDao = require('./daos/CustomersUsersDao');
const CustomersUsersDaoImpl = require('./daosimplements/CustomersUsersDaoImpl');
const CustomersUsersSrvc = require('./services/CustomersUsersSrvc');
const SetRes = require('./SetRes');

const invalidUsr = 'This email Id is not registered.';

// --- Begining of passport
module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use('inf365-cust-local-login', new LocalStrategy({
    usernameField: 'usrID',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, usrID, password, callback) => {
    custUserLogin(req.body, callback);
  }));
};
// --- End of passport

/**
 * @param {Object} reqBody - request body object
 * @param {Function} callback - callback function
 */
const custUserLogin = (reqBody, callback) => {
  try {
    const query = CustomersUsersDaoImpl.setLoginQuery(reqBody);
    const eid = (reqBody?.eid >= 0 && reqBody?.eid < 26) ? reqBody.eid : 25;
    CustomersUsersDao.getUserDataByEid(query, eid, uResObj => {
      if (uResObj.status == '200') {
        CustomersUsersSrvc.passportVerifyUserLogin(JSON.stringify(uResObj.resData.result), reqBody.password, callback);
      } else if (uResObj.status == '204') {
        const ic = SetRes.invalidCredentials(invalidUsr);
        callback(ic);
      } else {
        callback(uResObj);
      }
    });
  } catch (error) {
    logger.error('Unknown Error in config/passport.js, inf365-cust-local-login: custUserLogin(catch):' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  }
}
