/*
 * Configs contains the global network configurations
 * for connecting botter's third parties with users
*/
'use strict'

/* The API.AI client token */
//const CLIENTTOKEN = 'ec53f7067dbc49cdad22c8aa5f58e793';
const CLIENTTOKEN = 'f1fe9d5289964d42ba211141b8123d9d';
/* API.AI Session ID */
const SESSIONID = 'rqf4e08cdbc61cmam00ff2bqq4y0x';
/* Botter host name */
const HOSTNAME = 'Matcher'
/* System name */
const SYSTEM = 'SYSTEM';
/* Static web folder path */
const FOLDER = 'public'
/* Static chatbot port number */
const PORT = 5050;
/* User Greeting */
const GREETING = 'Welcome to <b>RemoteMatch</b>. I am the <b>Matcher</b>; I will help you find remote developer jobs that match your skills. All jobs are listed at the top; To switch betewen jobs click on arrows. You\'re on the <b>main board</b>, this is where all remote jobs are listed.';

module.exports = {
  CLIENTTOKEN: CLIENTTOKEN,
  SESSIONID: SESSIONID,
  HOSTNAME: HOSTNAME,
  SYSTEM: SYSTEM,
  FOLDER: FOLDER,
  PORT: PORT,
  GREETING: GREETING
};

