import logo from "./logo.svg";
import React from "react";
import "./App.css";
import {API_URL} from "./GlobalConsts"

class App extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    console.log("reading");
    fetch(API_URL + "/Plants/PutDemoPlants", {
      method: "put",
    });
  }
  //fetch(apiUrl + "/Plants/PutDemoPlants", {
  //  method: "put"
  //});
  //console.log("reading");
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
