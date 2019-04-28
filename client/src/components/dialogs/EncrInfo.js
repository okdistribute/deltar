const React = require('react')
const ipcRenderer = window.ipcRenderer
const { Classes, Dialog } = require('@blueprintjs/core')

const ContactList = require('../ContactList')

class EncrInfo extends React.Component {
  constructor (props) {
    super(props)
    this.onClose = this.onClose.bind(this)
  }

  onClose () {
    this.props.onClose()
  }

  _renderContactList () {
    return <ContactList
      small
      contacts={this.props.chat.contacts}
    />
  }

  render () {
    const { chat, isOpen } = this.props
    const tx = window.translate
    return (
      <Dialog
        isOpen={isOpen}
        title={tx('encryption_info_title_desktop')}
        icon='lock'
        onClose={this.onClose}
        canOutsideClickClose={false}>
        <div className={Classes.DIALOG_BODY}>
          <pre>Chat name: { chat && chat.name }</pre>
          { chat && chat.contacts.length > 1 && this._renderContactList()}
        </div>
      </Dialog>
    )
  }
}

module.exports = EncrInfo
