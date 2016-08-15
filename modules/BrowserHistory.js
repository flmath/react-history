import warning from 'warning'
import React, { PropTypes } from 'react'
import DOMHistoryContext from './DOMHistoryContext'
import {
  addEventListener,
  removeEventListener,
  supportsHistory,
  supportsPopStateOnHashChange
} from './DOMUtils'

const PopStateEvent = 'popstate'
const HashChangeEvent = 'hashchange'

const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {}
  }
}

/**
 * A history that uses the HTML5 history API with automatic fallback
 * to full page refreshes in older browsers.
 */
class BrowserHistory extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    keyLength: PropTypes.number
  }

  static defaultProps = {
    keyLength: 6
  }

  state = {
    action: null,
    location: null
  }

  createKey() {
    return Math.random().toString(36).substr(2, this.props.keyLength)
  }

  createLocation(historyState) {
    const { key, state } = (historyState || {})
    const { pathname, search, hash } = window.location

    return {
      path: pathname + search + hash,
      state,
      key
    }
  }

  handlePopState = (event) => {
    if (event.state !== undefined) // Ignore extraneous popstate events in WebKit.
      this.setState({
        action: 'POP',
        location: this.createLocation(event.state)
      })
  }

  handleHashChange = () => {
    this.setState({
      action: 'POP', // Best guess.
      location: this.createLocation(getHistoryState())
    })
  }

  handlePush = (path, state) => {
    if (!this.supportsHistory) {
      warning(
        state === undefined,
        '<BrowserHistory> cannot push state in browsers that do not support HTML5 history'
      )

      window.location.href = path
      return
    }

    const key = this.createKey()

    window.history.pushState({ key, state }, null, path)

    this.setState({
      action: 'PUSH',
      location: { path, state, key }
    })
  }

  handleReplace = (path, state) => {
    if (!this.supportsHistory) {
      warning(
        state === undefined,
        '<BrowserHistory> cannot replace state in browsers that do not support HTML5 history'
      )

      window.location.replace(path)
      return
    }

    const key = this.createKey()

    window.history.replaceState({ key, state }, null, path)

    this.setState({
      action: 'REPLACE',
      location: { path, state, key }
    })
  }

  handleGo = (n) => {
    window.history.go(n)
  }

  componentWillMount() {
    if (typeof window === 'object') {
      this.supportsHistory = supportsHistory()
      this.needsHashChangeListener = !supportsPopStateOnHashChange()

      this.setState({
        action: 'POP',
        location: this.createLocation(getHistoryState())
      })
    } else {
      warning(
        false,
        '<BrowserHistory> works only in DOM environments'
      )
    }
  }

  componentDidMount() {
    addEventListener(window, PopStateEvent, this.handlePopState)

    if (this.needsHashChangeListener)
      addEventListener(window, HashChangeEvent)
  }

  componentWillUnmount() {
    removeEventListener(window, PopStateEvent, this.handlePopState)

    if (this.needsHashChangeListener)
      removeEventListener(window, HashChangeEvent, this.handleHashChange)
  }

  render() {
    const { children } = this.props
    const { action, location } = this.state

    return (
      <DOMHistoryContext
        children={children}
        action={action}
        location={location}
        push={this.handlePush}
        replace={this.handleReplace}
        go={this.handleGo}
      />
    )
  }
}

export default BrowserHistory