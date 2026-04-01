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

// --- Begin: Customers User Informations Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  uid: {type: String, index: true, required: true, unique: true, ref: config.collCustsUsrs},
  refUID: {type: String, required: true}, // Reference Unique ID
  myPrimary: {type: String, required: true}, // Mobile Number or Email
  // uHoda: {type: String, required: true, trim: true}, // User Status: Active, Inactive, Hold, Blocked

  bCount: {type: Number, default: 0}, // Bookings Count
  ubCount: {type: Number, default: 0}, // Upcoming Bookings Count
  cncldbCount: {type: Number, default: 0}, // Cancelled Bookings Count
  cmpldbCount: {type: Number, default: 0}, // Completed Bookings Count

  ntfcts: {type: Number, default: 0}, // Notifications Count
  rNtfcts: {type: Number, default: 0}, // Read Notifications Count
  urNtfcts: {type: Number, default: 0}, // Unread Notifications Count
  sTckts: {type: Number, default: 0}, // Support Tickets Count
  saTckts: {type: Number, default: 0}, // Support Tickets Active Count
  scTckts: {type: Number, default: 0}, // Support Tickets Closed Count

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

schema.index({refUID: 1}, {unique: true});
schema.index({myPrimary: 1}, {unique: true});

module.exports = mongoose.model(config.collCustsUsrsInfos, schema);
// --- End: Customers User Informations Schema --- //
