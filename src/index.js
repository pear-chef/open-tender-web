import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import * as Sentry from '@sentry/react'
import packageJson from '../package.json'

global.appVersion = packageJson.version

// https://stackoverflow.com/questions/55738408/javascript-typeerror-cancelled-error-when-calling-fetch-on-ios
// https://docs.sentry.io/clients/javascript/config/
// "When using strings, they’ll partially match the messages,
// so if you need to achieve an exact match,
// use RegExp patterns instead."
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  ignoreErrors: [
    'TypeError: Failed to fetch',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: Cancelled',
    'TypeError: cancelled',
    'TypeError: Illegal invocation',
    'ReferenceError: fbq is not defined',
    "ReferenceError: Can't find variable: fbq",
    'Error: Extension context invalidated',
    'MapsRequestError',
    'Could not load "stats".',
    'Could not load "places_impl".',
    'Could not load "map".',
    'Could not load "util".',
    "Either header 'client-id' or 'origin' is required",
    'Object Not Found Matching',
  ],
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
