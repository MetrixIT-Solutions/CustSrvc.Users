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

// --- Begin: Customers Users Contacts Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  user: {type: String, required: true}, // CustsUsers._id
  refUID: {type: String, required: true}, // CustsUsers.refUID

  crCode: {type: String, required: true, index: true, unique: true}, // Contact Reference Code
  fName: {type: String, required: true, trim: true}, // Purti Peru - Full Name
  lName: {type: String, required: true, trim: true}, // Purti Peru - Full Name
  name: {type: String, required: true, trim: true}, // Full Name
  enquiry: {type: String, required: true, trim: true}, // Sales, Complaints, Feedback, Reissue / Date Change, Cancellation / Refund, Customer Service, Online Booking Support, Group Travel Quotes,
  mobCc: {type: String, required: false}, // Mobile Code
  mobNum: {type: String, required: true}, // Mobile Number
  emID: {type: String, required: true, trim: true}, // Email ID
  pnrNo: {type: String, required: false}, // PNR Number
  notes: {type: String, required: true, trim: true}, // notes

  cStatus: {type: String, default: 'Open'}, // Contact Status: Open, Inreview, Ticketed, Inprocess, Closed
  custStatus: {type: String, default: 'Active'}, // Customer Status: Active, Closed,

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

schema.index({crCode: 'text', name: 'text', enquiry: 'text', mobNum: 'text', emID: 'text', pnrNo: 'text'});
schema.index({delFlag: -1, user: 1, custStatus: 1, enquiry: 1});
schema.index({delFlag: -1, cStatus: 1, enquiry: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsUsrsContacts, schema);
// --- End: Customers Users Contacts Schema --- //
