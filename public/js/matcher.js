
function match(position, skills, jobs){
  
  var matches = [];
//  var skillArr = concatToArray(position,skills); 
  var skillArr = skills.split(" ");
//  window.console.log('match;skillArr: ' + skillArr);
  for(var i = 0; i < jobs.length; i++){
    var match = getMatch(skillArr, jobs[i]);

    if(match.counter > 0){
      matches.push(match);
    }
  }

  window.console.log('Compared: ' + jobs.length + ' jobs');
  window.console.log('matches: ' + matches.length + ' jobs');
  matches = sortJobs(matches);
  window.console.log('sorted matches: ' + matches.length + ' jobs');

  for(var j = 0; j < matches.length; j++){
    window.console.log('s counter: ' + matches[j].counter);
  }


  return matches;
}

function getMatch(skills, ajob){
  var matchObj = {
    job: ajob,
    counter: 0
  }
//  window.console.log('getMatch;skillsArr: ' + skills);
  for(var i = 0; i < skills.length; i++){
    var jobAsStrArr = jobToStrArr(ajob);
    matchObj.counter += getOccurrence(skills[i], jobAsStrArr);
  }

  return matchObj;
}

function getOccurrence(aSkill, aJob){
//  var jobAsStrArr = flattenJob(aJob); TODO
  var occurrence = 0;
  var lowerSkill = aSkill.toLowerCase();

  for(var i = 0; i < aJob.length; i++){
    var lowerJobWord = aJob[i].toLowerCase();
    if(lowerSkill === lowerJobWord){
      occurrence++;      
    }
  } 
//  window.console.log('getOccurrence;occurrence: ' + occurrence);
  return occurrence;
}

function jobToStrArr(aJob){
  var position = aJob.position;
  var description = aJob.description;
  /* ready tag array */  
  var tagArr = aJob.tags;

  var positionStrArr = position.split(" "); 
  var descriptionStrArr = description.split(" ");   
//   window.console.log('jobPosition: ' + positionStrArr);
//   window.console.log('jobDescription: ' + descriptionStrArr);
//   window.console.log('toLowe: ' + ('<p>'.toLowerCase()));
//  window.console.log('posTags: ' + ;
  var posTagArr = positionStrArr.concat(tagArr);
  var concatPosJobArr = posTagArr.concat(descriptionStrArr);
//  window.console.log('concat: ' + concatPosJobArr);
  return concatPosJobArr;
}

function sortJobs(jobs){
  var sorted = [];

  for(var i = 0; i < jobs.length; i++){
    sorted = insertJob(jobs[i], sorted);
  }

  return sorted;
}

function insertJob(aJob, arr){

  if(arr.length === 0){
    arr.push(aJob);
    return arr;
  }

  for(var i = 0; i < arr.length; i++){
    var jobCounter = arr[i].counter;

    if(aJob.counter >= jobCounter) {
      arr.splice(i, 0, aJob);
      break;
    }

    if((i === (arr.length - 1)) && (aJob.counter < jobCounter)){
      arr.splice((i+1), 0, aJob);
      break;
    }
  }
   
  return arr;
}




/*
function concatToArray(str1, str2){
 var res = str1.concat(str2);
 var resArr = res.split(" ");
 return resArr;
}*/
