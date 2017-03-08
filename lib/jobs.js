'use strict'

var jobs = require('./rjobscraper/rjobscraper.js');

setTimeout(function () {
  console.log(jobs);
  console.log('From jobs.js ');
}, 20000);


function getJobs() {
  return jobs;
};

function getJSONJobs() {
  return {jobs: jobs};
};

module.exports = {
  getJobs: getJobs,
  getJSONJobs: getJSONJobs
}
