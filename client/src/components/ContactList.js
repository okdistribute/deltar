const React = require('react')
const ipcRenderer = window.ipcRenderer
const C = require('deltachat-js/constants')
const styled = require('styled-components').default

const { RenderContact } = require('./Contact')
const SearchInput = require('./SearchInput.js')

const ContactListDiv = styled.div`
  max-height: 400px;
  overflow: scroll;
  margin-top: 10px;
  border: 1px solid darkgrey;
  .module-contact-list-item--with-click-handler {
    padding: 10px;
  }
  .module-contact-list-item--with-click-handler:hover {
    background-color: darkgrey;
  }
`

class ContactList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      queryStr: '',
      showVerifiedContacts: false,
      contacts: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.search = this.search.bind(this)
  }

  handleSearch (event) {
    this.search(event.target.value)
  }

  search (queryStr) {
    this.setState({ queryStr })
  }

  componentDidMount () {
    ipcRenderer.on('getContactsResp', (contacts) => {
      this.setState({contacts})
    })
    if (!this.props.contacts) this._getContacts()
    this.search('')
  }

  _getContacts () {
    const listFlags = this.props.showVerifiedContacts ? C.DC_GCL_VERIFIED_ONLY : 0
    ipcRenderer.send(
      'getContacts',
      listFlags,
      this.state.queryStr
    )
  }

  render () {
    const { childProps, onContactClick, filter } = this.props
    var contacts = this.props.contacts || this.state.contacts
    if (filter) contacts = contacts.filter(filter)
    return <div>
      <SearchInput
        onChange={this.handleSearch}
        value={this.state.queryStr}
      />
      <ContactListDiv>
        {contacts.map((contact) => {
          var props = childProps ? childProps(contact) : {}
          return (
            <RenderContact
              key={contact.id}
              onClick={() => onContactClick(contact)}
              contact={contact}
              {...props}
            />
          )
        })}
      </ContactListDiv>
    </div>
  }
}
module.exports = ContactList
