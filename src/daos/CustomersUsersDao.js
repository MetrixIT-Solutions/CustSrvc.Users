/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const CustsGsts = require('../schemas/CustsGsts');
const CustsGstsSsns = require('../schemas/CustsGstsSsns');
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
const CustsUsersInfos = require('../schemas/CustsUsersInfos');
const CustsUsrsSsns = require('../schemas/CustsUsrsSsns');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const eidArr = [CustsUsersAm, CustsUsersAz, CustsUsersBm, CustsUsersBz, CustsUsersC, CustsUsersD, CustsUsersE, CustsUsersF, CustsUsersG, CustsUsersH, CustsUsersJm, CustsUsersJz, CustsUsersKm, CustsUsersKz, CustsUsersL, CustsUsersMm, CustsUsersMz, CustsUsersNo, CustsUsersP, CustsUsersR, CustsUsersSm, CustsUsersSz, CustsUsersT, CustsUsersW, CustsUsersIquvxyz, CustsUsersNum, CustsUsers];

// ----- Login API Start ----- //
const getUserData = (query, callback) => {
  CustsUsers.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at getUserData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}
const getUserDataByEid = (query, eid = 25, callback) => {
  eidArr[eid].findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at getUserDataByEid:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const updateUserData = (query, updateObj, callback) => {
  CustsUsers.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at updateUserData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}
const updateUserDataByEid = (query, eid = 25, updateObj, callback) => {
  eidArr[eid].findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at updateUserDataByEid:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const commonCreateFunc = (data, callback) => {
  data.save().then(resObj => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}
// ----- Login API End ----- //

const getCustGstData = (obj, callback) => {
  CustsGsts.findOne(obj).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at getCustGstData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const deleteCustGuest = (obj, callback) => {
  CustsGsts.deleteOne(obj).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.deleteFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at deleteCustGuest:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const updateCustGuestData = (query, updateObj, callback) => {
  CustsGsts.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at updateCustGuestData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getuserInfo = (obj, callback) => {
  CustsUsersInfos.findOne(obj).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at getuserInfo:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getCustGstSsnData = (query, callback) => {
  CustsGstsSsns.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at getCustGstSsnData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getCustGuestSsnData = (obj, callback) => {
  CustsGstsSsns.findOne(obj).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at getCustGuestSsnData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}
const deleteCustGuestSession = (obj, callback) => {
  CustsGstsSsns.deleteOne(obj).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.deleteFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at deleteCustGuestSession:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const updateUserDetails = (query, updateObj, callback) => {
  CustsUsers.findOneAndUpdate(query, { $set: updateObj }, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.responseData(resObj);
      callback(resMsg);
    } else {
      const uf = SetRes.updateFailed();
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at updateUserDetails:' + error);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  });
}

const deleteUser = (obj, eid, callback) => {
  eidArr[eid].deleteOne(obj).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.deleteFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at deleteCustGuestSession:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const sessionDelete = (obj, callback) => {
  CustsUsrsSsns.findOneAndDelete(obj).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.responseData(resObj);
      callback(result);
    } else {
      const noData = SetRes.deleteFailed();
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustomersUsersDao.js, at sessionDelete:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  getUserData, getUserDataByEid, updateUserData, updateUserDataByEid, commonCreateFunc,
  getCustGstData, deleteCustGuest,
  updateCustGuestData, getCustGuestSsnData, deleteCustGuestSession, getCustGstSsnData,
  getuserInfo, updateUserDetails, deleteUser, sessionDelete
};
