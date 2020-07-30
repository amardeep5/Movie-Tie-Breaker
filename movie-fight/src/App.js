import React from "react";
//import RightComponent from "./RightComponent.js";
import OneComponent from "./OneComponent.js";
import "./App.css";
//import LeftComponent from "./LeftComponent.js";

function App() {
  return (
    <div className="App">
      {/* <div className="container">
        <div className="columns">
          <div className="column">
            <LeftComponent/>
          </div>
          
          <div className="column">
            <RightComponent/>
          </div>
        </div>
      </div>
      <div className="column is-half notification is-primary tutorial">
        <h1 className="title">Search For a Movie on Both Sides</h1>
        <p className="subtitle">We will tell you which is best!</p>
      </div> */}
      <OneComponent />
    </div>
  );
}

export default App;
