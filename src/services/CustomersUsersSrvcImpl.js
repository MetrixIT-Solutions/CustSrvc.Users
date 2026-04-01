/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
const ApiCalls = require('../ApiCalls');
const CustsGstsClsd = require('../schemas/CustsGstsClsd');
const CustsGstsSsnsClsd = require('../schemas/CustsGstsSsnsClsd');
const CustsUsersSsns = require('../schemas/CustsUsrsSsns');
const CustsUsersInfos = require('../schemas/CustsUsersInfos');
const CustsUsers = require('../schemas/CustsUsers');
const CustomersUsersDao = require('../daos/CustomersUsersDao');
const CustomersUsersDaoImpl = require('../daosimplements/CustomersUsersDaoImpl');
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
const CommonSrvc = require('../services/CommonSrvc');
const SetRes = require('../SetRes');
const sendMail = require('../../config/mail');
const tokens = require('../tokens');
const logger = require('../lib/logger');

const signInSub = 'IndiFly365 Sign-In OTP';
const fpSub = 'IndiFly365 Forgot Password OTP';
const signUpSub = 'IndiFly365 Email Verify OTP';

const mailSub1 = 'Welcome to IndiFly365 - Let`s Take Flight!';
const mailMsg00 = '<h3>Welcome to IndiFly365.</h3>';
const mailMsg01 = {sIn: ' is the OTP for sign into the application.', fp: ' is the OTP for Forgot Password rest verification.', sUp: ' is the OTP for SignUp Email verification.'};
const mailMsg02 = ' <p>OTP is valid for 10 mins. Do not share it with any one.</p> <h4> Do not reply, this is a system generated mail</h4>';
const ot = { login: 'Login', signup: 'Signup' };
const us = { active: 'Active', blocked: 'Blocked', hold: 'Hold', inactive: 'Inactive' };
const eidArr = [CustsUsersAm, CustsUsersAz, CustsUsersBm, CustsUsersBz, CustsUsersC, CustsUsersD, CustsUsersE, CustsUsersF, CustsUsersG, CustsUsersH, CustsUsersJm, CustsUsersJz, CustsUsersKm, CustsUsersKz, CustsUsersL, CustsUsersMm, CustsUsersMz, CustsUsersNo, CustsUsersP, CustsUsersR, CustsUsersSm, CustsUsersSz, CustsUsersT, CustsUsersW, CustsUsersIquvxyz, CustsUsersNum];

// ----- Login API Start ----- //
const validateUserStatus = (uObj) => {
  if (uObj.uHoda === us.active) {
    return { status: '200' };
  } else if (uObj.uHoda === us.blocked) {
    const bAcc = SetRes.accBlocked();
    return bAcc;
  } else if (uObj.uHoda === us.hold) {
    const hAcc = SetRes.accHold();
    return hAcc;
  } else if (uObj.uHoda === us.inactive) {
    const iaAcc = SetRes.accInactive();
    return iaAcc;
  } else {
    const invd = SetRes.invalidCredentials('Invalid credentials');
    return invd;
  }
}
const setCustUsrLoginRes = (uResObj, reqBody, deviceInfo, res, callback) => setAuthObData(reqBody?.eid, uResObj, deviceInfo, res, callback);

const updateUserOtpData = (uObj, eid, otpType, otpNum, res, callback) => {
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  const uOtpObj = CustomersUsersDaoImpl.setUserOtpObj(uObj, otpObj);
  CustomersUsersDao.updateUserDataByEid(uOtpObj.query, eid, uOtpObj.updateObj, (uResObj) => {
    if (uResObj.status == '200') {
      sendOtp(uResObj.resData.result, otpNum, otpType, res, callback);
    } else callback(uResObj);
  });
}
const verifyLoginOtp = (urObj, reqBody, deviceInfo, res, callback) => {
  const uResObj = JSON.parse(urObj);
  const otpObj = CommonSrvc.encryptStr(reqBody.otpNum, uResObj.otpLav);
  if (uResObj.otp === otpObj.strHash) {
    const userObj = (!uResObj.refUID.includes('itserve') && uResObj.itServe) ? {...uResObj, userType: 'Regular', itServe: false} : (uResObj.refUID.includes('itserve') && uResObj.itServe ? {...uResObj, discp: config.iPer, showAll: true} : uResObj);
    setAuthObData(reqBody?.eid, userObj, deviceInfo, res, callback);
  } else {
    const invOtp = SetRes.invalidOtp();
    callback(invOtp);
  }
}
// ----- Login API End ----- //

