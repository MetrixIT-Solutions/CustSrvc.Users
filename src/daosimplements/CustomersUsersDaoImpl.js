/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config')
var moment = require('moment');
var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');
const cuName = 'Guest'
const userType = 'Customer';
const status = 'Active';

// ----- Login API Start ----- //
const setLoginQuery = (reqBody) => ({delFlag: false, $or: [{refUID: reqBody.usrID}, {myPrimary: reqBody.usrID}]});
const userTknQry = (_id) => ({ delFlag: false, _id });
const pullAuthData = (_id) => ({ $pull: { authObj: {_id}} });

const setAuthObj = () => {
  const currentUTC = CommonSrvc.currUTCObj();
  return { $push: {
    authObj: { _id: uuidv4(), cDtStr: currentUTC.currUTCDtTmStr }
  }};
}
const setCustUsrData = (resObj) => {
  return {
    // _id: resObj._id,
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
    student: resObj.student,
    userType: resObj.userType,
    seId: resObj.seId,
    uHoda: resObj.uHoda,
  };
}
const setUsrSsnData = (resObj, lres, atoken, deviceData) => {
  const obj = createSsnData(lres, resObj, deviceData);
  return {...obj, uid: resObj._id, uHoda: resObj.uHoda, atoken};
}

const ssnQry = (atoken) => ({atoken});
// ----- Login API End ----- //

const custsGuestCreateObj = (body) => createCustsGuestData(body);
const custGstSsnCreateObj = (body, resObj, deviceData) => {
  const obj = createSsnData(body, resObj, deviceData);
  return { ...obj, gid: resObj._id };
}
const setGuestUsrData = (guObj) => {
  return {
    idSeq: guObj.idSeq,

    pName: guObj.pName || '',
    fName: guObj.fName || '',
    lName: guObj.lName || '',
    desam: guObj.desam,
    dsCode: guObj.dsCode,
    desamCode: guObj.desamCode,
    mobCc: guObj.mobCc || '',
    mobNum: guObj.mobNum || '',
    mobCcNum: guObj.mobCcNum || '',
    emID: guObj.emID || '',
    myPrimary: guObj.myPrimary || '',
    mpType: guObj.mpType,

    mdTokens: guObj.mdTokens,
    wdTokens: guObj.wdTokens,
  };
}

const primaryQry = (reqBody) => ({delFlag: false, myPrimary: reqBody.emID});
const setCustsGuestUserOtpObj = (tData, otpObj, reqBody) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  const updateObj = setGuestUpdateObj(tData, otpObj, reqBody, currUTCObj);
  const query = {_id: tData.iss};

  return { query, updateObj };
}
const custsGuestCreateSendOtp = (otpObj, reqBody) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  const tData = {iss: uuidv4()};
  let desamCode = reqBody.countryFCode, rastrCode = reqBody.rastrCode || '';
  let year = moment().year(), month = moment().format('MM'), day = moment().format('DD');
  const seq = desamCode + rastrCode + year + month + day;
  const guObj = setGuestUpdateObj(tData, otpObj, reqBody, currUTCObj);
  return {
    _id: tData.iss,
    idSeq: {
      seq, desamCode, rastrCode,
      year, month, day
    },
    ...guObj,
    mdTokens: reqBody.mdTokens || [],
    wdTokens: reqBody.wdTokens || [],

    cuType: userType,
    cUser: tData.iss,
    cuName: reqBody.fName + ' ' + reqBody.lName,
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum
  };
}

const setUserOtpObj = (uObj, otpObj) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  const updateObj = {
    otp: otpObj.strHash,
    otpLav: otpObj.salt,

    uuType: userType,
    uUser: uObj._id,
    uuName: uObj.pName, 
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
  const query = { _id: uObj._id };

  return { query, updateObj };
}

const UpdateGuestUserData = (reqBody, id) => {
  const userObj = getCommonUserData(reqBody, id, CommonSrvc.currUTCObj());
  const emID = reqBody.emID.toLowerCase();
  const last4 = emID.slice(-4);
  const student = (last4 == '.edu' && reqBody.student ? true : false);
  return {...userObj, mpVerifyFlag: true, student, userType: student ? 'Student' : 'Regular',
    discp: student ? config.sPer : config.rPer,
    seId: student ? reqBody.emID : ''
  };
}
const setUserDataByColln = (resObj) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  return {
    ...resObj,
    authObj: [{
      _id: uuidv4(),
      cDtStr: currUTCObj.currUTCDtTmStr,
    }],
  };
}
const gstUsrSsnQry = (reqBody) => ({gid: reqBody._id});
const setCustsGstsClsd = (gustData) => setGuestUsrClsdData(gustData);
const setGstSsnClsdData = (gSsnData) => setGuestSsnClsdData(gSsnData);
const setUserData = (reqBody) => {
  const userObj = setNewUserData(reqBody);
  const emID = reqBody.emID.toLowerCase();
  const last4 = emID.slice(-4);
  const student = (last4 == '.edu' && reqBody.student ? true : false);
  return {...userObj, mpVerifyFlag: true, student, userType: student ? 'Student' : 'Regular',
    discp: student ? config.sPer : config.rPer,
    seId: student ? reqBody.emID : ''
  };
}
const setSignUpAuthObj = () => {
  const currentUTC = CommonSrvc.currUTCObj();
  return [{
    _id: uuidv4(),
    cDtStr: currentUTC.currUTCDtTmStr,
  }];
}
const setUserInfoData = (resObj) => createUserInfoData(resObj);

