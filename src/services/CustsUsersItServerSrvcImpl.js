/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');

const ApiCalls = require('../ApiCalls');
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
const CustsItServeDaoImpl = require('../daosimplements/CustsItServeDaoImpl');
const CustomersUsersDao = require('../daos/CustomersUsersDao');
const CustsUsersInfos = require('../schemas/CustsUsersInfos');
const CustsUsersSsns = require('../schemas/CustsUsrsSsns');
const tokens = require('../tokens');
const SetRes = require('../SetRes');

const eidArr = [CustsUsersAm, CustsUsersAz, CustsUsersBm, CustsUsersBz, CustsUsersC, CustsUsersD, CustsUsersE, CustsUsersF, CustsUsersG, CustsUsersH, CustsUsersJm, CustsUsersJz, CustsUsersKm, CustsUsersKz, CustsUsersL, CustsUsersMm, CustsUsersMz, CustsUsersNo, CustsUsersP, CustsUsersR, CustsUsersSm, CustsUsersSz, CustsUsersT, CustsUsersW, CustsUsersIquvxyz, CustsUsersNum, CustsUsers];

const updateItserve = (itsUsr, digest, usrData, query, token, deviceInfo, callback) => {
  const updateUserData = CustsItServeDaoImpl.UpdateItserveData(itsUsr, usrData, token);
  CustomersUsersDao.updateUserData(query, updateUserData, updRes => {
    if (updRes.status == '200') {
      CustomersUsersDao.updateUserDataByEid(query, digest.eid, updateUserData, resObj => {
        if(resObj.status === '200') {
          setAuthObData(digest.eid, resObj.resData.result, deviceInfo, digest.res, callback);
        } else callback(resObj);
      });
    } else callback(updRes);
  });
}

const createItserve = (itsUsr, digest, reqBody, token, deviceInfo, callback) => {
  const itsrvData = CustsItServeDaoImpl.setItserveData(itsUsr, reqBody, token);
  const data = new CustsUsers(itsrvData);
  CustomersUsersDao.commonCreateFunc(data, (resObj) => {
    if (resObj.status == '200') {
      const authObj = CustsItServeDaoImpl.setSignUpAuthObj();
      const usrObj = new eidArr[reqBody.eid]({...itsrvData, authObj});
      CustomersUsersDao.commonCreateFunc(usrObj, (usrRes) => {
        if(usrRes.status == '200') {
          const crtUserInfo = CustsItServeDaoImpl.setUserInfoData(usrRes.resData.result);
          const crtData = new CustsUsersInfos(crtUserInfo);
          CustomersUsersDao.commonCreateFunc(crtData, (resObj2) => {
            ssnTokenGeneration(reqBody.eid, authObj[0], JSON.stringify(usrRes.resData.result), deviceInfo, digest.res, callback);
          });
        } else callback(usrRes);
      });
    } else callback(resObj);
  });
}

module.exports = {
  updateItserve, createItserve
};

const setAuthObData = (eid, usrObj, deviceInfo, res, callback) => {
  const qry = CustsItServeDaoImpl.userTknQry(usrObj._id);
  if (usrObj.authObj?.length == 5) {
    const cDtStr = usrObj.authObj.reduce((min, p) => p.cDtStr < min ? p.cDtStr : min, usrObj.authObj[0].cDtStr);
    const authUpdObj = CustsItServeDaoImpl.pullAuthData(cDtStr);
    CustomersUsersDao.updateUserDataByEid(qry, eid, authUpdObj, updRes => {
      if (updRes.status == '200') {
        userTokenGeneration(qry, eid, deviceInfo, res, callback);
      } else callback(SetRes.unKnownErr({}));
    });
  } else {
    userTokenGeneration(qry, eid, deviceInfo, res, callback);
  }
}
const userTokenGeneration = (qry, eid, deviceInfo, res, callback) => {
  const authUpdObj = CustsItServeDaoImpl.setItserveAuthObj();
  CustomersUsersDao.updateUserDataByEid(qry, eid, authUpdObj, resObj => {
    if (resObj.status == '200') {
      const usrData = JSON.stringify(resObj.resData.result);
      const usrData1 = JSON.parse(usrData);
      const userObj = {...usrData1, discp: config.iPer, showAll: true};
      const tokenUserData = {uc: eid, sk: authUpdObj.$push.authObj._id};
      tokens.custTokenGeneration(userObj, tokenUserData, res, token => {
        if (token) {
          const uObj = CustsItServeDaoImpl.setCustUsrData(userObj);
          callback(SetRes.responseData(uObj));

          ApiCalls.getCurrentLocation(deviceInfo.ip, lres => {
            const usrSsnData = CustsItServeDaoImpl.setUserSSnData(userObj, lres, tokenUserData.sk, deviceInfo);
            const usrSSnObj = new CustsUsersSsns(usrSsnData);
            CustomersUsersDao.commonCreateFunc(usrSSnObj, (resObj2) => {});
          });
        } else callback(SetRes.unKnownErr({}));
      });
    } else callback(SetRes.unKnownErr({}));
  });
}

const ssnTokenGeneration = (eid, authObj, urObj, deviceInfo, res, callback) => {
  const usrObj = JSON.parse(urObj);
  const userObj = {...usrObj, discp: config.iPer, showAll: true};
  const tokenUserData = {uc: eid, sk: authObj._id};
  tokens.custTokenGeneration(userObj, tokenUserData, res, token => {
    if (token) {
      const uObj = CustsItServeDaoImpl.setCustUsrData(userObj);
      callback(SetRes.responseData(uObj));

      ApiCalls.getCurrentLocation(deviceInfo.ip, lres => {
        const usrSsnData = CustsItServeDaoImpl.setUserSSnData(userObj, lres, tokenUserData.sk, deviceInfo);
        const usrSSnObj = new CustsUsersSsns(usrSsnData);
        CustomersUsersDao.commonCreateFunc(usrSSnObj, (resObj) => {});
      });
    } else callback(SetRes.unKnownErr({}));
  });
}
