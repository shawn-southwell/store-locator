# store-locator

To get started, run:
npm install
npm run build
npm start

This is an approximately 0(n) solution to finding the nearest store, given a relatively well formed address. Before the server starts to listen on a port, I parse the CSV to JSON.  Then, I use the google maps API to convert the input address to latitude and longitude values, then I iterate over the store data collection using the distance formula to find the closest store.  I think the challenge was super fun, and I want to say thanks for giving me the opportunity to work on it. 
