import React, { Component } from 'react';
import './App.css';

import firebase from "firebase"

class App extends Component {

  constructor(props) {
    super(props)

    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
    }

    if (!config.apiKey) {
      throw new Error("API KEY not found. Please read README.md")
    }

    firebase.initializeApp(config)
  }

  render() {
    return <div className="App">
      <div className="App-header">
        <h2>めんちゃ</h2>
      </div>
      {this.props.children}
    </div>
  }
}

export default App

