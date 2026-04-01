/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: Customers Guests Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {
    seq: {type: String, required: true}, // Country, State and Year(2022) Moth(10) Day(10)
    desamCode: {type: String, required: false}, // Country Code: IND
    rastrCode: {type: String, required: false}, // TS
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },

  pName: {type: String, required: false, trim: true}, // Purti Peru - Full Name
  mName: {type: String, required: false, trim: true}, // Muddu Name - Short Name
  fName: {type: String, required: false, trim: true}, // Purti Peru - Full Name
  lName: {type: String, required: false, trim: true}, // Purti Peru - Full Name
  desam: {type: String, required: false},
  dsCode: {type: String, required: false}, // Desam Short Code
  desamCode: {type: String, required: false},
  mobCc: {type: String, required: false}, // cc - Country Code: +91
  mobNum: {type: String, required: false}, // Mobile Number
  mobCcNum: {type: String, required: false}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  myPrimary: {type: String, required: false}, // Mobile Number or Email
  mpType: {type: String, required: false}, // My Primary Type:  Email or Mobile

  mPin: {type: String, required: false},
  mPinLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  logPswd: {type: String, required: false},
  logPswdLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  otp: {type: String, required: false},
  otpLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  mdTokens: {type: [String], required: false, default: []}, // Mobile Device Tokens
  wdTokens: {type: [String], required: false, default: []}, // Web Device Tokens

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

schema.index({myPrimary: 1, idSeq: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsGsts, schema);
// --- End: Customers Guests Schema --- //
