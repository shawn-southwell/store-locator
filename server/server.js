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

app.use(express.static(path.join('__dirname', '../client/dist')));

const CSVData = fs.readFileSync(CSV, { encoding: 'utf8' });
const JSONData = pp.parse(CSVData, { 
	complete: (res) => {
		app.listen(8000, () => console.log('listening on port 8000'));
		return res.data;
	}
});

app.get('/api', (req, res) => { 
  const address = req.headers.data;

	addressToCoord(address,apiKey)
		.then(data => {
			const clientLocation = JSON.parse(data).results[0].geometry.location;
			findNearestStore(JSONData, clientLocation)
				.then(nearestStore => res.json(nearestStore))
				.catch(err => {
					console.error(err);
					res.status(500).end();		
				})
		});
})

function addressToCoord(address,key) {
  return rp(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
} 

function findNearestStore(dataset, clientLocation) {
	return Promise.try(() => { 
		return dataset.data.reduce((nearestStore, currentStore) => {
			const currentDistance = calculateDistance(clientLocation, { lat: currentStore[6], lng: currentStore[7] });
			return currentDistance < nearestStore.distanceAway ? 
				Object.assign(nearestStore, { address: currentStore[2], distanceAway: currentDistance }) : 
				nearestStore;	
		}, { address: '', distanceAway: Infinity })
	})
}
	
function calculateDistance(target, query) {
  return Math.sqrt(
    ((target.lat - query.lat) ** 2) +
    ((target.lng - query.lng) ** 2)
  )
}

module.exports = app;
/*
function csvToJSON(filePath) {
  return readFile(filePath, { encoding: 'utf8' })
}

csvToJSON(CSV)
	.then((storeData) => {
		pp.parse(storeData, { 
			complete: (res) => console.log(res.data) });
	})
	.catch(err => console.error(err))
*/