const setUserPasswordObj = (uObj, otpObj) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  return {
    logPswd: otpObj.strHash,
    logPswdLav: otpObj.salt,

    uuType: uObj.uuType,
    uUser: uObj._id,
    uUserName: uObj.pName || 'NA',
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };

}

const guestUserAcntCreate = (reqBody) => {
  const userObj = setNewUserData(reqBody);
  return {...userObj, userType: 'Guest', discp: config.gPer};
}
const authObjQry = (reqBody, cDtStr) => {
  return {
    myPrimary: reqBody.usrID,
    'authObj.cDtStr': cDtStr
  }
}
const setUpdateAuthObj = (atoken) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    'authObj.$.atoken': atoken,
    'authObj.$.cDtStr': currentUTC.currUTCDtTmStr
  }
}

module.exports = {
  setLoginQuery, userTknQry, pullAuthData, setAuthObj, setCustUsrData, setUsrSsnData, ssnQry, setCustsGstsClsd, setGstSsnClsdData,
  custsGuestCreateObj, custGstSsnCreateObj, setGuestUsrData, primaryQry, setCustsGuestUserOtpObj, custsGuestCreateSendOtp, setUserOtpObj,
  UpdateGuestUserData, setUserDataByColln, gstUsrSsnQry, setUserData, setSignUpAuthObj, setUserInfoData,
  setUserPasswordObj, guestUserAcntCreate, authObjQry, setUpdateAuthObj
};

// ----- Login API Start ----- //
const createSsnData = (body, resData, deviceData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),

    at: 'Web App',
    dt: deviceData.deviceType,
    dos: deviceData.osName,
    duId: deviceData.deviceUniqueId || '',
    ma: deviceData.macAddress || '',
    ipa: deviceData.ip,
    ipv: 'ipV4',
    bn: deviceData.browserName,
    bv: deviceData.browserVersion,
    ua: deviceData.ua,
    ip: body,

    cuType: resData.cuType,
    cUser: resData.cUser,
    cuName: resData.cuName,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: resData.uuType,
    uUser: resData.uUser,
    uuName: resData.uuName,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum,
  };
}
// ----- Login API End ----- //

