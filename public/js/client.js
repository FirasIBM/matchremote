/*
 * A client for the botter AI server. Handles interactions
 * between the user and botter AI backend
*/

/* Establish a connection with botter */
var socket = io();

/* remote jobs */
var jobs = [];

/* matches jobs */
var oldJobs = [];

/* user job position */
var userJobPosition = "";

/* user skills */
var userSkills = "";

/* Current job card index */
var currentJobIndex = 0;

/* Current job card color index */
var currentCardColorIndex = 0;


$(document).ready(function(){
  var userName = "Me";
  // store the user nick
  $('#userMessageForm').data('data-user', userName);
  // notify botter that a client joined
  socket.emit('clientJoined', userName);

  $('body').on('click', '#leftJob', function(){ 
    slideJobLeft(); 
  });

  $('body').on('click', '#rightJob', function(){ 
    slideJobRight();
  });

  // 
  socket.emit('clientMsg', 'Me', 'init');



/*
  $(document).keypress(function(e) {
    if(e.which == 17) {
      slideJobLeft();
      window.console.log('Key pressed');
    }
  }); */

});

/* get all jobs from server on user connection  */  
socket.on('allJobs', function(jobList){
  $('.jobcard').hide();
  jobs = jobList.jobs;
//  window.console.log('Got all jobs ' + jobs);
  // save old jobs
  oldJobs = jobs;
  currentJobIndex = 0;
  populateJob();
  $('.jobcard').slideDown();
//  matchMe('software engineer', 'sdk ios java', [jobs[0]]);
//  window.console.log('match => position: ' + m[0].job.position + ', counter: ' + m[0].counter);
});

/* get all jobs from server on user connection  */  
socket.on('restartJobs', function(){
  $('.jobcard').hide();
  jobs = oldJobs;
  currentJobIndex = 0;
  populateJob();
  $('.jobcard').slideDown();
  restartJobCardColor();
  insertMessageArea("Matcher", "Done. You're on the main board");
//  matchMe('software engineer', 'sdk ios java', [jobs[0]]);
//  window.console.log('match => position: ' + m[0].job.position + ', counter: ' + m[0].counter);
});

/* Handle botter incoming messages  */  
socket.on('botMsg', function(from, botMessage){
  if(!isStrEmpty(botMessage)){
  insertMessageArea(from, botMessage, 'SteelBlue');
  }
  $('#botterFeedText').text('');
});

/* Notify the user when botter is typing */
socket.on('notifyTyping', function(userName){
  $('#botterFeedText').html('...').fadeIn('slow');
});

/* Report system errors to user  */  
socket.on('SysErr', function(from, botMessage){
//  insertMessageArea(from, botMessage, 'DarkRed');
});

/* Handle Bot actions */
socket.on('setSkills', function(position, skills){
  window.console.log('System msg: ' + position + ', ' + skills);
  if(position === '' || skills === ''){
  } else { 
   window.console.log('System msg: got all info, looking for a match');
   userJobPosition = position;
   userSkills = skills; 
   window.console.log('Saved info: ' + userJobPosition + ', ' + userSkills);

     matchMe(userJobPosition, userSkills, oldJobs);
  } 

});


/* Handle Bot actions */
socket.on('getSkillMatch', function(bSkills){
  window.console.log('Bot ask to match skills:  ' + bSkills);
  if(isStrEmpty(bSkills)){ 
  } else { 
    matchMe('', bSkills, oldJobs);
  } 

});

/* Handle the user message and send it to botter */
function userMessageHandler(){
  // get username
  var from = $('#userMessageForm').data('data-user');
  // get the user message
  var userMessage = $('#userMessageInput').val();
  // reset user messsage input field
  $('#userMessageInput').val('').focus();
 
  if(!isStrEmpty(userMessage)){
  // insert user message to messages area
  insertMessageArea(from, userMessage, 'Crimson');

  // send the user message to botter
  socket.emit('clientMsg', from, userMessage);
  }
  return false;
}

