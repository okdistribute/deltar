const React = require('react')
const ReactDOM = require('react-dom')

const localize = require('../localize')
const moment = require('moment')
const App = require('./App')
const State = require('./lib/state')
const Renderer = require('./ipc')

const STATE_WRAPPER = {}

var state = State.load()

state.logins = ['mylogin1@deltachat.eu']

setupLocaleData(state.saved.locale)

localize.setup(state.saved.locale || navigator.language)
window.saveState = () => State.save({ saved: state.saved })
window.onbeforeunload = window.saveState

const app = ReactDOM.render(
  <App STATE_WRAPPER={STATE_WRAPPER} />,
  document.querySelector('#root')
)

function render () {
  const deltachat = ipcRenderer.dc.getState()
  Object.assign(state, { deltachat })
  console.log('RENDER')
  STATE_WRAPPER.state = state
  app.setState(state)
}

const ipcRenderer = new Renderer(state.saved, render)
window.ipcRenderer = ipcRenderer

ipcRenderer.on('logout', () => {
  state.saved.credentials = null
  window.saveState()
})

ipcRenderer.on('DC_EVENT_LOGIN_FAILED', () => {
  ipcRenderer.emit('error', 'Login failed!')
})

ipcRenderer.dc.on('ready', credentials => {
  if (!state.logins.includes(credentials.addr)) {
    state.logins.push(credentials.addr)
  }
  state.saved.credentials = credentials
  window.saveState()
})

ipcRenderer.on('error', (...args) => console.error(...args))
ipcRenderer.on('render', render)
ipcRenderer.on('chooseLanguage', (locale) => {
  setupLocaleData(locale)
  app.forceUpdate()
})
ipcRenderer.send('ipcReady')

function setupLocaleData (locale) {
  moment.locale(locale)
  // TODO: instead call http to local rust static server?
  ipcRenderer.on('locale-data-resp', function (localeData) {
    window.translate = localize.translate(window.localeData.messages)
  })
  ipcRenderer.send('locale-data', locale)
}

const savedCredentials = state.saved.credentials
if (savedCredentials &&
    typeof savedCredentials === 'object' &&
    Object.keys(savedCredentials).length !== 0) {
  ipcRenderer.send('login', savedCredentials)
}
