import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import IndexPage from "./pages/IndexPage"

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexPage}/>
    </Route>
  </Router>,
  document.getElementById('root')
)

