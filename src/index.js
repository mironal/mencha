import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { isLoggedIn } from "./helpers/auth"
import './index.css'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"

function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({ pathname: "/login" })
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexPage} onEnter={requireAuth} />
      <Route path="login" component={LoginPage} />
      <Route path="settings" component={SettingsPage} />
    </Route>
  </Router>,
  document.getElementById('root')
)

