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

  componentDidUpdate () {
    const { chat } = this.props
    if (!chat) return
    let contacts = chat.contacts
    if (contacts && contacts.length === 1) {
      this._getEncrInfoForContactId(contacts[0].id)
    }
  }

  _getEncrInfoForContactId (contactId) {
    console.log(`_getEncrInfoForContactId ${contactId}`)
    ipcRenderer.send('getEncrInfo', contactId)
  }

  _renderContactList () {
    return <ContactList
      small
      contacts={this.props.chat.contacts}
      onContactClick={(contact) => this._getEncrInfoForContactId(contact.id)}
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
          { chat.encrInfo && <pre>{chat.encrInfo}</pre>}
          { chat && chat.contacts.length > 1 && this._renderContactList()}
        </div>
      </Dialog>
    )
  }
}

module.exports = EncrInfo
