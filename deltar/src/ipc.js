const EventEmitter = require('events').EventEmitter
const DeltaChat = require('./deltachat')
const functionNames = require('deltachat-js/dc_functions')
const C = require('deltachat-js/constants')

class IPC extends EventEmitter {
  _emit (namespace, cmd, eventString) {
    console.log(eventString)
    try {
      const payload = JSON.parse(eventString)
      this.emit(cmd, ...payload)
    } catch (err) {
      console.error('failed to parse payload', err, namespace, cmd, eventString)
    }
  }

  send (namespace, cmd, payload) {
    window.external.invoke(JSON.stringify({ namespace, cmd, payload }))
  }
}

class Renderer extends EventEmitter {
  constructor (saved, render) {
    super()
    this.rpc = new IPC()
    this.rpc.on('dc', ({ cmd, payload }) => {
      this.emit(cmd, payload)
    })
    functionNames.forEach((cmd) => {
      this.bindings[cmd] = () => {
        var payload = Object.values(arguments)
        console.log('sending to rpc', cmd, payload)
        this.rpc.send('dc', cmd, payload)
      }
    })
    this.dc = new DeltaChat(this.bindings, saved, render, txCoreStrings())
    this.dc.on('*', (...args) => this.emit(this.event, ...args))
  }

  send () {
    var args = Object.values(arguments)
    if (!args.length) throw new Error('cmd not found', args)
    var cmd = args.shift()
    console.log('got cmd', cmd)
    var payload = args
    console.log('got payload', payload)
    var fn = this.dc[cmd]
    console.log('got fn', fn)
    if (fn) return fn.apply(this.dc, payload)
    else throw new Error('cmd not found', args)
  }
}

function txCoreStrings () {
  const tx = window.translate
  const strings = {}
  // TODO: Check if we need the uncommented core translations
  strings[C.DC_STR_NOMESSAGES] = tx('chat_no_messages')
  strings[C.DC_STR_SELF] = tx('self')
  strings[C.DC_STR_DRAFT] = tx('draft')
  strings[C.DC_STR_MEMBER] = tx('n_members', '%1$s', 'other')
  strings[C.DC_STR_CONTACT] = tx('n_contacts', '%1$s', 'other')
  strings[C.DC_STR_VOICEMESSAGE] = tx('voice_message')
  strings[C.DC_STR_DEADDROP] = tx('login_inbox')
  strings[C.DC_STR_IMAGE] = tx('image')
  strings[C.DC_STR_GIF] = tx('gif')
  strings[C.DC_STR_VIDEO] = tx('video')
  strings[C.DC_STR_AUDIO] = tx('audio')
  strings[C.DC_STR_FILE] = tx('file')
  strings[C.DC_STR_ENCRYPTEDMSG] = tx('encrypted_message')
  strings[C.DC_STR_STATUSLINE] = tx('pref_default_status_text')
  strings[C.DC_STR_NEWGROUPDRAFT] = tx('group_hello_draft')
  strings[C.DC_STR_MSGGRPNAME] = tx('systemmsg_group_name_changed')
  strings[C.DC_STR_MSGGRPIMGCHANGED] = tx('systemmsg_group_image_changed')
  strings[C.DC_STR_MSGADDMEMBER] = tx('systemmsg_member_added')
  strings[C.DC_STR_MSGDELMEMBER] = tx('systemmsg_member_removed')
  strings[C.DC_STR_MSGGROUPLEFT] = tx('systemmsg_group_left')
  // strings[C.DC_STR_E2E_AVAILABLE] = tx('DC_STR_E2E_AVAILABLE')
  // strings[C.DC_STR_ENCR_TRANSP] = tx('DC_STR_ENCR_TRANSP')
  // strings[C.DC_STR_ENCR_NONE] = tx('DC_STR_ENCR_NONE')
  strings[C.DC_STR_FINGERPRINTS] = tx('qrscan_fingerprint_label')
  strings[C.DC_STR_READRCPT] = tx('systemmsg_read_receipt_subject')
  strings[C.DC_STR_READRCPT_MAILBODY] = tx('systemmsg_read_receipt_body')
  strings[C.DC_STR_MSGGRPIMGDELETED] = tx('systemmsg_group_image_deleted')
  strings[C.DC_STR_E2E_PREFERRED] = tx('autocrypt_prefer_e2ee')
  strings[C.DC_STR_ARCHIVEDCHATS] = tx('chat_archived_chats_title')
  // strings[C.DC_STR_STARREDMSGS] = tx('DC_STR_STARREDMSGS')
  strings[C.DC_STR_AC_SETUP_MSG_SUBJECT] = tx('autocrypt_asm_subject')
  strings[C.DC_STR_AC_SETUP_MSG_BODY] = tx('autocrypt_asm_general_body')
  strings[C.DC_STR_SELFTALK_SUBTITLE] = tx('chat_self_talk_subtitle')
  strings[C.DC_STR_CANTDECRYPT_MSG_BODY] = tx('systemmsg_cannot_decrypt')
  strings[C.DC_STR_CANNOT_LOGIN] = tx('login_error_cannot_login')
  strings[C.DC_STR_SERVER_RESPONSE] = tx('login_error_server_response')

  return strings
}

module.exports = Renderer
