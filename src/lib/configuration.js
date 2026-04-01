/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

var conf = require('nconf');
conf.argv().env();

conf.update = function() {
    conf.file('src/statuses.json');
    return;
};

conf.update();

module.exports = conf;