const createCustsGuestData = (resObj) => {
  let desamCode = resObj.countryCode, rastrCode = resObj.rastrCode || '';
  let year = moment().year(), month = moment().format('MM'), day = moment().format('DD');
  const seq = desamCode + rastrCode + year + month + day;
  const currUTCObj = CommonSrvc.currUTCObj();
  const _id = uuidv4();
  return {
    _id, 
    idSeq: {
      seq, desamCode, rastrCode,
      year, month, day
    },

    desam: resObj.country || '',
    desamCode: resObj.countryCode || '',
    dsCode: resObj.countrySCode || '',
    mpType: 'Email',

    mdTokens: resObj.mdTokens || [],
    wdTokens: resObj.wdTokens || [],

    cuType: userType,
    cUser: _id, cuName,
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum,
    uuType: userType,
    uUser: _id, uuName: cuName,
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
}

const setGuestUpdateObj = (tData, otpObj, reqBody, currUTCObj) => {
  return {
    fName: reqBody.fName,
    lName: reqBody.lName,
    pName: reqBody.fName + ' ' + reqBody.lName,
    desam: reqBody.country || '',
    dsCode: reqBody.countryCode || '',
    desamCode: reqBody.countryFCode || '',
    mobCc: reqBody.mobileCode || '',
    mobNum: reqBody.mobileNumber || '',
    mobCcNum: reqBody.mobileCcNumber || '',
    emID: reqBody.emID,
    myPrimary: reqBody.emID,
    mpType: 'Email',

    otp: otpObj.strHash,
    otpLav: otpObj.salt,

    uuType: userType,
    uUser: tData.iss,
    uuName: reqBody.fName + ' ' + reqBody.lName,
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
}

const passwordGenerate = (password) => {
  if(password) {
    const salt = CommonSrvc.genSalt(config.mySaltLen);
    const pswObj = CommonSrvc.encryptStr(password, salt);
    return {...salt, ...pswObj};
  } else 
    return {salt: '', strHash: ''};
}
const getCommonUserData = (resObj, id, currUTCObj) => {
  const emID = resObj.emID.toLowerCase();
  const pass = passwordGenerate(resObj.password);
  const uec = (resObj?.eid >= 0 && resObj?.eid < 26) ? resObj.eid : 25;
  return {
    fName: resObj.fName,
    lName: resObj.lName,
    pName: resObj.fName + ' ' + resObj.lName,
    desam: resObj.country,
    desamCode: resObj.countryCode,
    mobCc: resObj.mobileCode,
    mobNum: resObj.mobileNumber,
    mobCcNum: resObj.mobileCcNumber,
    emID, uec,
    myPrimary: emID,
    mpType: 'Email',
    showAll: false,

    uHoda: status,
    otp: '',
    otpLav: '',
    logPswd: pass.strHash,
    logPswdLav: pass.salt,

    uuType: userType,
    uUser: id,
    uuName: resObj.fName + ' ' + resObj.lName,
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  };
}
const generateRefuid = (resObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const name = resObj.fName+resObj.lName;
  const itemName = name.replaceAll(' ', '').toUpperCase();
  const num = (currentUTC.currUTCYear - 2023);
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const date = new Date();
  const time = (date.getHours()) * (60) + (date.getMinutes());
  const rdmStr = CommonSrvc.randomStrGen(itemName, 3);
  const rdmStr2 = CommonSrvc.randomStrGen(resObj.mobileNumber, 4);
  const day = currentDay.length == 1 ? '00' + currentDay : (currentDay.length == 2 ? '0' + currentDay : currentDay);
  const code = rdmStr2 + rdmStr + num + day + time;
  return code;
}
const setNewUserData = (resObj) => {
  let desamCode = resObj.countryCode, rastrCode = resObj.rastrCode || '';
  let year = moment().year(), month = moment().format('MM'), day = moment().format('DD');
  const seq = desamCode + rastrCode + year + month + day;
  const currUTCObj = CommonSrvc.currUTCObj();
  const _id = uuidv4();
  const refUID = generateRefuid(resObj);
  const usrData = getCommonUserData(resObj, _id, currUTCObj);
  return {
    _id,
    idSeq: {
      seq, desamCode, rastrCode,
      year, month, day
    },
    ...usrData,
    refUID,

    cuType: userType,
    cUser: _id,
    cuName: resObj.fName + ' ' + resObj.lName,
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum,
  };
}

const createUserInfoData = (resObj) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  return {
    _id: resObj._id,
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

const setGuestUsrClsdData = (guObj) => {
  return {
    _id: guObj._id,
    idSeq: guObj.idSeq,
  
    pName: guObj.pName,
    mName: guObj.mName,
    fName: guObj.fName,
    lName: guObj.lName,
    desam: guObj.desam,
    dsCode: guObj.dsCode,
    desamCode: guObj.desamCode,
    mobCc: guObj.mobCc,
    mobNum: guObj.mobNum,
    mobCcNum: guObj.mobCcNum,
    emID: guObj.emID,
    myPrimary: guObj.myPrimary,
    mpType: guObj.mpType,

    logPswd: guObj.logPswd,
    logPswdLav: guObj.logPswdLav,
    otp: guObj.otp,
    otpLav: guObj.otpLav,
    mdTokens: guObj.mdTokens,
    wdTokens: guObj.wdTokens,
  
    cuType: guObj.cuType,
    cUser: guObj.cUser,
    cuName: guObj.cuName,
    cDtStr: guObj.cDtStr,
    cDtNum: guObj.cDtNum,
    uuType: guObj.uuType,
    uUser: guObj.uUser,
    uuName: guObj.uuName,
    uDtStr: guObj.uDtStr,
    uDtNum: guObj.uDtNum,
  };
}

const setGuestSsnClsdData = (gSsnData) => {
  return {
    _id: gSsnData._id,
    gid: gSsnData.gid,
    atoken: gSsnData.atoken,

    at: gSsnData.at,
    dt: gSsnData.dt,
    dos: gSsnData.dos,
    duId: gSsnData.duId,
    ma: gSsnData.ma,
    ipa: gSsnData.ipa,
    ipv: gSsnData.ipv,
    bn: gSsnData.bn,
    bv: gSsnData.bv,
    ua: gSsnData.ua,
    ip: gSsnData.ip,
  
    cuType: gSsnData.cuType,
    cUser: gSsnData.cUser,
    cuName: gSsnData.cuName,
    cDtStr: gSsnData.cDtStr,
    cDtNum: gSsnData.cDtNum,
    uuType: gSsnData.uuType,
    uUser: gSsnData.uUser,
    uuName: gSsnData.uuName,
    uDtStr: gSsnData.uDtStr,
    uDtNum: gSsnData.uDtNum
  };
}
