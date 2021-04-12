import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import "./Plant";
import thunk from 'redux-thunk';
import {reducer} from './reducer';
import { putInitPlants } from "./Actions";
import 'bootstrap/dist/css/bootstrap.min.css';

// setup debug tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

let store = Redux.createStore(reducer,composeEnhancers(Redux.applyMiddleware(thunk)));
store.dispatch(putInitPlants());


ReactDOM.render(
  <BrowserRouter>
    <ReactRedux.Provider store={store}>
      <React.Fragment>
        <Route exact path="/" component={App} />
      </React.Fragment>
    </ReactRedux.Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
