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

// --- Begin: Customers Users Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {
    seq: {type: String, required: true}, // Country, State and Dist Code and Year(2022) Moth(10) Day(10)
    desamCode: {type: String, required: false}, // Country Code: IND
    rastrCode: {type: String, required: false}, // TS
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },

  pName: {type: String, required: false, trim: true}, // Purti Peru - Full Name
  mName: {type: String, required: false, trim: true}, // Muddu Name - Short Name
  fName: {type: String, required: true, trim: true}, // Purti Peru - Full Name
  lName: {type: String, required: true, trim: true}, // Purti Peru - Full Name
  desam: {type: String, required: false},
  desamCode: {type: String, required: false},
  mobCc: {type: String, required: false}, // cc - Country Code: +91
  mobNum: {type: String, required: false}, // Mobile Number
  mobCcNum: {type: String, required: false}, // Mobile Number with Country Code
  emID: {type: String, required: true, trim: true}, // Email ID
  uec: {type: Number, required: false}, // User Email Code [0, 1, 2, ..., 25]
  refUID: {type: String, required: true}, // Reference Unique ID
  myPrimary: {type: String, required: true}, // Mobile Number or Email
  mpType: {type: String, required: true}, // My Primary Type:  Email or Mobile
  mpVerifyFlag: {type: Boolean, default: false},
  ptRoju: {type: String, required: false}, // Puttina Roju - Date of Birth - Format = YYYY-MM-DD
  lingam: {type: String, required: false}, // Gender
  itServe: {type: Boolean, default: false},
  memberId: {type: String, required: false}, // IT Serve User ID i.e. userId
  itsExpired: {type: Boolean, required: false}, // false/true
  itsExpireDt: {type: String, required: false}, // if(itsExpired) provide current date
  itsToken: {type: String, required: false}, // Set in Indifly Token as 'itt'
  // itstExpDtNum: {type: Number, required: false}, // Set in Indifly Token as 'ite'
  student: {type: Boolean, default: false},
  seId: {type: String, required: false}, // Student Email ID
  sExpired: {type: Boolean, required: false},
  sExpireDt: {type: String, required: false},
  userType:  {type: String, required: false}, // User Type: Guest, Regular, Student, IT Serve
  discp: {type: Number, default: 0.95}, // Discount Persontage
  showAll: {type: Boolean, required: false},
  authObj: [{
    _id: {type: String, required: false}, // Session Key(uuid)
    cDtStr: {type: String, required: false}
  }],

  uHoda: {type: String, required: true, trim: true}, // User Status: Active, Inactive(Contact Support), Hold(24Hrs), Blocked(1Hr)
  mPin: {type: String, required: false},
  mPinLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  logPswd: {type: String, required: false},
  logPswdLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  otp: {type: String, required: false},
  otpLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  mdTokens: {type: [String], required: false, default: []}, // Mobile Device Tokens
  wdTokens: {type: [String], required: false, default: []}, // Web Device Tokens

  pIcon: {type: String, required: false}, // Profile Icon
  piActualName: {type: String, required: false},
  piPath: {type: String, required: false},

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
}, {collection: config.collCustsUsrsMm});

schema.index({refUID: 1}, {unique: true});
schema.index({myPrimary: 1}, {unique: true});
schema.index({delFlag: -1, myPrimary: 1, refUID: 1});
schema.index({delFlag: -1, authObj: 1});

module.exports = mongoose.model(config.collCustsUsrsMm, schema);
// --- End: Customers Users Schema --- //
