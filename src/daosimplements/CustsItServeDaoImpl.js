/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
var moment = require('moment');
var config = require('config');

const CommonSrvc = require('../services/CommonSrvc');

const userType = 'Customer';

const setItserveReqBody = (reqBody) => {
  return {
    email: { value: reqBody.usrID },
    passphrase: { value: reqBody.password }
  };
}
const itserveQry = (myPrimary) => ({delFlag: false, myPrimary});

const UpdateItserveData = (resObj, usrData, token) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    itServe: true,
    memberId: resObj.user.userId,
    itsExpired: false,
    itsExpireDt: null,
    itsToken: token,
    userType: 'IT Serve',

    uuType: userType,
    uUser: usrData._id,
    uuName: usrData.pName,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const userTknQry = (_id) => ({delFlag: false, _id});
const pullAuthData = (cDtStr) => ({ $pull: { authObj: {cDtStr}}});
const setItserveAuthObj = () => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    $push: { authObj: {
      _id: uuidv4(),
      cDtStr: currentUTC.currUTCDtTmStr,
    } }
  };
}

const setCustUsrData = (resObj) => {
  return {
    _id: resObj._id,
    // idSeq: resObj.idSeq,

    pIcon: resObj.pIcon || '',
    piActualName: resObj.piActualName || '',
    piPath: resObj.piPath || '',
    fName: resObj.fName,
    lName: resObj.lName,
    desam: resObj.desam,
    desamCode: resObj.desamCode,
    mobCc: resObj.mobCc,
    mobNum: resObj.mobNum,
    mobCcNum: resObj.mobCcNum,
    emID: resObj.emID,
    refUID: resObj.refUID,
    myPrimary: resObj.myPrimary,
    mpType: resObj.mpType,
    altMobCc: resObj.altMobCc || '',
    altMobNum: resObj.altMobNum || '',
    altMobCcNum: resObj.altMobNum || '',
    altEmID: resObj.altEmID || '',
    ptRoju: resObj.ptRoju || '',
    lingam: resObj.lingam || '',
    itServe: resObj.itServe,
    // memberId: resObj.memberId,
    student: resObj.student,
    userType: resObj.userType,
    seId: resObj.seId,
    uHoda: resObj.uHoda,
  };
}

const setUserSSnData = (resObj, lctnData, token, deviceInfo) => getUserSSnData(resObj, lctnData, token, deviceInfo);

const setItserveData = (usrRes, reqBody, token) => getItserveData(usrRes, reqBody, token);
const setSignUpAuthObj = () => {
  const currentUTC = CommonSrvc.currUTCObj();
  return [{
      _id: uuidv4(),
      cDtStr: currentUTC.currUTCDtTmStr,
  }]; 
}
const setUserInfoData = (resObj) => getUserInfoData(resObj);


const setLoginQuery = (reqBody) => {
  return {delFlag: false, $or: [{refUID: reqBody.usrID}, {myPrimary: reqBody.usrID}]};
}

const ItserveAuthObjQry = (reqBody, cDtStr) => {
  return {
    myPrimary: reqBody.usrID,
    'authObj.cDtStr': cDtStr
  };
}

const setItserveUpdateAuthObj = (atoken) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    'authObj.$.atoken': atoken,
    'authObj.$.cDtStr': currentUTC.currUTCDtTmStr
  }
}

const primaryQry = (myPrimary) => ({delFlag: false, myPrimary});

module.exports = {
  setItserveReqBody, itserveQry, UpdateItserveData, setItserveData, setSignUpAuthObj, setUserInfoData, setUserSSnData, setLoginQuery,
  ItserveAuthObjQry, setItserveUpdateAuthObj, setItserveAuthObj, primaryQry, pullAuthData, userTknQry, setCustUsrData
};

const getUserSSnData = (resObj, locationData, atoken, deviceData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    uid: resObj._id,
    atoken,

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
    uHoda: resObj.uHoda,

    cuType: resObj.cuType,
    cUser: resObj.cUser,
    cuName: resObj.cuName,
    cDtStr:  currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: resObj.uuType,
    uUser: resObj.uUser,
    uuName: resObj.uuName,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const getItserveData = (resObj, reqBody, token) => {
  let desamCode = reqBody.countryCode, rastrCode = reqBody.rastrCode || '';
  let year = moment().year(), month = moment().format('MM'), day = moment().format('DD');
  const seq = desamCode + rastrCode + year + month + day;
  const currUTCObj = CommonSrvc.currUTCObj();
  const refUID = generateRefuid(resObj.user);

  const _id = uuidv4();
  return {
    _id,
    idSeq: {
      seq, desamCode, rastrCode,
      year, month, day
    },

    refUID,
    fName: resObj.user.givenName,
    lName: resObj.user.familyName,
    pName: resObj.user.givenName + ' ' + resObj.user.familyName,
    desam: reqBody.country || '',
    desamCode: reqBody.countryCode || '',
    emID: resObj.user.email.value.toLowerCase(),
    uec: reqBody.eid,
    myPrimary: resObj.user.email.value.toLowerCase(),
    mpType: 'Email',
    mpVerifyFlag: true,
    itServe: true,
    memberId: resObj.user.userId,
    itsExpired: false,
    itsToken: token,
    userType: 'IT Serve',
    discp: config.rPer,
    showAll: false,

    uHoda: 'Active',

    mdTokens: reqBody.mdTokens || [],
    wdTokens: reqBody.wdTokens || [],

    cuType: userType,
    cUser: _id,
    cuName: resObj.user.givenName + ' ' + resObj.user.familyName,
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum,
    uuType: userType,
    uUser: _id,
    uuName: resObj.user.givenName + ' ' + resObj.user.familyName,
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
}

const generateRefuid = (resObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const pName = resObj.givenName + resObj.familyName;
  const itemName = pName.replaceAll(' ', '').toUpperCase();
  const num = (currentUTC.currUTCYear - 2023);
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const date = new Date();
  const time = (date.getHours()) * (60) + (date.getMinutes());
  const rdmStr = CommonSrvc.randomStrGen(itemName, 3);
  const rdmStr2 = CommonSrvc.randomStrGen(resObj.userId.toString(), 4);
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const code = rdmStr2 + rdmStr + num + day + time;
  return code;
}

const getUserInfoData = (resObj) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    uid: resObj._id,
    refUID: resObj.refUID,
    myPrimary: resObj.myPrimary,
    // uHoda: resObj.uHoda,

    cuType: userType,
    cUser: resObj._id,
    cuName: resObj.cuName,
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum,
    uuType: userType,
    uUser: resObj._id,
    uuName: resObj.uuName,
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
}