/* Insert a message into the main message area */
function insertMessageArea(from, msg, style){
   var strMsg = buildMessage(from, msg, style);
   $('#messagesArea').append(strMsg);
   scrollDown();
}

/* Build a string representation of a message  */
function buildMessage(nick, msg, nickType){
  var nickPic;

  if(nick === 'Matcher' || nick === 'SYSTEM'){
    nickPic = '<img src="https://www.w3schools.com/w3css/img_avatar2.png" class="w3-left w3-circle" style="width:50px;padding-right:5px;">';
  } else {
    nickPic = '<img src="https://www.w3schools.com/w3css/img_avatar5.png" class="w3-left w3-circle" style="width:50px;padding-right:5px;">';
  }

  var msgElm = '<li class="w3-padding-small" style="font-size:16px">'
    + nickPic 
    + '<span class="w3-large">' + nick + '</span><br>'
    + '<span>' + msg + '</span>'
    + '</li>';
    return msgElm;
//  return '<li style="font-size:16px"><b style="color:' + nickColor +  '">' + nick + '</b>: ' + msg + '</li>';
}

/* Scroll page down */
function scrollDown(){
  var messagesArea = document.getElementById("messagesArea");
  messagesArea.scrollTop = messagesArea.scrollHeight;
}



function populateJob(){
  var job = jobs[currentJobIndex];
//  window.console.log('populateJob: ' + job.position);
//  jobToStrArr(job);
  var position = job.position;
  var description = job.description;
  var datePosted = job.datePosted;
  var company = job.company;
  var applyLink = job.applyLink;



  $('#jobheader').text(position);
  $(description).find('.share').remove();
  $('#jobdescription').text('');
  $('#jobdescription').append(description);
  $('#jobpostdate').text('');
  $('#jobpostdate').text(datePosted);
  $('#jobcompany').text(company);
  $('#applyjob').unbind('click');
  $('#applyjob').click(function() { window.open(applyLink, '_blank'); });
  populateTags(job);

  

/*  var cardElm = $('#mainjobcard').find('.jobcard').detach();
  cardElm.addClass("w3-animate-left");
  $("#leftJob").after(cardElm); */

//  $('#mainjobcard').find('.jobcard').fadeOut("fast");
//  $('#mainjobcard').find('.jobcard').fadeIn("slow");

//  window.console.log('populateJob: ' + job.tags.split(''));
}

/* add tags */
function populateTags(job){
  var tags = job.tags;
  var tagColors = ["pink","blue","red","teal","indigo","green","cyan","yellow","lime"]
  // save first tag, detach it, remove other tags and attach it.
  var save = $('#jobfirsttag').detach();
  $('#jobtag').empty().append(save);

  for(var i = 0; i < tags.length; i++){
  $('#jobtag').append('&nbsp;<span class="w3-tag w3-' + tagColors[i] + '">' + tags[i] + '</span>&nbsp;');
  }
}


/* Job sliders: Manipulates card job index */
function slideJobRight(){
  if(jobs.length > 1){
  var nextJobIndex = currentJobIndex + 1;

  if(nextJobIndex >= jobs.length){
    currentJobIndex = 0;      
  } else {
    currentJobIndex = nextJobIndex;
  }

  populateJob();
  changeJobCardColorRight();
  window.console.log('Current Job Index : ' + currentJobIndex);
  }
  return false;
}

function slideJobLeft(){
  if(jobs.length > 1){ 
  var nextJobIndex = currentJobIndex - 1;

  if(nextJobIndex >= 0){
    currentJobIndex = nextJobIndex;
  } else {
    currentJobIndex = jobs.length - 1;
  }
  populateJob();
  changeJobCardColorLeft();
  window.console.log('Current Job Index : ' + currentJobIndex);
  
  }
  return false;
}

