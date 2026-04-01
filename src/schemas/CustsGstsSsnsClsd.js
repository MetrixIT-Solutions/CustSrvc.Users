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

// --- Begin: Customers Guests Sessions Closed Schema --- //
var schema = new Schema({
  _id: {type: String, default: uuidv4()},
  gid: {type: String, required: true, index: true, ref: config.collCustsGsts},
  atoken: {type: String, required: true}, // 5 min

  at: {type: String, required: true, trim: true}, // App Type: Web App, Mobile App
  dt: {type: String, required: true, trim: true}, // Device Type: Desktop, Mobile, Tab
  dos: {type: String, required: true, trim: true}, // Device OS
  duId: {type: String, required: false, trim: true}, // Device Unique Id
  ma: {type: String, required: false, trim: true}, // Mac Address
  ipa: {type: String, required: true, trim: true}, // IP Address
  ipv: {type: String, required: true, trim: true}, // IP Version
  bn: {type: String, required: false, trim: true}, // Browser Name
  bv: {type: String, required: false, trim: true}, // Browser Version
  ua: {type: String, required: true, trim: true}, // USer Agent
  ip: {type: Object},

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
}, {collection: config.collCustsGstsSsnsClsd});

module.exports = mongoose.model(config.collCustsGstsSsnsClsd, schema);
// --- End: Customers Guests Sessions Closed Schema --- //
