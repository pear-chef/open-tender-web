import React, { createContext, createRef } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import TagManager from 'react-gtm-module'
import { fetchConfig } from './slices/configSlice'
import GlobalStyles from './GlobalStyles'
import Routes from './components/Routes'
import {
  // Alerts,
  CartButton,
  ErrorBoundary,
  Modal,
  Nav,
  Notifications,
  Sidebar,
} from './components'
import { ErrorFatal } from './components/pages'
import './App.scss'

export const AppContext = createContext(null)

export const AppView = styled('div')`
  display: flex;
  justify-content: flex-end;
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { gtmId: false }
    this.windowRef = createRef()
  }

  componentDidMount() {
    this.props.fetchConfig()
  }

  componentDidUpdate() {
    const { loading, brand } = this.props
    if (loading !== 'pending' && brand && !this.state.gtmId) {
      this.setState({ gtmId: true })
      const tagManagerArgs = { gtmId: brand.gtmContainerId }
      TagManager.initialize(tagManagerArgs)
    }
  }

  render() {
    let { loading, theme, brand, error } = this.props
    const { body, headings } = theme ? theme.fonts : {}
    const isLoading = loading === 'pending'
    const hasTheme = !isLoading && !error && theme
    return (
      <>
        <ErrorFatal error={error} loading={loading} />
        {hasTheme && (
          <ThemeProvider theme={this.props.theme}>
            <GlobalStyles />
            <AppView ref={this.windowRef} id="app">
              <Helmet>
                <title>{brand.title}</title>
                <meta name="description" content={brand.description} />
                <link rel="icon" href={brand.favicon} />
                <link rel="apple-touch-icon" href={brand.appleTouchIcon} />
                <link href={body.url} rel="stylesheet" />
                {headings.url && body.url !== headings.url && (
                  <link href={headings.url} rel="stylesheet" />
                )}
              </Helmet>
              <AppContext.Provider value={{ windowRef: this.windowRef }}>
                <ErrorBoundary>
                  <Router>
                    <Modal />
                    {/* <Alerts /> */}
                    <Notifications />
                    <CartButton />
                    <Routes />
                    <Sidebar />
                    <Nav />
                  </Router>
                </ErrorBoundary>
              </AppContext.Provider>
            </AppView>
          </ThemeProvider>
        )}
      </>
    )
  }
}

export default connect(
  (state) => ({
    theme: state.config.theme,
    brand: state.config.brand,
    loading: state.config.loading,
    error: state.config.error,
  }),
  { fetchConfig }
)(App)
