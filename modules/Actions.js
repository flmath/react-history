import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

class Action extends React.Component {
  static contextTypes = {
    history: historyContextType.isRequired
  }

  performAction() {
    this.props.perform(this.context.history)
  }

  componentDidMount() {
    this.performAction()
  }

  componentDidUpdate() {
    this.performAction()
  }

  render() {
    return null
  }
}

if (__DEV__) {
  Action.propTypes = {
    perform: PropTypes.func.isRequired
  }
}

export const Push = ({ location, path, state }) =>
  <Action perform={history => history.push(location || path, state)}/>

if (__DEV__) {
  Push.propTypes = {
    path: PropTypes.string,
    state: PropTypes.object,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      hash: PropTypes.string,
      state: PropTypes.object
    })
  }
}

export const Replace = ({ location, path, state }) =>
  <Action perform={history => history.replace(location || path, state)}/>

if (__DEV__)
  Replace.propTypes = Push.propTypes

export const Pop = ({ go }) =>
  <Action perform={history => history.go(go)}/>

if (__DEV__) {
  Pop.propTypes = {
    go: PropTypes.number
  }
}

Pop.defaultProps = {
  go: -1
}

export const Back = () =>
  <Action perform={history => history.goBack()}/>

export const Forward = () =>
  <Action perform={history => history.goForward()}/>
