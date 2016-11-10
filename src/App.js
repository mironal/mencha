import React, { Component } from 'react';
import './App.css';
import Helmet from "react-helmet"

import { initFirebaseIfNeeded } from "./helpers/auth"
import Footer from "./components/Footer"

class App extends Component {
  constructor(props) {
    super(props)
    initFirebaseIfNeeded();
  }

  render() {
    return <div className="App">
      <Helmet
          meta={[
              {"name": "description", "content": "Online Emotions Seismogram"},
              {"property": "og:type", "content": "webpage"}
          ]}
      />
      <header>
        <h1>mencha</h1>
      </header>
      {this.props.children}
      <Footer />
    </div>
  }
}

export default App
