import React, { Component } from 'react';
import Gameplay from './components/Gameplay';
import './App.css';

class App extends Component {
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <Gameplay />
        </div>
      </div>
    );
  }
}

export default App;
