/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var conf = require('./configuration');

var responseObj = {
    status: '200',
    message: 'Success',
    resData: {}
};

exports.sendApiResponse = (response, resObj) => {
    responseObj.status = resObj.status;
    responseObj.message = conf.get(resObj.status);
    if (resObj.resData != null || !resObj.resData) {
        responseObj.resData = resObj.resData;
    } else {
        responseObj.resData = {};
    }
    response.status(resObj.httpStatus).send(responseObj);
};