const updateGuestUserOtpData = (reqBody, tData, otpNum, res, callback) => {
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  const uOtpObj = CustomersUsersDaoImpl.setCustsGuestUserOtpObj(tData, otpObj, reqBody);
  CustomersUsersDao.updateCustGuestData(uOtpObj.query, uOtpObj.updateObj, (uResObj) => {
    if (uResObj.status == '200') {
      sendOtp(uResObj.resData.result, otpNum, ot.signup, res, callback);
    } else if(uResObj.status == '195') {
      const createObj = CustomersUsersDaoImpl.custsGuestCreateSendOtp(otpObj, reqBody);
      const createData = new CustsGsts(createObj);
      CustomersUsersDao.commonCreateFunc(createData, (resObj) => {
        if(resObj.status == '200') {
          sendOtp(resObj.resData.result, otpNum, ot.signup, res, callback);
        } else callback(resObj);
      });
    } else callback(uResObj);
  });
}
const updateUserGuestData = (userObj, otpNum, res, callback) => {
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  const uOtpObj = CustomersUsersDaoImpl.setUserOtpObj(userObj, otpObj);
  CustomersUsersDao.updateUserData(uOtpObj.query, uOtpObj.updateObj, (uResObj) => {
    if (uResObj.status == '200') {
      sendOtp(uResObj.resData.result, otpNum, ot.signup, res, callback);
    } else {
      callback(uResObj);
    }
  });
}

const setUserDataByColln = (uResObj, reqBody, res, deviceInfo, cb) => {
  const resObj = JSON.parse(uResObj);
  const userObj = CustomersUsersDaoImpl.setUserDataByColln(resObj, reqBody);
  const data = new eidArr[resObj.uec](userObj);
  CustomersUsersDao.commonCreateFunc(data, resObj1 => {
    if(resObj1.status == '200') {
      const ucsk = {uc: resObj.uec, sk: userObj.authObj[0]._id};
      tokens.custTokenGeneration(resObj, ucsk, res, atoken => {
        if (atoken) {
          createUserSession(resObj, deviceInfo, userObj.authObj[0]._id);
          setUserInfoData(resObj, cb);
        } else cb(SetRes.unKnownErr({}));
      });
    } else cb(resObj1);
  });
}
const deleteGuestData = (gustData) => {
  if(gustData._id) {
    const qry = CustomersUsersDaoImpl.userTknQry(gustData._id);
    CustomersUsersDao.deleteCustGuest(qry, delResObj => {
      if(delResObj.status == '200') {
        const guestClsd = CustomersUsersDaoImpl.setCustsGstsClsd(gustData);
        const guestCldData = new CustsGstsClsd(guestClsd);
        CustomersUsersDao.commonCreateFunc(guestCldData, resObj => { });
        deleteCustGuestSession(gustData);
      }
    });
  }
}
const creatCustomereUser = (reqBody, res, deviceInfo, cb) => {
  userDataCreate(reqBody, res, deviceInfo, cb);
}

module.exports = {
  validateUserStatus, setCustUsrLoginRes, updateUserOtpData, verifyLoginOtp,
  updateGuestUserOtpData, updateUserGuestData, setUserDataByColln, deleteGuestData, creatCustomereUser
};

// ----- Login API Start ----- //
const setAuthObData = (eid, usrObj, deviceInfo, res, callback) => {
  eid = (eid >= 0 && eid < 26) ? eid : 25;
  const qry = CustomersUsersDaoImpl.userTknQry(usrObj._id);
  if (usrObj.authObj?.length == 5) {
    const cDtStr = usrObj.authObj.reduce((min, p) => p.cDtStr < min ? p.cDtStr : min, usrObj.authObj[0].cDtStr);
    const authIdObj = usrObj.authObj.find(item => item.cDtStr == cDtStr);
    const authUpdObj = CustomersUsersDaoImpl.pullAuthData(authIdObj._id);
    CustomersUsersDao.updateUserDataByEid(qry, eid, authUpdObj, updRes => {
      if (updRes.status == '200') {
        userTokenGeneration(qry, usrObj, eid, deviceInfo, res, callback);
      } else callback(SetRes.unKnownErr({}));
    });
  } else userTokenGeneration(qry, usrObj, eid, deviceInfo, res, callback);
}
const userTokenGeneration = (qry, usrObj, eid, deviceInfo, res, callback) => {
  const authUpdObj = CustomersUsersDaoImpl.setAuthObj();
  CustomersUsersDao.updateUserDataByEid(qry, eid, authUpdObj, resObj => {
    if (resObj.status == '200') {
      const tokenUserData = {uc: eid, sk: authUpdObj.$push.authObj._id};
      tokens.custTokenGeneration(usrObj, tokenUserData, res, token => {
        if (token) {
          const uObj = CustomersUsersDaoImpl.setCustUsrData(resObj.resData.result);
          callback(SetRes.responseData(uObj));
          createUserSession(resObj.resData.result, deviceInfo, tokenUserData.sk);
        } else callback(SetRes.unKnownErr({}));
      });
    } else callback(SetRes.unKnownErr({}));
  });
}
const createUserSession = (userObj, deviceInfo, atoken) => {
  ApiCalls.getCurrentLocation(deviceInfo.ip, lres => {
    const usrSsnData = CustomersUsersDaoImpl.setUsrSsnData(userObj, lres, atoken, deviceInfo);
    const usrSSnObj = new CustsUsersSsns(usrSsnData);
    CustomersUsersDao.commonCreateFunc(usrSSnObj, (resObj) => {});
  });
}

