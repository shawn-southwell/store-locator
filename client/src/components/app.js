import React, { Component } from 'react';

class App extends Component{

  constructor(){
    super();

    this.state = {
      inputText: '7810 Yorktown Place, Los Angeles, California 90045'
    }

    this._fetchData = this._fetchData.bind(this);
    this._handleChange = this._handleChange.bind(this);
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
      .then(json => console.log(json))
      .catch(err => console.error(err));
  }
	
  render(){
    return (
      <div>
        <h1> react app </h1>
        <form onSubmit={this._fetchData}>
          <input onChange={this._handleChange} />
        </form>
      </div>
    )
  }
}

export default App;
