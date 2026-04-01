/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const moment = require('moment');
var config = require('config');

const CommonSrvc = require('../services/CommonSrvc');
const userType = 'Customer';
const status = 'Active';

const setCustFeedBckData = (reqBody, tokenData,) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const _id = uuidv4();
  return {
    _id,
    name: reqBody.name,
    mobNum: reqBody.mobNum,
    emID: reqBody.emailId,
    notes: reqBody.notes,
    address: reqBody.address || '',
    tFeedBck: reqBody.feedBack || '',
    tFeedSub: reqBody.subject || '',
    pnrNo: reqBody.pnrNumber || '',
    
    user: tokenData.iss,
    refUID: tokenData.uid,
    cuType: tokenData.ut,
    cUser: tokenData.iss,
    cuName: tokenData.fn,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tokenData.ut,
    uUser: tokenData.iss,
    uuName: tokenData.fn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const CustUserContactUsCreate = (reqBody, deviceData, locationData, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const _id = uuidv4();
  const code = setCrCode(reqBody, currentUTC);
  return {
    _id,
    user: tokenData.iss,
    refUID: tokenData.uid,
    crCode: code.crCode,

    fName: reqBody.fName,
    lName: reqBody.lName,
    name: reqBody.fName +  ' ' + reqBody.lName,
    enquiry : reqBody.nature,
    mobCc: reqBody.mobCc, 
    mobNum: reqBody.mobNum,
    emID: reqBody.emID.toLowerCase(),
    notes: reqBody.notes,
    pnrNo: reqBody.pnrNumber || '',
    at: 'Web App',
    dt: deviceData.deviceType,
    dos: deviceData.osName,
    duId: deviceData.deviceUniqueId || '',
    ma: deviceData.macAddress || '',
    ipa: locationData.ip,
    ipv: 'ipV4',
    bn: deviceData.browserName,
    bv: deviceData.browserVersion,
    ua: deviceData.ua,
    ip: {...locationData, ...deviceData},
    user: tokenData.iss,
    refUID: tokenData.uid || '',
    cuType: tokenData.ut || 'customer',
    cUser: tokenData.iss,
    cuName: tokenData.pn,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tokenData.ut || 'customer',
    uUser: tokenData.iss,
    uuName: tokenData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const setUserData = (reqBody) => {
  const refUID = generateRefuid(reqBody);
  const data = getUserData(reqBody);
  return {...data, refUID};
}
const usrEIdQry = (emID) => ({delFlag: false, emID});

module.exports = {
  setCustFeedBckData, CustUserContactUsCreate, setUserData, usrEIdQry
}

const setCrCode = (reqBody, currentUTC) => {
  const num = (currentUTC.currUTCYear - 2023);
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const rdmStr2 = CommonSrvc.randomStrGen(reqBody.mobNum, 3);
  const time = (new Date().getHours()) * (60) + (new Date().getMinutes());
  const crCode = num  + rdmStr2 + currentDay + time;
  return { crCode };
}

const getUserData = (resObj) => {
  let desamCode = resObj.countryCode || '', rastrCode = resObj.rastrCode || '',  cityCode = resObj.cityCode || '';
  let year = moment().year(), month = moment().month(), day = moment().day();
  const seq = desamCode + rastrCode + cityCode + year + month + day;
  const currUTCObj = CommonSrvc.currUTCObj();
  const _id = uuidv4();
  return {
    _id,
    idSeq: {
      seq, desamCode, rastrCode,
      jillaCode: cityCode,
      pincode: resObj.postal || '',
      year, month, day
    },
    fName: resObj.fName,
    lName: resObj.lName,
    pName: resObj.fName + ' ' + resObj.lName,
    desam: resObj.country || '',
    desamCode: resObj.countryCode || '',
    mobCc: resObj.mobCc,
    mobNum: resObj.mobNum,
    mobCcNum: resObj.mobCc + resObj.mobNum,
    emID: resObj.emID.toLowerCase(),
    uec: resObj.eid,
    myPrimary: resObj.emID.toLowerCase(),
    mpType: 'Email',
    altMobCc: resObj.altMobCc || '',
    altMobNum: resObj.altMobNum || '',
    altMobCcNum: resObj.altMobNum || '',
    altEmID: resObj.altEmID || '',
    ptRoju: resObj.ptRoju || '',
    lingam: resObj.lingam || '',
    memberId: '',
    student: false,
    userType: 'Regular',
    discp: config.rPer,

    seId: '',

    uHoda: status,
    logPswd: '',
    logPswdLav: '',

    mdTokens: resObj.mdTokens || [],
    wdTokens: resObj.wdTokens || [],

    uuType: userType,
    uUser: _id,
    uuName: resObj.fName + ' ' + resObj.lName || 'Guest',
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum,
    cuType: userType,
    cUser: _id,
    cuName: resObj.fName + ' ' + resObj.lName,
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum,
  };
}

const generateRefuid = (resObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const itemName = resObj.fName.replaceAll(' ', '').toUpperCase();
  const num = (currentUTC.currUTCYear - 2023);
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const date = new Date();
  const time = (date.getHours()) * (60) + (date.getMinutes());
  const rdmStr = CommonSrvc.randomStrGen(itemName, 3);
  const rdmStr2 = CommonSrvc.randomStrGen(resObj.mobNum, 4);
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const code = rdmStr2 + rdmStr + num + day + time;
  return code
};