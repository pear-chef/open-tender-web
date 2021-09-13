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
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  ignoreErrors: [
    'TypeError: Failed to fetch',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: Cancelled',
    'Object Not Found Matching Id',
    'Return statements are only valid inside functions',
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
