/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var {v4: uuidv4} = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');

const userType = 'Customer';

const setProfileUpdateObj = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { _id: tData.iss, delFlag: false };
  const updObj = {
    fName: reqBody.fName,
    lName: reqBody.lName,
    pName: reqBody.fName + ' ' + reqBody.lName,
    desam: reqBody.country,
    desamCode: reqBody.countryCode,
    mobCc: reqBody.mobileCode,
    mobNum: reqBody.mobileNumber,
    mobCcNum: reqBody.mobileCcNumber,
    ptRoju: reqBody.dob || '',
    lingam: reqBody.gender || '',

    uuType: userType,
    uUser: tData.iss,
    uuName: tData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  return {query, updObj};
}

const setCustUsrData = (resObj) => {
  return {
    idSeq: resObj.idSeq,

    pIcon: resObj.pIcon || '', 
    piActualName: resObj.piActualName || '', 
    piPath: resObj.piPath || '',
    fName: resObj.fName,
    lName: resObj.lName,
    pName: resObj.pName,
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
    itServe: resObj.itServe ,
    student: resObj.student,
    userType: resObj.userType,
    seId: resObj.seId,
    uHoda: resObj.uHoda,
  };
}

const profilePic = (piPath, piActualName, pIcon, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { delFlag: false, _id: tokenData.iss };
  const updateObj = {
    pIcon, piActualName, piPath,

    uUser: tokenData.iss,
    uuName: tokenData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  return { query, updateObj };
}

const getCustUserData = (tData) => {
  return {_id: tData.iss, delFlag: false }
}

const updatePassword = (tData, pasObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const updateData = {

    logPswd: pasObj.strHash,
    logPswdLav: pasObj.salt,
    
    uuType: userType,
    uUser: tData.iss,
    uuName: tData.pn,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
  
  return updateData;
}

const setUserCardData = (reqBody, tData) => {
  return getSetUserCardData(reqBody, tData)
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


const setUserPrimary = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
  emID: reqBody.usrID || '',
  myPrimary: reqBody.usrID || '',
  mpVerifyFlag: true,
  uuType: tData.ur || tData.tt,
  uUser: tData.fn,
  uuName: tData.pn,
  uDtStr: currentUTC.currUTCDtTmStr,
  uDtNum: currentUTC.currUTCDtTmNum
  }
}

const createUserData = (resObj, uec) => {
  return getCreateUsrData(resObj, uec);
}

const ssnQry = (reqBody) => {
  return {'delFlag': false, '_id': reqBody.iss, 'authObj._id': reqBody.sk};
}

module.exports = {
  setProfileUpdateObj, setCustUsrData, profilePic, getCustUserData, updatePassword, 
  setUserCardData, setUserOtpObj, setUserPrimary, createUserData, ssnQry
};

const getSetUserCardData = (reqBody, tData) => {
  const currUTCObj = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    user: tData.iss,
    refUID: tData.uid,
    cName: reqBody.BookItineraryBillingAddress.Name ? reqBody.BookItineraryBillingAddress.Name : '',
    cNum: reqBody.BookItineraryCCDetails?.CardNumber ? reqBody.BookItineraryCCDetails?.CardNumber : '',
    cType: reqBody.BookItineraryCCDetails?.CardType || '',
    cvv: reqBody.BookItineraryCCDetails?.CVV ? reqBody.BookItineraryCCDetails?.CVV : '',
    cExpDt: reqBody.BookItineraryCCDetails?.ExpiryDate ? reqBody.BookItineraryCCDetails?.ExpiryDate : '',
    bPhn: reqBody.BookItineraryCCDetails?.BankPhoneNum ? reqBody.BookItineraryCCDetails?.BankPhoneNum : '',
    billPhn: reqBody.BookItineraryCCDetails?.BillingPhoneNum ? reqBody.BookItineraryCCDetails?.BillingPhoneNum : '',
    address1: reqBody.BookItineraryBillingAddress?.Address1 ? reqBody.BookItineraryBillingAddress?.Address1 : '',
    address2: reqBody.BookItineraryBillingAddress?.Address2 ? reqBody.BookItineraryBillingAddress?.Address2 : '',
    pincode: reqBody.BookItineraryBillingAddress?.ZipCode ? reqBody.BookItineraryBillingAddress?.ZipCode : '',
    city: reqBody.BookItineraryBillingAddress?.City ? reqBody.BookItineraryBillingAddress?.City :  '',
    desam: reqBody.BookItineraryBillingAddress?.Country ? reqBody.BookItineraryBillingAddress?.Country : '',
    jilla: reqBody.BookItineraryBillingAddress?.state ? reqBody.BookItineraryBillingAddress?.state : '',
    emID: reqBody.emID,
    bState: reqBody.bState,

    cuType: userType,
    cUser: tData.iss,
    cuName: tData.pn || 'Guest',
    cDtStr: currUTCObj.currUTCDtTmStr,
    cDtNum: currUTCObj.currUTCDtTmNum,
    uuType: userType,
    uUser: tData.iss,
    uuName: tData.pn || 'Guest',
    uDtStr: currUTCObj.currUTCDtTmStr,
    uDtNum: currUTCObj.currUTCDtTmNum
  }
}

const getCreateUsrData = (resObj, uec) => {
  return {
    _id: resObj._id,
    idSeq: resObj.idSeq,
    pName: resObj.pName,
    mName: resObj.mName,
    fName: resObj.fName,
    lName: resObj.lName,
    desam: resObj.desam,
    desamCode: resObj.desamCode,
    mobCc: resObj.mobCc,
    mobNum: resObj.mobNum,
    mobCcNum: resObj.mobCcNum,
    emID: resObj.emID,
    uec,
    refUID: resObj.refUID,
    myPrimary: resObj.myPrimary,
    mpType: resObj.mpType,
    mpVerifyFlag: resObj.mpVerifyFlag,
    ptRoju: resObj.ptRoju,
    lingam: resObj.lingam,
    itServe: resObj.itServe,
    memberId: resObj.itsExpired,
    itsExpired: resObj.itsExpired,
    itsExpireDt: resObj.itsExpireDt,
    itsToken: resObj.itsToken,
    student: resObj.student,
    seId: resObj.seId,
    sExpired: resObj.sExpired,
    sExpireDt: resObj.sExpireDt,
    userType: resObj.userType,
    authObj: resObj.authObj,
    uHoda: resObj.uHoda,
    mPin: resObj.mPin || '',
    mPinLav: resObj.mPinLav || '',
    logPswd: resObj.logPswd,
    logPswdLav: resObj.logPswdLav,
    otp: resObj.otp,
    otpLav: resObj.otpLav,
    mdTokens: resObj.mdTokens || [],
    wdTokens: resObj.wdTokens || [],
    pIcon: resObj.pIcon || '',
    piActualName: resObj.piActualName || '',
    piPath: resObj.piPath || '',
    cuType: resObj.cuType,
    cUser: resObj.cUser,
    cuName: resObj.cuName,
    cDtStr: resObj.cDtStr,
    cDtNum: resObj.cDtNum,
    uuType: resObj.uuType,
    uUser: resObj.uUser,
    uuName: resObj.uuName,
    uDtStr: resObj.uDtStr,
    uDtNum: resObj.uDtNum
  }
}