import fetch from 'node-fetch';
import fs from 'fs';


const fetchAbuseChThreatFeedOfOneDay = async function(){
  const url = 'https://threatfox-api.abuse.ch/api/v1/';
  const body = {
    query: 'get_iocs',
    days: 1
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if(data.query_status === "ok"){
    return data.data;
  }else{
    throw new Error("ERROR HAS OCCURED!!!");
  }
}


const writeThreatFeedToFile = function(threatFeedObj){
  const stringFeed = JSON.stringify(threatFeedObj);
  // console.log(stringFeed);
  const filePath = './feed.json';
  fs.writeFile(filePath, stringFeed, function (error){
    if(error){
      console.log(error);
    }else{
      console.log("FILE WRITTEN SUCCESSFULLY!!");
    }
  })
}


try{
  const abuseCHThreatFeed = await fetchAbuseChThreatFeedOfOneDay();
  writeThreatFeedToFile(abuseCHThreatFeed);
}catch(e){
  console.log(e);
}




