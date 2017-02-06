const express = require('express');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const Promise = require('bluebird');
const apiKey = require('../apiKey').apiKey;

function calculateDistance(target, query) {
  return Math.sqrt(
    ((target.lat - query.lat) ** 2) +
    ((target.lng - query.lng) ** 2)
  )
}

function storeFactory(nearestStore, currentStore, currentDistance) {
  return Object.assign(nearestStore, {
    address: `${currentStore[2]}, ${currentStore[3]}, ${currentStore[4]}`,
    distanceAway: currentDistance,
    lat: currentStore[6],
    lng: currentStore[7]
  });
}

module.exports = {

  addressToLatLng(address, key) {
    return rp(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)
  },

  findNearestStore(dataset, clientLocation) {
    return Promise.try(() => {
      return dataset.data.reduce((nearestStore, currentStore) => {
        const currentDistance = calculateDistance(clientLocation, { lat: currentStore[6], lng: currentStore[7] });
        if (currentDistance < nearestStore.distanceAway) {
          return storeFactory(nearestStore, currentStore, currentDistance);
        } else {
          return nearestStore;
        }
      }, { address: '', distanceAway: Infinity,  lat: '', lng: '' });
    });
 }

}
