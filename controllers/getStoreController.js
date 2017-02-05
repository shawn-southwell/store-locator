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

module.exports = {

  addressToCoord: (address,key) => {
  return rp(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
  },

  storeLocatorInit: () => { 
    const CSVData = fs.readFileSync(CSV, { encoding: 'utf8' });
    return pp.parse(CSVData, { 
      complete: (res) => {
        app.listen(8000, () => console.log('listening on port 8000'));
        app.use(express.static(path.join('__dirname', '../client/dist')));
        return res.data;
      }
    });
  },
  calculateDistance: (target, query) => {
    return Math.sqrt(
      ((target.lat - query.lat) ** 2) +
      ((target.lng - query.lng) ** 2)
    )
  },

  findNearestStore: (dataset, clientLocation) => {
    return Promise.try(() => { 
      return dataset.data.reduce((nearestStore, currentStore) => {
        const currentDistance = calculateDistance(clientLocation, { lat: currentStore[6], lng: currentStore[7] });
        return currentDistance < nearestStore.distanceAway ? 
          Object.assign(nearestStore, { address: currentStore[2], distanceAway: currentDistance }) : 
          nearestStore;	
      }, { address: '', distanceAway: Infinity });
    });
  },
  
};



	
