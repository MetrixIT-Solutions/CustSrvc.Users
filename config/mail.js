/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const logger = require('../src/lib/logger');

// --- Begin sendEMail: Code to send an email

const sendEMail = (toUserEmail, mailSubject, htmlContent, callback) => {
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: config.mailServerHost,
    port: config.mailServerPort,
    auth: {
      user: config.fromMail,
      pass: config.fromMailPswd
    }
  }));
  var mailOptions = {
    from: 'NoReply<noreply@indifly365.com>',
    to: toUserEmail,
    subject: mailSubject,
    html: htmlContent
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('There was an Error in config/mail.js, at sendEMail function:', error);
      return callback(error, info);
    } else {
      return callback(error, info);
    }
  });
}
// --- End sendEMail: Code to send an mail

module.exports = {
  sendEMail

};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