const sendOtp = (uResObj, otpNum, otpType, res, callback) => {
  const otpToken = tokens.otpTokenGeneration(uResObj, otpType, 'Not Verified', res);
  if (otpToken) {
    const mp = uResObj.myPrimary;
    sendOtpToEmail(mp, otpNum, otpType);
    // console.log(mp, '===Login otpNumber:', otpNum);
    logger.error(mp + '===Login otpNumber:' + otpNum);
    const resObj = SetRes.otpSentSuc();
    callback(resObj);
  } else {
    const uke = SetRes.unKnownErr({});
    callback(uke);
  }
}

const sendOtpToEmail = (email, otpNumber, otpType) => {
  const mailSub = (otpType == ot.login) ? signInSub : (otpType == ot.signup ? signUpSub : fpSub);
  const mailMsg = (otpType == ot.login) ? mailMsg01.sIn : (otpType == ot.signup ? mailMsg01.sUp : mailMsg01.fp);
  sendMail.sendEMail(email, mailSub, `${mailMsg00}${'<p>' + otpNumber}${mailMsg}${mailMsg02}`, (resObj) => { });
}
// ----- Login API End ----- //

const deleteCustGuestSession = (gustData) => {
  const qry = CustomersUsersDaoImpl.gstUsrSsnQry(gustData);
  CustomersUsersDao.getCustGstSsnData(qry, resObj => {
    const ssnData = resObj.resData.result;
    CustomersUsersDao.deleteCustGuestSession(qry, ssnRes => {
      if (ssnRes.status == '200') {
        if(ssnData._id) {
          const gSsnData = CustomersUsersDaoImpl.setGstSsnClsdData(ssnData);
          const ssnCldData = new CustsGstsSsnsClsd(gSsnData);
          CustomersUsersDao.commonCreateFunc(ssnCldData, rObj => { });
        }
      }
    });
  });
}
const userDataCreate = (reqBody, res, deviceInfo, cb) => {
  const userObj = CustomersUsersDaoImpl.setUserData(reqBody);
  const userData = new CustsUsers(userObj);
  CustomersUsersDao.commonCreateFunc(userData, resObj => {
    if (resObj.status == '200') {
      const authObj = CustomersUsersDaoImpl.setSignUpAuthObj();
      const data = new eidArr[userObj.uec]({...userObj, authObj});
      CustomersUsersDao.commonCreateFunc(data, uResObj => {
        if(uResObj.status == '200') {
          const ucsk = {uc: userObj.uec, sk: authObj[0]._id};
          tokens.custTokenGeneration(resObj.resData.result, ucsk, res, atoken => {
            if(atoken) {
              createUserSession(userObj, deviceInfo, authObj[0]._id);
              setUserInfoData(userObj, cb);
            } else cb(SetRes.unKnownErr({}));
          });
        } else cb(uResObj);
      });
    } else cb(resObj);
  });
}

