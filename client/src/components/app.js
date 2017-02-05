import React, { Component } from 'react';

class App extends Component{

  constructor(){
    super();

    this.state = {
      inputText: ''
    }

  }

  fetchData(evt) {
    evt.preventDefault();
    console.log('firing');
    fetch('http://localhost:8000/api')
      .then(data => console.log(data));
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
