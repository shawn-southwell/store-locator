const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const pp = require('papaparse');
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const CSV = './store-locations.csv';

app.use(express.static(path.join('__dirname', '../client/dist')));
app.get('/api', (req, res) => res.end())

function logData(res) {
  console.log( res.data.length );
  //res.data.forEach(item => console.log(item));
}

function csvToJSON(filePath) {
  return readFile(filePath, { encoding: 'utf8' })
    .then((storeData) => {
      pp.parse(storeData, { 
        complete: (res) => res.data });
    })
}

csvToJSON(CSV).then(() => console.log('bitch i might be'));
module.exports = app;

