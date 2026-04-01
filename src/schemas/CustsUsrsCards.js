/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

'use strict';
var crypto = require('crypto');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: Customers Users Cards Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  user: {type: String, required: true}, // CustsUsers._id
  refUID: {type: String, required: true}, // CustsUsers.refUID

  cName: {type: String, set: (value) => encriptDbStr(value), get: (value) => decriptDbStr(value), required: true}, //  Card Holder Name
  cType: {type: String, set: (value) => encriptDbStr(value), get: (value) => decriptDbStr(value), required: true}, // Card Type
  cNum: {type: String, set: (value) => encriptDbStr(value), get: (value) => decriptDbStr(value), required: true}, // Card Number
  cvv: {type: String, set: (value) => encriptDbStr(value), get: (value) => decriptDbStr(value), required: true}, // Card CVV
  cExpDt: {type: String, set: (value) => encriptDbStr(value), get: (value) => decriptDbStr(value), required: true}, // Card Expiry Date
  bPhn: {type: String, required: false, trim: true}, // bPhn: BankPhoneNum
  billPhn: {type: String, required: false, trim: true}, // billPhn: BillingPhoneNum

  // Billing Address
  address1: {type: String, required: true, trim: true},
  address2: {type: String, required: false},
  pincode: {type: String, required: false},
  city: {type: String, required: true},
  desam: {type: String, required: true},
  bState: {type: String, required: true},
  emID: {type: String, required: true, trim: true}, // Email ID

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type
  cUser: {type: String, required: true, trim: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.pName
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  cDtNum: {type: Number, required: true}, // Date & Time Number
  uuType: {type: String, required: true}, // Updated User Type
  uUser: {type: String, required: true, trim: true}, // Updated Users._id
  uuName: {type: String, required: true}, // Updated Users.pName
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uDtNum: {type: Number, required: true}, // Date & Time Number
});

schema.index({cName: 'text', billPhn: 'text', emID: 'text'});
schema.index({user: 1, cType: 1, cNum: 1}, {unique: true});
schema.index({delFlag: -1, user: 1});

module.exports = mongoose.model(config.collCustsUsrsCards, schema);
// --- End: Customers Users Cards Schema --- //


/**
 * @param {string} text string
 * @return {string}
 */
const encriptDbStr = (text) => {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.dbCriptoEncrypt), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * @param {string} text string
 * @return {string}
 */
const decriptDbStr = (text) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.dbCriptoEncrypt), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}