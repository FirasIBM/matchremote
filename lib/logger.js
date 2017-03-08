/*
 * Botter logger for logging connection information, errors
 * and user interactions
*/
'use strict'

const winston = require('winston');

/* Log file name */
const logFile = 'botter.log';

/* Define and configure logger */
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: logFile})
  ]
});

/* Default logging */
function log (level, msg){
  logger.log(level, msg);
}

/* Customised logging */
function logFormat(level, msg, format){
  logger.log(level,msg,format);
}

module.exports = {
  log : log,
  logFormat: logFormat
};
