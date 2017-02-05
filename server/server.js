const express = require('express');
const path = require('path');
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const pp = require('papaparse');
const Promise = require('bluebird');
const CSV = './store-locations.csv';
const apiKey = require('../apiKey').apiKey;
const readFile = Promise.promisify(require('fs').readFile);
const app = express();

const { addressToCoord, findNearestStore, calculateDistance } = require('../controllers/getStoreController');

function storeLocatorInit() { 
  const CSVData = fs.readFileSync(CSV, { encoding: 'utf8' });
  return pp.parse(CSVData, { 
    complete: (res) => {
      app.listen(8000, () => console.log('listening on port 8000'));
      app.use(express.static(path.join('__dirname', '../client/dist')));
      return res.data;
    }
  });
}
const JSONData = storeLocatorInit();

app.get('/api', (req, res) => { 
  const address = req.headers.data;

	addressToCoord(address,apiKey)
		.then(data => {
			const clientLocation = JSON.parse(data).results[0].geometry.location;
			findNearestStore(JSONData, clientLocation)
				.then(nearestStore => res.json(nearestStore))
				.catch(err => {
					console.error(err);
					res.status(500).json({ err });		
				})
		});
})
	
module.exports = app;
