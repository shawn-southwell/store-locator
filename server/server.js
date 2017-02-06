const express = require('express');
const path = require('path');
const fs = require('fs');
const pp = require('papaparse');
const CSV = './store-locations.csv';
const apiKey = require('../apiKey').apiKey;
const app = express();

const { addressToLatLng, findNearestStore } = require('../controllers/getStoreController');

function storeLocatorInit() { 
  const CSVData = fs.readFileSync(CSV, { encoding: 'utf8' });
  return pp.parse(CSVData, { 
    complete: (res) => {
      app.listen(8000, () => console.log('listening on port 8000'));
      app.use(express.static(path.join('__dirname', '../client/dist')));
      return res.data;
    },
    error: (err) => {
      app.listen(8000, () => console.log(`listening on port 8000, CSV Parse Error: \n ${err}`));
      app.use(express.static(path.join('__dirname', '../client/dist')));
      return false;
    }
  });
}

const JSONData = storeLocatorInit();

app.get('/api', (req, res) => { 
  const address = req.headers.data;
  
  if (!JSONData) return res.status(500).json({ err: 'Data Parser is broken.' });

	addressToLatLng(address, apiKey)
		.then(latLng => {
			const clientLocation = JSON.parse(latLng).results[0].geometry.location;
			findNearestStore(JSONData, clientLocation)
				.then(nearestStore => res.json(nearestStore))
				.catch(err => {
					console.error(err);
					res.status(500).json({ err });		
				})
		})
    .catch(err => {
      console.error(err)
      res.status(500).json({ err });
    });
});
