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

// --- Begin: Customers Users Feedbacks Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  user: {type: String, required: true}, // CustsUsers._id
  refUID: {type: String, required: true}, // CustsUsers.refUID

  name: {type: String, required: true, trim: true}, // Full Name
  address: {type: String, required: false, trim: true}, // Full Name
  mobNum: {type: String, required: true}, // Mobile Number
  emID: {type: String, required: true, trim: true}, // Email ID
  tFeedBck: {type: String, required: false, trim: true}, // Type-feedBack
  tFeedSub: {type: String, required: false, trim: true}, // Subject
  pnrNo: {type: String, required: false}, // PNR Number
  notes: {type: String, required: true, trim: true}, // notes

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

schema.index({name: 'text', tFeedBck: 'text', tFeedSub: 'text', mobNum: 'text', emID: 'text', pnrNo: 'text'});
schema.index({delFlag: -1, tFeedBck: 1, user: 1});
schema.index({delFlag: -1, cDtStr: -1, uDtStr: -1, user: 1});

module.exports = mongoose.model(config.collCustsUsrsFeedbacks, schema);
// --- End: Customers Users Feedbacks Schema --- //
