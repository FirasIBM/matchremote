'use strict'

var request = require('request');
var cheerio = require('cheerio');


var url = 'https://remoteok.io/remote-dev-jobs';

var jobs = [];
 
console.log('GETing');

function getRemoteJobs(){
request(url, function(error, res, html){
  if(!error){
    var $ = cheerio.load(html);
  }

  console.log('Extracting from url ' + url);

  $('#jobsboard > tr.job').each(function() {
   var job = {};
   var row = $(this);
   var rId = $(row).attr('id');
   var descriptionRow = $(row).next();
   //var expClass = $(descriptionRow).attr('class');
   //console.log('job ID ' + rId + ', expansion class ' + expClass);

   var jobRowChildren = $(this).children('td');

   /* get schema info */
   var schemas = jobRowChildren.children('.schema > span'); // returns JQeury object
   var datePosted = schemas.eq(0).text().trim();
   var workhrs = schemas.eq(1).text().trim();
   var joblocation = schemas.eq(2).text().trim();

   /* get company & position info */
   var positionCompany = jobRowChildren.children('.company a');
   var position = positionCompany.eq(0).find('h2').text().trim();
   var company = positionCompany.eq(1).find('h3').text().trim();

   /* get tags */
   var tags = [];
   jobRowChildren.children('.tags a').each(function() {
     var thisTag = $(this).find('div').attr('class');
     var tagNames = thisTag.replace(/tag-/g, '').replace(/tag/g,'').trim();
     tags.push(tagNames);
   });
  
   /* get job description */
   var description = descriptionRow.find('.description > div');
   var descriptionText = description.eq(0);
   $(descriptionText).children().remove('.share');
   var htmlDes = $(descriptionText).clone().html();

   /* Get job link */
   var jobSource = jobRowChildren.children('.source a');
   var applyRLink = jobSource.eq(0).attr("href");
   var remoteIOLink = 'http://www.remoteok.io/';
   var applyLink = remoteIOLink.concat(applyRLink);

   job.id = rId;
   job.datePosted = datePosted;
   job.workhrs = workhrs;
   job.joblocation = joblocation;
   job.position = position;
   job.company = company;
   job.tags = tags;
   job.description = htmlDes;
   job.applyLink = applyLink;
//   console.log('job.applylink: ' + job.applyLink);  
//   console.log('JOB DES: ' + job.description);
    
//   console.log(job);
   jobs.push(job);   

  });

});
     
  return jobs;
}

module.exports = getRemoteJobs();