/* card color; changed on slide */
function changeJobCardColorRight(){
  var colors = ["pink","blue","red","teal","indigo","green","cyan","purple","yellow","khaki","lime"];
  
  if((currentCardColorIndex + 1) >= colors.length){
   currentCardColorIndex = 0;
  } else {
   currentCardColorIndex++;
  }
  // get second class (color)
  var headcolorClass = $('#jobcardhead').attr('class').split(' ')[1];
  var footcolorClass = $('#applyjob').attr('class').split(' ')[1];
  // remove color class
  $("#jobcardhead").removeClass(headcolorClass);
  $("#applyjob").removeClass(headcolorClass);
  // add color class
  $("#jobcardhead").addClass('w3-' + colors[currentCardColorIndex]);
  $("#applyjob").addClass('w3-' + colors[currentCardColorIndex]);

  return false;
 // window.console.log('colorClass : ' + colorClass);
}

/* card color; changed on slide */
function changeJobCardColorLeft(){
  var colors = ["lime","khaki","yellow","purple","cyan","green","indigo","teal","red","blue","pink"];
  
  if((currentCardColorIndex + 1) >= colors.length){
   currentCardColorIndex = 0;
  } else {
   currentCardColorIndex++;
  }
  // get second class (color)
  var headcolorClass = $('#jobcardhead').attr('class').split(' ')[1];
  var footcolorClass = $('#applyjob').attr('class').split(' ')[1];
  // remove color class
  $("#jobcardhead").removeClass(headcolorClass);
  $("#applyjob").removeClass(headcolorClass);
  // add color class
  $("#jobcardhead").addClass('w3-' + colors[currentCardColorIndex]);
  $("#applyjob").addClass('w3-' + colors[currentCardColorIndex]);

  return false;
 // window.console.log('colorClass : ' + colorClass);
}


/* Job Matcher:
 * 1) Get matched jobs
 * 2) if there are matches, inform the user and replace all jobs by matches
 * 3) if there are no matches, inform the user and ask if he's like for new match, or show all jobs
*/
function matchMe(position, skills, ajobs){

  var matches = match(position, skills, ajobs);
  if (matches.length > 0){
    $('.jobcard').hide();
//    window.console.log('match => position: ' + m[0].job.position + ', counter: ' + m[0].counter);
//    window.console.log('match positions: ' + m.length);


    insertMessageArea("Matcher", "<span style='color:green'>We've got " + matches.length + " matches above</span>. Let me know if you'd like to get different match, or type your programming skills for a job match.", "DarkRed");
    var matchJobs = [];
    for(var i = 0; i < matches.length; i++){
      matchJobs.push(matches[i].job);    
    }
    // set new matched jobs
    jobs = matchJobs;
    // reset card counter
    currentJobIndex = 0;
    // populate first job into job card
    populateJob();
 
    $('.jobcard').slideDown();

    // get second class (color)
   var headcolorClass = $('#jobcardhead').attr('class').split(' ')[1];
   var footcolorClass = $('#applyjob').attr('class').split(' ')[1];
   // remove color class
   $("#jobcardhead").removeClass(headcolorClass);
   $("#applyjob").removeClass(headcolorClass);
   // add color class
   $("#jobcardhead").addClass('w3-' + 'blue');
   $("#applyjob").addClass('w3-' + 'blue');

   socket.emit('clientMsg', 'Matcher', 'x1x1');
  } else { 
    window.console.log('no match => 0'); 
//    insertMessageArea('Matcher', 'There are no matches', 'DarkRed');
    socket.emit('clientMsg', 'Matcher', 'm0m0');
  }  
}

function restartJobCardColor(){
    // get second class (color)
   var headcolorClass = $('#jobcardhead').attr('class').split(' ')[1];
   var footcolorClass = $('#applyjob').attr('class').split(' ')[1];
   // remove color class
   $("#jobcardhead").removeClass(headcolorClass);
   $("#applyjob").removeClass(headcolorClass);
   // add color class
   $("#jobcardhead").addClass('w3-' + 'pink');
   $("#applyjob").addClass('w3-' + 'pink');
}


function isStrEmpty(str){
 return (!str || 0 === str.length);
}
