/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var mkpath = require('mkpath');
var winston = require('winston');
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

var customFormat = function(options) {
    // Return string will be passed to logger.
    return options.timestamp()+' | '+options.level.toUpperCase()+' | '
        +(undefined !== options.message ? options.message : '')
        +(options.meta && Object.keys(options.meta).length ? ' '+JSON.stringify(options.meta) : '' );
};

var dirctoryPath = 'logs/';
mkpath(dirctoryPath, function(err) {
    if (err)
        throw err;
});
mkpath.sync(dirctoryPath, 0700);

var logger = winston.createLogger({
    transports: [
        new (winston.transports.DailyRotateFile)({
            name: config.logName,
            filename: config.logFilesPath,
            datePattern: config.logDtPattern,
            level: config.logFilesLevel,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            timestamp: function() {
                return (new Date().toUTCString());
            },
            formatter: customFormat
        })
    ],
    exitOnError: false
});

logger.setMaxListeners(0);

module.exports=logger;
