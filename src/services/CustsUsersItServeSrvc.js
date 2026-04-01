/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */


const ApiCalls = require('../ApiCalls');
const CustsItServeDaoImpl = require('../daosimplements/CustsItServeDaoImpl');
const CustsUsersItServerSrvcImpl = require('../services/CustsUsersItServerSrvcImpl');
const CustomersUsersDao = require('../daos/CustomersUsersDao');
const SetRes = require('../SetRes');

const postCustUserItServeLogin = (digest, reqBody, deviceInfo,  callback) => {
  const itLoginReqBody = CustsItServeDaoImpl.setItserveReqBody(reqBody);
  ApiCalls.itServeLogin(itLoginReqBody, digest.pd, digest.ts, (lErr, resObj) => {
    if (resObj?.data?.value?.isUserVerified) {
      ApiCalls.getItserveData(digest.gd, digest.ts, resObj.data?.value.token, (uErr, itRes) => {
        if (itRes?.data?.value?.user?.verified) {
          const resData = itRes.data?.value?.user?.email;
          const query = CustsItServeDaoImpl.itserveQry(resData.value);
          const eid = (reqBody?.eid >= 0 && reqBody?.eid < 26) ? reqBody.eid : 25;
          CustomersUsersDao.getUserDataByEid(query, eid, usrRes => {
            if (usrRes.status == '200') {
              CustsUsersItServerSrvcImpl.updateItserve(itRes.data.value, {...digest, eid}, usrRes.resData.result, query, resObj.data.value.token, deviceInfo, callback);
            } else if (usrRes.status == '204') {
              CustsUsersItServerSrvcImpl.createItserve(itRes.data.value, digest, reqBody, resObj.data.value.token, deviceInfo, callback);
            } else callback(usrRes);
          });
        } else {
          const nf = SetRes.noData('User not found');
          callback(nf);
        }
      });
    } else {
      // let x = lErr.stack;
      // let y = x.replace(/[\/\\]/g, "..");
      // let stack = y.replace(/..home..ubuntu..prod..cust..custsrvc.users..node_modules/g, "");
      // const logErr = {message: lErr.message, name: lErr.name, stack, config: lErr.config};
      const nf = SetRes.noData({});
      callback(nf);
    }
  });
}

const postCustmerItserveSSn = (digest, reqBody, callback) => {
  ApiCalls.getItserveData(digest.gd, digest.ts, reqBody.token, (lErr, resObj) => {
    if (resObj?.data?.value?.user?.veritfied) {
      const sr = SetRes.responseData(resObj?.data);
      callback(sr);
    } else {
      const sr = SetRes.unKnownErr({});
      callback(sr);
    }
  });
}

module.exports = {
  postCustUserItServeLogin, postCustmerItserveSSn
};
