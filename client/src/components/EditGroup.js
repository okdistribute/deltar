const ipcRenderer = window.ipcRenderer
const C = require('deltachat-js/constants')
const GroupBase = require('./GroupBase')
const differ = require('array-differ')

class EditGroup extends GroupBase {
  constructor (props) {
    const { chat } = props.screenProps
    const group = {}

    super(props, {
      buttonLabel: 'save_desktop',
      heading: 'menu_edit_group',
      group: group,
      name: chat.name,
      image: chat.profileImage,
      showVerifiedContacts: chat.isVerified,
      showQrInviteCodeButton: chat.isVerified,
      chatId: chat.id
    })

    ipcRenderer.on('getChatContactsResp', (before) => {
      before = before.filter(id => id !== C.DC_CONTACT_ID_SELF).map(id => Number(id))
      before.forEach(id => { group[id] = true })
    })
    ipcRenderer.send('getChatContacts', chat.id)
  }

  isButtonDisabled () {
    return !this.state.name.length
  }

  back () {
    this.props.changeScreen('ChatList')
  }

  onSubmit () {
    const after = Object.keys(this.state.group).map(id => Number(id))
    const remove = differ(this.before, after)
    const add = differ(after, this.before)
    const { chat } = this.props.screenProps

    ipcRenderer.send(
      'modifyGroup',
      chat.id,
      this.state.name,
      this.state.image,
      remove,
      add
    )

    this.props.changeScreen('ChatList')
  }
}

module.exports = EditGroup
