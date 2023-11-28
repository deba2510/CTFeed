// TODO: remove all require
const fs = require(`fs`);
const yargs = require(`yargs`);
const axios = require(`axios`);


const fetchAbushChFeed = function(days){
  return new Promise(function(resolve,reject){
    const url = 'https://threatfox-api.abuse.ch/api/v1/';
    const params = {
    query: 'get_iocs',
    json: true,
    days
  };
    axios.post(url,params)
    .then(resolve)
    .catch(reject);
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


const searchAbusechDbByQuery = function(search_term){
  const url = 'https://threatfox-api.abuse.ch/api/v1/';
  const params = {
    query: 'search_ioc',
    search_term
  };
  return new Promise(function(resolve,reject){
    axios.post(url,params)
    .then(resolve)
    .catch(reject);
  });
}

const fetchWeatherInfoUtil = async function (city){
  return new Promise(function(resolve,reject){
    const params = {
      access_key: '4f9c1fc995c0a7a2f33e12e4d20f5a7a',
      query: city
    }
    axios.get('http://api.weatherstack.com/current', {params})
    .then(resolve)
    .catch(reject);
  });
}

const searchAbusechDbByHash = async function(hash){
  return new Promise(function(resolve,reject){
    const params = {
      query: "search_hash", 
      json:true,
      hash
    }
    axios.post('https://threatfox-api.abuse.ch/api/v1/', params)
    .then(resolve)
    .catch(reject);
  });
}

yargs.command({
  command: 'weather',
  describe: 'fetch weather details of city',
  handler: function (argv) {
    fetchWeatherInfoUtil(argv.city)
    .then(function(response){
      console.log(response.data);
    })
    .catch(function(error){
      console.log(error);
    })
  },
  builder: {
    city: {
      describe: 'Name of the city',
      demandOption: true,
      type: 'string',
    }
  }
});

yargs.command({
  command: 'abusech',
  describe: 'fetch abusechfeed for some days',
  handler: function (argv) {
    fetchAbushChFeed(argv.days)
    .then(function(response){
      console.log(response.data.data.length);
    })
    .catch(function(error){
      console.log(error);
    });
  },
  builder: {
    days: {
      describe: 'Number of days',
      demandOption: true,
      type: 'number',
    }
  }
});

yargs.command({
  command: 'search_abusech',
  describe: 'search abusechfeed database',
  handler: function (argv) {
    searchAbusechDbByQuery(argv.query)
    .then(function(response){
      console.log(response.data);
    })
    .catch(function(error){
      console.log(error);
    })
  },
  builder: {
    query: {
      describe: 'query string',
      demandOption: true,
      type: 'string',
    }
  }
});

yargs.command({
  command: 'search_abusech_hash',
  describe: 'search abusechfeed database',
  handler: function (argv) {
    searchAbusechDbByHash(argv.hash)
    .then(function(response){
      console.log(response.data);
    })
    .catch(function(error){
      console.log(error);
    })
  },
  builder: {
    hash: {
      describe: 'hash of file to search',
      demandOption: true,
      type: 'string',
    }
  }
});




// node .\server.js search_abusech_hash --hash=2151c4b970eff0071948dbbc19066aa4
// node .\server.js abusech --days=1
// node .\server.js weather --city=kolkata
// node .\server.js search_abusech --query=139.180.203.104
yargs.parse();