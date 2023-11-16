const request = require('request');
const fs =require('fs');


// GLOBAL VARIABLE ##  TODO: TO BE REMOVED  ##
const filePath = './feed.json';

const fetchAbushChFeedLastWeekUtil = function(){
  const url = 'https://threatfox-api.abuse.ch/api/v1/';
  const body = {
    query: 'get_iocs',
    days: 1
  };

  return new Promise(function(resolve,reject){
    request.post({
      url,
      json: true,
      body: body,
    }, function(error, response, body){
      if (error) {
        reject(new Error("ERROR HAS OCCURED!!!"));
      } else {
        if(body.query_status === 'ok'){
          resolve(body.data);
        }else{
          reject(new Error(body.data));
        }
      }
    });
  });
}

const writeJSONToFileUtil = function(jsonObj, filePath){
  return new Promise(function(resolve, reject){
    try{
      const stringFeed = JSON.stringify(jsonObj);
      fs.writeFile(filePath, stringFeed, function (error){
        if(error){
          throw new Error("WRITE FILE ERROR HAS OCCURED!!");
        }else{
          resolve("FILE WRITTEN SUCCESSFULLY!!");
        }
      });
    }catch(error){
        reject(error);
    }
  });
  
}


const searchAbuseCHBySearchStringUtil = function(search_term){
  const url = 'https://threatfox-api.abuse.ch/api/v1/';
  const body = {
    query: 'search_ioc',
    search_term
  };
  return new Promise(function(resolve,reject){
    request.post({
      url,
      json:true,
      body
    }, function(error, response, body){
      if(error){
        reject(error);
      }
      else{
        if(body.query_status === 'ok'){
          resolve(body.data);
        }else{
          reject(new Error(body.query_status));
        }
      }
    });
  });
}


const fetchFeedACH = async function(){
  try{
    const feedData = await fetchAbushChFeedLastWeekUtil();
    console.log(feedData.length);
    await writeJSONToFileUtil(feedData,filePath);
    // const iocListForSearchString = await searchAbuseCHBySearchStringUtil('69.162.231.243');
    // console.log(iocListForSearchString);
  }catch(error){
    console.error(error);
  }
}

// CALLING FETCH ABUSECH FEED FUNCTION
fetchFeedACH();




