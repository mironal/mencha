import React, { Component } from "react"
import Helmet from "react-helmet"

import Alert from "react-s-alert"
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'

import { initFirebaseIfNeeded } from "./helpers/auth"
import Footer from "./components/Footer"

import "./App.css"

class App extends Component {
  constructor(props) {
    super(props)
    initFirebaseIfNeeded();
  }

  render() {
    return <div className="App">
      <Alert stack={{limit: 3}} timeout={2000}  position="top" effect="stackslide" />
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
      {this.props.location.pathname !== "/login" && <Footer />}
    </div>
  }
}

export default App
