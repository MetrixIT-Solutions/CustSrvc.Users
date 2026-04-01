/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const CustomersFeedbackCntrlr = require('../../controllers/CustomersFeedbackCntrlr');

module.exports.controller = (app, passport) => {

  app.post('/inf365/custs/feedback/create', CustomersFeedbackCntrlr.CustUserFeedBackCreate);
  app.post('/inf365/custs/contact/create', CustomersFeedbackCntrlr.CustUserContactUsCreate);
}