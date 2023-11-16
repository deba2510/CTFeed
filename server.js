const request = require('request');
const fs =require('fs');


// GLOBAL VARIABLE ##  TODO: TO BE REMOVED  ##
const filePath = './feed.json';

const fetchAbushChFeedUtil = function(){
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
    }, (error, response, body) => {
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


const fetchFeedACH = async function(){
  try{
    const feedData = await fetchAbushChFeedUtil();
    console.log(feedData.length);
    await writeJSONToFileUtil(feedData,filePath);
  }catch(error){
    console.error(error);
  }
}

// CALLING FETCH ABUSECH FEED FUNCTION
fetchFeedACH();



