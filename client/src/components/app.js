import React, { Component } from 'react';

class App extends Component{

  constructor(){
    super();

    this.state = {
      inputText: '7810 Yorktown Place, Los Angeles, California 90045'
    }

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(evt) {
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
        <form onSubmit={this.fetchData}>
          <input/>
        </form>
      </div>
    )
  }
}

export default App;
