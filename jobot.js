/* 
 * An AI chatbot backend for Botter. Uses real-time
 * connection to handle and process API.AI message
*/
'use strict'

const logger  = require('./lib/logger');
const configs = require('./lib/configs');
const express = require('express');
const io      = require('socket.io');
const path    = require('path');
const apiai   = require('apiai');
const app     = express();
const myJobs  = require('./lib/jobs');


/* Set API.AI client access token */
var apiAIClient = apiai(configs.CLIENTTOKEN);

/* Configure routing to serve static files */
app.use(express.static(path.join(__dirname, configs.FOLDER)));

/* Bind IO socket and start listening */
var ioSocket = io.listen(app.listen(process.env.PORT || configs.PORT));

/* Handle Socket.io events */
ioSocket.on('connection', function(socket){
  logger.log('info', 'Connection established with a user');

  socket.on('clientMsg', function(from, msg){
    logger.log('info', 'client message. name: ' + from + ', msg: ' + msg);
    ioSocket.emit('notifyTyping', configs.HOSTNAME);
    botHandler(from, msg);
  });
  
  socket.on('clientJoined', function(userName){
    logger.log('info', 'User ' + userName + ' joined botter chat');
    ioSocket.emit('botMsg', configs.HOSTNAME, configs.GREETING); 
//    console.log(myJobs.getJobs());
    ioSocket.emit('allJobs', myJobs.getJSONJobs());
    console.log('Got jobs from server');
  });

  socket.on('error', function(err){
    logger.log('error', 'System error: ' + err);
//    ioSocket.emit('SysErr', configs.SYSTEM, "Well this is embarassing! An error occurred within <b>RemoteMatch</b>");
  });
});


/* Process a user message and sends the responds back to the user */
function botHandler(from, msg){
  // Options for processing API.AI requests
  var options = {
    sessionId: configs.SESSIONID
  };
  
  var request = apiAIClient.textRequest(msg, options);

  request.on('response', function(res){
    var botMsg = getBotFulfillment(res);
    ioSocket.emit('botMsg', configs.HOSTNAME, botMsg);
    actionDispatch(res);
    logger.log('info', 'Matcher message. name: ' + configs.HOSTNAME + ', msg: ' + botMsg);
  });

  request.on('error', function(err){
    logger.log('error', 'API.AI ERROR: ' + err);
//    ioSocket.emit('SysErr', configs.SYSTEM, "Well this is embarassing! An error occurred within <b>RemoteMatch</b>. This is reported!");
  });

  request.end();
}

console.log('Running...');


/* Bot Actions event dispatcher */
function actionDispatch(botMsg){
  var action = getBotAction(botMsg);
  switch(action) {
    case 'dev-skills':
     console.log('matched dev-skills');
     var skillss = getBotListOfSkillsToStr(botMsg);
     ioSocket.emit('getSkillMatch', skillss);
//     console.log(botMsg);
     break;
    case 'job-skills':
     console.log('matched job-skills');
     var position = getJobPosition(botMsg);
     var skills = getJobSkills(botMsg);
     ioSocket.emit('setSkills', position, skills);
     break;
    case 'match-me':
     console.log('matched match-me');
/*     var pos = getJobPosition(botMsg);
     var ski = getJobSkills(botMsg);
     ioSocket.emit('setSkills', pos, ski); */
     break;
    case 'all-jobs':
     console.log('Matched: all-jobs');
     ioSocket.emit('restartJobs');
     break;
    default:
    // do nothing
  }
}

/* Extracting values from bot */
function getBotAction(msg){
  return msg.result.action;
}

function getJobPosition(msg){
  return msg.result.parameters.position;
}

function getJobSkills(msg){
  return msg.result.parameters.skills;
}

function getBotFulfillment(msg){
  return msg.result.fulfillment.speech;
}

function getBotListOfSkillsToStr(msg){
  var devskills = msg.result.parameters.devskills.join(' ');
  console.log('Skills no join: ' + msg.result.parameters.devskills);
  console.log('Skills: ' + devskills);
  return devskills;
}
