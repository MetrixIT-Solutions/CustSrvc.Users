/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const cupCtrl = require('../../controllers/CustsUsersProfileCtrl');

module.exports.controller = (app, passport) => {

  app.post('/inf365/custs/profile/update', cupCtrl.custsUserProfileUpdate);  
  app.post('/inf365/custs/profile/pic/update/:type', cupCtrl.profilePicUpdate);
  app.post('/inf365/custs/card/create', cupCtrl.custCardCreate);
  app.post('/inf365/cust/login/user/password/update', cupCtrl.custPassWordUpdate);
  app.get('/inf365/cust/user/profile', cupCtrl.custLoginProfileUser);
  app.post('/inf365/custs/user/primary/update/send/otp', cupCtrl.custsCustUsrPrmrySOTP);
  app.post('/inf365/custs/user/primary/update/verify/otp', cupCtrl.custsCustLoginUpdVerOTP);
  app.post('/inf365/custs/user/session', cupCtrl.custsCustUserSsn);

};
