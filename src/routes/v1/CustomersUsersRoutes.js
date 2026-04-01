/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const CustomersUsersCntrlr = require('../../controllers/CustomersUsersCntrlr');
const cuitsc = require('../../controllers/CustsUsersItServeCntrlr');

module.exports.controller = (app, passport) => {

  app.get('/', CustomersUsersCntrlr.apiServerStatus);

  app.post('/inf365/custs/users/login', (req, res, next) => CustomersUsersCntrlr.postCustmerUserLogin(req, res, next, passport));
  app.post('/inf365/custs/users/login/send/otp', CustomersUsersCntrlr.sendLoginOtp);
  app.post('/inf365/custs/users/login/verify/otp', CustomersUsersCntrlr.verifyLoginOtp);
  app.post('/inf365/custs/users/logout', CustomersUsersCntrlr.postCustmerUserLogout);

  app.post('/inf365/custs/create/guests', CustomersUsersCntrlr.createCustsGuest);
  app.post('/inf365/custs/guest/login/send/otp', CustomersUsersCntrlr.sendCustsGstLoginOtp);
  app.post('/inf365/custs/guest/login/verify/otp', CustomersUsersCntrlr.custsGstVerifyOtp);
  app.post('/inf365/custs/user/sign/up', CustomersUsersCntrlr.customerSignUp);

  app.post('/inf365/custs/login/reset/password', CustomersUsersCntrlr.custsCustLoginResetPassword);
  app.post('/inf365/custs/guest/user/create', CustomersUsersCntrlr.guestUserAcntCreate);

  app.post('/inf365/custs/itserve/login', cuitsc.postCustUserItServeLogin);
  app.post('/inf365/custs/itserve/session', cuitsc.postCustmerItserveSSn);

};
