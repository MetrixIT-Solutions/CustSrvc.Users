/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const moment = require('moment');
const config = require('config');

const ApiCalls = require('../ApiCalls');
const CustsUsrsContacts = require('../schemas/CustsUsrsContacts');
const CustsUsrsFeedbacks = require('../schemas/CustsUsrsFeedbacks');
const CustomerFeedBckDaoImpl = require('../daosimplements/CustomerFeedBckDaoImpl');
const CustomerFeedBckDao = require('../daos/CustomerFeedBckDao');
const CustUsrDao = require('../daos/CustomersUsersDao');
const CustsUsers = require('../schemas/CustsUsers');
const CustsUsersAm = require('../schemas/CustsUsersAm');
const CustsUsersAz = require('../schemas/CustsUsersAz');
const CustsUsersBm = require('../schemas/CustsUsersBm');
const CustsUsersBz = require('../schemas/CustsUsersBz');
const CustsUsersC = require('../schemas/CustsUsersC');
const CustsUsersD = require('../schemas/CustsUsersD');
const CustsUsersE = require('../schemas/CustsUsersE');
const CustsUsersF = require('../schemas/CustsUsersF');
const CustsUsersG = require('../schemas/CustsUsersG');
const CustsUsersH = require('../schemas/CustsUsersH');
const CustsUsersJm = require('../schemas/CustsUsersJm');
const CustsUsersJz = require('../schemas/CustsUsersJz');
const CustsUsersKm = require('../schemas/CustsUsersKm');
const CustsUsersKz = require('../schemas/CustsUsersKz');
const CustsUsersL = require('../schemas/CustsUsersL');
const CustsUsersMm = require('../schemas/CustsUsersMm');
const CustsUsersMz = require('../schemas/CustsUsersMz');
const CustsUsersNo = require('../schemas/CustsUsersNo');
const CustsUsersP = require('../schemas/CustsUsersP');
const CustsUsersR = require('../schemas/CustsUsersR');
const CustsUsersSm = require('../schemas/CustsUsersSm');
const CustsUsersSz = require('../schemas/CustsUsersSz');
const CustsUsersT = require('../schemas/CustsUsersT');
const CustsUsersW = require('../schemas/CustsUsersW');
const CustsUsersIquvxyz = require('../schemas/CustsUsersIquvxyz');
const CustsUsersNum = require('../schemas/CustsUsersNum');

const sendMail = require('../../config/mail');

const CustUserFeedBackCreate = (reqBody, tData, callback) => {
  const obj = CustomerFeedBckDaoImpl.setCustFeedBckData(reqBody, tData);
  const data  = new CustsUsrsFeedbacks(obj);
  CustomerFeedBckDao.createCustFeedBckCreate(data, callback);
}

const CustUserContactUsCreate = (reqBody, tData, deviceInfo, callback) => {
  if (tData.iss) {
    setContactUs(reqBody, tData, deviceInfo, callback);
  } else {
    const qry = CustomerFeedBckDaoImpl.usrEIdQry(reqBody.emID.toLowerCase());
    CustUsrDao.getUserData(qry, resObj => {
      if (resObj.status == '200') {
        const usrData = resObj.resData.result;
        const tknData = {iss: usrData._id, uid: usrData.refUID, ut: usrData.userType, pn: usrData.pName};
        setContactUs(reqBody, tknData, deviceInfo, callback);
      } else if (resObj.status == '204') {
        const crtUser = CustomerFeedBckDaoImpl.setUserData(reqBody);
        const crtObj = new CustsUsers(crtUser);
        CustUsrDao.commonCreateFunc(crtObj, resObj1 => {
          if (resObj1.status == '200') {
            const eidArr = [CustsUsersAm, CustsUsersAz, CustsUsersBm, CustsUsersBz, CustsUsersC, CustsUsersD, CustsUsersE, CustsUsersF, CustsUsersG, CustsUsersH, CustsUsersJm, CustsUsersJz, CustsUsersKm, CustsUsersKz, CustsUsersL, CustsUsersMm, CustsUsersMz, CustsUsersNo, CustsUsersP, CustsUsersR, CustsUsersSm, CustsUsersSz, CustsUsersT, CustsUsersW, CustsUsersIquvxyz, CustsUsersNum ];
            const crtObj1 = new eidArr[reqBody.eid](crtUser);
            CustUsrDao.commonCreateFunc(crtObj1, resObj2 => {});
            const tknData1 = {iss: resObj1.resData.result._id, uid: resObj1.resData.result.refUID, ut: resObj1.resData.result.userType, pn: resObj1.resData.result.pName};
            setContactUs(reqBody, tknData1, deviceInfo, callback)
          } else {
            callback(resObj1);
          }
        })
      } else {
        callback(resObj);
      }
    })
  }
}

module.exports = {
  CustUserFeedBackCreate, CustUserContactUsCreate
}

const setContactUs = (reqBody, tData, deviceInfo, callback) => {
  ApiCalls.getCurrentLocation(deviceInfo.ip, lres => {
    const obj = CustomerFeedBckDaoImpl.CustUserContactUsCreate(reqBody, deviceInfo, lres, tData);
    const data  = new CustsUsrsContacts(obj);
    CustomerFeedBckDao.createCustFeedBckCreate(data, callback);
    
    let nm = `<p>Name: <b>${obj.name}</b></p>`
    let em = `<p>Email: <b>${obj.emID}</b></p>`
    let mb = `<p>Mobie #: <b>${obj.mobCc + obj.mobNum}</b></p>`
    let en = `<p>Enquiry: <b>${obj.enquiry}</b></p>`
    let pn =`<p>PNR: <b>${obj.pnrNo}</b></p>`
    let ns =`<p>Message: <b>${obj.notes}</b></p>`
    const date = moment().format('YYYYMMDD');
    const mailSub = `IndiFly365 - ContactUs - ${date}`;
    const mailMsg00 = '<p>Dear Team,</p>';
    const mailMsg011 = '<p>Please find the following contact details: </b></p>';
    let htmlContent = `${nm} ${em} ${mb} ${en} ${pn} ${ns}`;
    sendMail.sendEMail(config.indflySprtMail, `${mailSub}`, `${mailMsg00}${mailMsg011}${htmlContent}` , (resObj) => { });
  });
}
