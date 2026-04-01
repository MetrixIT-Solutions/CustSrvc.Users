/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var fs = require('fs');
var multer = require('multer');

const logger = require('../lib/logger');
const tokens = require('../tokens');
const util = require('../lib/util');
const CommonSrvc = require('../services/CommonSrvc');
const cupCtrlVldns = require('./Vldns/CustsUsersProfileCtrlVldns');
const tVldns = require('./Vldns/TokenVldns');
const cupSrvc = require('../services/CustsUsersProfileSrvc');

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dtData = tokens.custUserTokenDecode(req.headers.inf365atoken);
    const currentUTC = CommonSrvc.currUTCObj();
    const uplLoc = 'assets/files/profiles/' + (dtData?.tokenData?.uid ? dtData.tokenData.uid : currentUTC.currUTCDtTmNum);
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    callback(null, uplLoc);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage }).single('profile');

const custsUserProfileUpdate = (req, res) => {
  const vldRes = cupCtrlVldns.custsUserProfileUpdateVldns(req);
  if (vldRes.isTrue) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tRes = tVldns.tknVldn(tData);
      if (tRes.isTrue) {
        cupSrvc.custsUserProfileUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else {
        util.sendApiResponse(res, tRes.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const profilePicUpdate = (req, res, next) => {
  upload(req, res, (err) => {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, dtData => {
      const tokenValidation = tVldns.tknVldn(dtData);
      if (tokenValidation.isTrue) {
        const type = req.params.type;
        if (req.file && type == 'pic-update') {
          const currentUTC = CommonSrvc.currUTCObj();
          var fd = req.file.destination;
          var fileExt = req.file.filename.split('.');
          var fileName = currentUTC.currUTCDtTmNum + (fileExt.length > 1 ? '.' + fileExt[fileExt.length - 1] : '');
          var fileLoc = fd + '/' + fileName;
          fs.rename(fd + '/' + req.file.filename, fileLoc, (err) => {
            if (!err) {
              cupSrvc.updateProfileBackgroundPic(fileLoc, req.file.filename, fileName, dtData.tokenData, (resObj) => {
                util.sendApiResponse(res, resObj);
              });
            } else {
              fs.unlink(fd + '/' + req.file.filename, (error) => logger.error('Unknown Error at ProfileCtrl.js - profilePicUpdate:' + error));
              const data = SetRes.updateFailed();
              util.sendApiResponse(res, data);
            }
          });
        } else if(type == 'pic-delete') {
          cupSrvc.deleteProfileBackgroundPic(dtData, (resObj) => util.sendApiResponse(res, resObj));
        } else {
          const data = SetRes.updateFailed();
          util.sendApiResponse(res, data);
        }
      } else {
        util.sendApiResponse(res, tokenValidation.result);
      }
    });
  });
}

const custCardCreate = (req, res, next) => {
  // const vldRes = CustomersUsersCntrlrVldns.custCardCreate(req);
  // if (vldRes.isTrue) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        cupSrvc.custCardCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else {
        util.sendApiResponse(res, tknVldn.result);
      }
    });
  // } else {
  //   util.sendApiResponse(res, vldRes.result);
  // }

}

const custPassWordUpdate = (req, res, next) => {
  const reqEditValid = cupCtrlVldns.passwordChangeVldtns(req);
  if (reqEditValid.flag) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        cupSrvc.custUserPwsdChange(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else {
        util.sendApiResponse(res, tknVldn.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const custLoginProfileUser = (req, res, next) => {
  const headers = cupCtrlVldns.headersoTkenData(req);
  if (headers.flag) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        cupSrvc.custUserLoginUserId(tData.tokenData, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else {
        const bResObj = tknVldn.result;
        util.sendApiResponse(res, bResObj);
      }

  });
  } else {
    const valResObj = headers.result;
    util.sendApiResponse(res, valResObj);
  }
}

const custsCustUsrPrmrySOTP = (req, res) => {
  const vldRes = cupCtrlVldns.sendLoginOtp(req);
  if (vldRes.isTrue) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => {
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        cupSrvc.custsCustUsrPrmrySOTP(req.body, tData.tokenData, res, (resObj) => {
          util.sendApiResponse(res, resObj);
        });
      } else {
        util.sendApiResponse(res, tknVldn.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const custsCustLoginUpdVerOTP = (req, res) => {
  const vldRes = cupCtrlVldns.otpValdn(req);
  if (vldRes.isTrue) {
    tokens.custUserRefreshToken(req.headers.inf365atoken, res, tData => { 
      const tknVldn = tVldns.tknVldn(tData);
      if (tknVldn.isTrue) {
        cupSrvc.loginOtpVerify(req, res, tData.tokenData, (resObj) => {
            util.sendApiResponse(res, resObj);
          });
      } else {
        util.sendApiResponse(res, tknVldn.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const custsCustUserSsn = (req, res) => {
  cupSrvc.custsCustUserSsn(req.body, (resObj) => {
    util.sendApiResponse(res, resObj);
  });
}

module.exports = {
  custsUserProfileUpdate, profilePicUpdate, custPassWordUpdate, custLoginProfileUser, custCardCreate, custsCustUsrPrmrySOTP, custsCustLoginUpdVerOTP,
  custsCustUserSsn
};
