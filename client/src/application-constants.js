const version = require('../package.json').version

function appName () {
  return 'DeltaChat'
}

function appVersion () {
  return `${version}-PREVIEW`
}

function appWindowTitle () {
  return `${appName()} (${appVersion()})`
}

function homePageUrl () {
  return 'https://delta.chat'
}

function gitHubUrl () {
  return 'https://github.com/deltachat/deltachat-desktop'
}

function gitHubIssuesUrl () {
  return `${gitHubUrl()}/issues`
}

function gitHubLicenseUrl () {
  return `${gitHubUrl()}/blob/master/LICENSE`
}

function windowDefaults () {
  const headerHeight = 38
  const messageHeight = 100
  return {
    bounds: {
      width: 500,
      height: headerHeight + messageHeight * 6
    },
    headerHeight,
    minWidth: 450,
    minHeight: 450,
    main: `file://${path.join(__dirname, '..', 'static', 'main.html')}`
  }
}

module.exports = {
  appName,
  appVersion,
  appWindowTitle,
  appIcon,
  homePageUrl,
  gitHubUrl,
  gitHubIssuesUrl,
  gitHubLicenseUrl,
  windowDefaults
}