const setUserInfoData = (resObj, cb) => {
  const uObj = CustomersUsersDaoImpl.setCustUsrData(resObj);
  const re = SetRes.responseData(uObj);
  const userInfoObj = CustomersUsersDaoImpl.setUserInfoData(resObj);
  const userInfo = new CustsUsersInfos(userInfoObj);
  CustomersUsersDao.commonCreateFunc(userInfo, (resObj1) => {});
  cb(re);
  const name = uObj.fName;
  SendMsgToMail(uObj.emID, name);
}
const SendMsgToMail = (email, name) => {
  const html = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <title></title>

    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row { width: 600px !important; }
        .u-row .u-col { vertical-align: top; }
        .u-row .u-col-100 { width: 600px !important; }
      }

      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row { width: 100% !important; }
        .u-col { width: 100% !important; }
        .u-col>div { margin: 0 auto; }
      }

      body {
        margin: 0;
        padding: 0;
      }

      table, tr, td {
        vertical-align: top;
        border-collapse: collapse;
      }

      p { margin: 0; }

      .ie-container table, .mso-container table {
        table-layout: fixed;
      }

      * { line-height: inherit; }

      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }

      table, td { color: #000000; }

      #u_body a {
        color: #0000ee;
        text-decoration: underline;
      }
    </style>

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
    <!--<![endif]-->
  </head>

  <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
        <tr style="vertical-align: top">
          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->

            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                        <table style="font-family:'Cabin',sans-serif; background-color: #0067b4;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">

                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                      <a href="${config.uiDomain}" target="_blank" >
                                        <img align="center" border="0" src='${config.ailPathDomain}/imgs/indifly365-logo.png' alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;" width="179.2" />
                                      </a>
                                    </td>
                                  </tr>
                                </table>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                      <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">

                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                      <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;" width="150.8" />
                                    </td>
                                  </tr>
                                </table>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">

                                <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%;">
                                    <span style="font-size: 28px; line-height: 39.2px;">
                                      <strong><span style="line-height: 39.2px; font-size: 28px;">Welcome to IndiFly365 </span></strong>
                                    </span>
                                  </p>
                                </div>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                      <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">

                                <div style="font-size: 14px; line-height: 160%; word-wrap: break-word;">
                                  Dear ${name},
                                  <p>Welcome to IndiFly365! We're delighted to have you on board. Get ready to embark on a journey of hassle-free flight bookings and unforgettable adventures.
                                    Here's what you can expect from IndiFly365:</p>
                                    <strong>Effortless Booking: </strong> <p>Say goodbye to the complexities of flight reservations. We've designed our platform with simplicity in mind, making booking your next flight a breeze.</p>
                                    <strong>Best Deals in the Sky: </strong> <p>We're constantly searching for the best deals and discounts, so you can explore the world without breaking the bank.</p>
                                    <strong>Personalized Travel: </strong> <p>Whether you're a seasoned globetrotter or a first-time flyer, we've got options for every traveler. Your journey should reflect your unique style, and we're here to make that happen.</p>
                                    <strong>24/7 Support: </strong> <p>Questions or need assistance? Our dedicated support team is available around the clock to ensure your travel experience is smooth from start to finish.</p>
                                    <strong>Ready to Take Flight?</strong>
                                    <p>To start your journey with us, simply log in to your account using the credentials you provided during registration. Whether you're planning a spontaneous getaway or a meticulously planned adventure, IndiFly365 is here to make your travel dreams come true.</p>
                                    <strong>Stay Connected:</strong>
                                    <p>Don't miss out on travel inspiration, exclusive offers, and expert tips. Connect with us on social media and subscribe to our newsletter for the latest updates.
                                    We're thrilled to be your go-to travel companion. If you have any questions or need assistance, feel free to reach out to our support team at support@indifly365.com</p>
                                    <p>Once again, welcome to IndiFly365. Your next adventure awaits, and we're here to make it unforgettable.
                                    Bon voyage!
                                  </p>
                                  <p>Warm regards,</p>
                                  <p>Team Indifly</p>
                                </div>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:'Cabin',sans-serif;" align="left">

                                <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                  <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">Thanks,</span></p>
                                  <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">IndiFly365 Team</span></p>
                                </div>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                      <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e5eaf5;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:41px 55px 18px;font-family:'Cabin',sans-serif;" align="left">

                                <div style="font-size: 14px; color: #003399; line-height: 160%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 20px; line-height: 32px;"><strong>Get in touch</strong></span></p>
                                  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 16px; line-height: 25.6px; color: #000000;">+1 980-423-1332</span></p>
                                  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 16px; line-height: 25.6px; color: #000000;">info@indifly365.com</span></p>
                                </div>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 33px;font-family:'Cabin',sans-serif;" align="left">

                                <div align="center">
                                  <div style="display: table; max-width:244px;">
                                    <!--[if (mso)|(IE)]><table width="244" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:244px;"><tr><![endif]-->

                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 17px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://www.facebook.com/indifly365/" title="Facebook" target="_blank">
                                              <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 17px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://www.instagram.com/indifly_365/" title="Instagram" target="_blank">
                                              <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 17px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://www.linkedin.com/company/indifly365/" title="LinkedIn" target="_blank">
                                              <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/linkedin.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->  

                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                      <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                                <div style="font-size: 14px; color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Copyrights <a href="${config.uiDomain}" target="_blank" >© IndiFly365</a> All Rights Reserved</span></p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>

  </html>`;
  sendMail.sendEMail(email, mailSub1, html, (resObj1) => {});
}
