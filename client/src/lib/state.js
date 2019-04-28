const { EventEmitter } = require('events')

const SAVE_DEBOUNCE_INTERVAL = 1000
const localStorage = window.localStorage

const State = module.exports = Object.assign(new EventEmitter(), {
  load,
  // state.save() calls are rate-limited. Use state.saveImmediate() to skip limit.
  save: function () {
    // Perf optimization: Lazy-require debounce (and it's dependencies)
    const debounce = require('debounce')
    // After first State.save() invokation, future calls go straight to the
    // debounced function
    State.save = debounce(saveImmediate, SAVE_DEBOUNCE_INTERVAL)
    State.save(...arguments)
  },
  saveImmediate
})

var appConfig = {
  read: function () {
    var config = localStorage.getItem('config')
    return JSON.parse(config)
  },
  write: function (config) {
    var data = JSON.stringify(config)
    localStorage.setItem('config', data)
  }
}

function getDefaultState () {
  return {
    /**
     * Temporary state.
     */
    logins: [],
    deltachat: {
      chats: [],
      credentials: {},
      ready: false
    },
    /**
     * Persisted state. Must be JSON.
     */
    saved: {
      markRead: true,
      enterKeySends: false,
      notifications: true,
      showNotificationContent: true,
      locale: 'en',
      credentials: null
    }
  }
}

function load () {
  var err
  try {
    var saved = appConfig.read()
  } catch (err) {
    console.log('Missing configuration file. Using default values.', err)
  }
  const state = getDefaultState()
  state.saved = Object.assign(state.saved, err ? {} : saved)
  return state
}

function saveImmediate (state, cb) {
  console.log(`Saving state to localStorage`)
  const copy = Object.assign({}, state.saved)
  try {
    appConfig.write(copy)
  } catch (err) {
    console.log('Got error saving state', err)
  }
}
