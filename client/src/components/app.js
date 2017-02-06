import React, { Component } from 'react';
import style from '../style/style';

class App extends Component{

  constructor(){
    super();

    this.state = {
      inputText: '',
      closestStoreAddress: '',
      lat: '',
      lng: ''
    }

    this._fetchData = this._fetchData.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._redirectToGMaps = this._redirectToGMaps.bind(this);
  }

  _handleChange(evt) { 
    this.setState({ inputText: evt.target.value });
  }

  _fetchData(evt) {
    evt.preventDefault();

    const request = new Request('http://localhost:8000/api', {
      headers: new Headers({
        'Content-Type': 'text/plain',
        'Data': this.state.inputText
      })
    })
    
    fetch(request)
      .then(data => data.json())
      .catch(err => console.error(err))
      .then(jsonData => {
        const { address, lat, lng } = jsonData;
        this.setState({
          closestStoreAddress: address,
          lat,
          lng
        });
      })
      .catch(err => console.error(err));
  }

  _redirectToGMaps() {
    const gMapsURL = `http://maps.google.com/?q=${this.state.lat},${this.state.lng}`;
    window.location.replace(gMapsURL);
  }
	
  render(){
    return (
      <div style={style.body}>
        <div style={style.container}>
          <h1>Store Locator</h1> 
          <form onSubmit={this._fetchData}>
            <input onChange={this._handleChange} />
          </form>
          <p style={style.button} onClick={this._redirectToGMaps}>
           {this.state.closestStoreAddress}
          </p> 
        </div>
      </div>
    )
  }
}
    
export default App;
